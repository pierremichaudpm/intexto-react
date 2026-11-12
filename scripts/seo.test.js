import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { createApp } from "../server/app.js";
import { createContentStore } from "../server/content.js";
import { renderDocument, renderSitemap } from "../server/render.js";
import { contentSchemas, alternatesFor, safeJson } from "../src/lib/seo.js";

const template = '<!doctype html><html lang="fr"><head><title>Old title</title><meta name="description" content="Old description"><meta property="og:url" content="old"><script type="module" src="/assets/app.js"></script></head><body><div id="root"></div></body></html>';
const article = {
  type: "article", documentId: "document-1", locale: "fr", title: "Un vrai article & son titre", slug: "article-10",
  excerpt: "Un résumé propre à cet article.", content: "## Une information vérifiable\n\nUn paragraphe **complet**, accessible sans JavaScript.",
  publishedAt: "2026-11-12T12:00:00.000Z", updatedAt: "2026-11-12T13:00:00.000Z", author: "Jean Numa Goudou",
  image: { url: "https://images.example/photo.jpg" },
  localizations: [
    { locale: "en", slug: "a-real-article", publishedAt: "2026-11-12T12:30:00.000Z" },
    { locale: "ht", slug: "yon-bouyon", publishedAt: null },
  ],
};
const defaultStore = {
  getContent: async (_type, slug, locale) => slug === article.slug && locale === "fr" ? article : null,
  getHome: async () => [article],
  getSitemapItems: async () => [article],
};
async function withServer(run, store = defaultStore) {
  const server = createApp({ template, distDir: "/tmp/intexto-no-static-files", strapiUrl: "https://cms.example", store }).listen(0, "127.0.0.1");
  await once(server, "listening");
  const base = `http://127.0.0.1:${server.address().port}`;
  try { await run(base); } finally { await new Promise(resolve => server.close(resolve)); }
}

test("Readers and all crawlers get the same full article, not a redirect or bot-only summary", async () => {
  await withServer(async base => {
    const results = await Promise.all(["Mozilla/5.0", "Googlebot", "bingbot", "OAI-SearchBot", "PerplexityBot", "facebookexternalhit"].map(async ua => {
      const response = await fetch(base + "/article/article-10", { headers: { "User-Agent": ua } });
      assert.equal(response.status, 200);
      return response.text();
    }));
    results.forEach(html => assert.equal(html, results[0]));
    const html = results[0];
    assert.match(html, /Un paragraphe <strong>complet<\/strong>/);
    assert.doesNotMatch(html, /http-equiv="refresh"|Old title|Old description/);
    assert.equal((html.match(/<title\b/g) || []).length, 1);
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
    assert.match(html, /canonical" href="https:\/\/www.intexto.ca\/article\/article-10"/);
    assert.match(html, /hreflang="en" href="https:\/\/www.intexto.ca\/en\/article\/a-real-article"/);
    assert.doesNotMatch(html, /hreflang="ht"|\/en\/article\/article-10/);
    assert.match(html, /type="module"/);
    const bootstrap = JSON.parse(html.match(/window\.__INTEXTO_BOOTSTRAP__=(.*?);<\/script>/s)[1]);
    assert.equal(bootstrap.items[0].documentId, article.documentId);
    const compressed = await fetch(base + "/article/article-10", { headers: { "Accept-Encoding": "gzip" } });
    assert.equal(compressed.headers.get("content-encoding"), "gzip");
    assert.match(compressed.headers.get("vary"), /Accept-Encoding/);
    assert.equal(await compressed.text(), html);
  });
});

test("Homepage exposes real article links and localized canonical URLs", async () => {
  await withServer(async base => {
    const html = await (await fetch(base + "/")).text();
    assert.match(html, /<a href="https:\/\/www.intexto.ca\/article\/article-10">/);
    assert.match(html, /NewsMediaOrganization/);
    const response = await fetch(base + "/en", { redirect: "manual" });
    assert.equal(response.status, 301);
    assert.equal(response.headers.get("location"), "/en/");
    assert.match(await (await fetch(base + "/en/")).text(), /<html lang="en">/);
  });
});

test("Missing content and arbitrary routes are real 404s; errors cannot become an indexable homepage", async () => {
  await withServer(async base => {
    for (const path of ["/article/absent", "/route-inconnue", "/en/article/absent", "/assets/absent.js"]) {
      const response = await fetch(base + path);
      assert.equal(response.status, 404);
      const html = await response.text();
      assert.match(html, /noindex, follow/);
      assert.doesNotMatch(html, /type="module"|window\.__INTEXTO_BOOTSTRAP__/);
    }
  });
});

test("A CMS outage returns retryable 503s, not a cached 404 or empty sitemap", async () => {
  const fail = async () => { throw new Error("CMS unavailable (test)"); };
  await withServer(async base => {
    for (const path of ["/", "/article/article-10", "/sitemap.xml"]) {
      const response = await fetch(base + path);
      assert.equal(response.status, 503);
      assert.equal(response.headers.get("retry-after"), "60");
      assert.equal(response.headers.get("cache-control"), "no-store");
    }
  }, { getContent: fail, getHome: fail, getSitemapItems: fail });
});

test("Historical URLs redirect to the exact recovered article; unknown slugs never redirect", async () => {
  await withServer(async base => {
    const response = await fetch(base + "/mme-chancy-ou-la-premiere-maison-dhaiti/", { redirect: "manual" });
    assert.equal(response.status, 301);
    assert.equal(response.headers.get("location"), "https://pierremichaudpm.github.io/intextoarchives/posts/mme-chancy-ou-la-premiere-maison-dhaiti.html");
    assert.equal((await fetch(base + "/une-archive-inexistante/", { redirect: "manual" })).status, 404);
  });
});

test("Preview pages remain unindexed and robots declares the canonical live sitemaps", async () => {
  await withServer(async base => {
    const response = await fetch(base + "/preview?secret=test");
    assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
    assert.equal(response.headers.get("cache-control"), "no-store");
    const robots = await (await fetch(base + "/robots.txt")).text();
    assert.match(robots, /User-agent: \*\nAllow: \//);
    assert.match(robots, /Sitemap: https:\/\/www.intexto.ca\/sitemap.xml/);
  });
});

test("News sitemap includes only articles published in the last 48 hours", () => {
  const old = { ...article, slug: "old", publishedAt: "2026-11-01T12:00:00Z" };
  const future = { ...article, slug: "future", publishedAt: "2026-12-01T12:00:00Z" };
  const translated = { ...article, locale: "en", slug: "english" };
  const items = [article, old, future, translated, { ...article, type: "video", slug: "video" }];
  const news = renderSitemap(items, { news: true, now: Date.parse("2026-11-12T15:00:00Z") });
  assert.equal((news.match(/<news:news>/g) || []).length, 2);
  assert.doesNotMatch(news, /\/old<|\/future<|\/video\//);
  assert.match(news, /<news:language>en<\/news:language>/);
  const normal = renderSitemap(items);
  assert.match(normal, /\/en\/article\/english/);
  assert.doesNotMatch(normal, /\?category=/);
});

test("Schemas use slug URLs, real modification dates and URL strings for media", () => {
  const schema = contentSchemas(article)[1];
  assert.equal(schema.mainEntityOfPage["@id"], "https://www.intexto.ca/article/article-10");
  assert.equal(schema.dateModified, article.updatedAt);
  assert.deepEqual(schema.image, [article.image.url]);
  const video = contentSchemas({ ...article, type: "video", videoUrl: "https://youtu.be/abcdefghijk", duration: "1:02:03" })[1];
  assert.equal(video.embedUrl, "https://www.youtube.com/embed/abcdefghijk");
  assert.equal(video.duration, "PT1H02M03S");
  assert.equal(video.contentUrl, undefined);
  assert.equal(alternatesFor(article).ht, undefined);
});

test("CMS text cannot escape HTML attributes, JSON scripts or Markdown", () => {
  const unsafe = { ...article, title: '</script><script>alert("x")</script> $&', content: '<script>alert("x")</script>\n\n[bad](javascript:alert(1))' };
  const html = renderDocument(template, { content: unsafe }, "https://cms.example");
  assert.doesNotMatch(html, /<script>alert|href="javascript:/);
  assert.match(html, /&lt;\/script&gt;/);
  assert.equal(JSON.parse(safeJson(unsafe)).title, unsafe.title);
});

test("CMS pagination covers all pages and locales and explicitly requests published content", async () => {
  const calls = [];
  const store = createContentStore("https://cms.example", async url => {
    const parsed = new URL(url);
    calls.push(parsed);
    const page = Number(parsed.searchParams.get("pagination[page]") || 1);
    assert.equal(parsed.searchParams.get("status"), "published");
    return { ok: true, json: async () => ({ data: [{ slug: `page-${page}`, locale: parsed.searchParams.get("locale") }], meta: { pagination: { pageCount: 2 } } }) };
  });
  const items = await store.getSitemapItems();
  assert.equal(items.length, 18);
  assert.deepEqual([...new Set(items.map(item => item.locale))].sort(), ["en", "fr", "ht"]);
  assert.equal(calls.length, 18);
  await store.getSitemapItems();
  assert.equal(calls.length, 18, "successful requests are cached");
});

test("Failed CMS fetches are not cached and concurrent requests share one fetch", async () => {
  let calls = 0;
  const store = createContentStore("https://cms.example", async () => {
    calls++;
    if (calls === 1) return { ok: false, status: 503 };
    return { ok: true, json: async () => ({ data: [article] }) };
  });
  await assert.rejects(store.getContent("article", "article-10"));
  const result = await Promise.all([store.getContent("article", "article-10"), store.getContent("article", "article-10")]);
  assert.equal(result[0].slug, article.slug);
  assert.equal(calls, 2);
});
