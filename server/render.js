import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import {
  SITE_URL, LOCALES, HOME_TITLES, DESCRIPTIONS, OG_LOCALES,
  homePath, contentUrl, imageUrl, alternatesFor, contentSchemas, organizationSchema, safeJson, absoluteUrl,
} from "../src/lib/seo.js";

export const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const metaTag = (key, value) => value ? `<meta ${key.startsWith("og:") || key.startsWith("article:") ? "property" : "name"}="${key}" content="${escapeHtml(value)}" data-intexto-seo>` : "";

export function renderHead({ content, locale = "fr", noindex = false, title: customTitle }, mediaBase) {
  const title = customTitle || (content ? `${content.title} | Intexto` : HOME_TITLES[locale]);
  const description = content?.excerpt || DESCRIPTIONS[locale];
  const url = content ? contentUrl(content, locale) : SITE_URL + homePath(locale);
  const image = imageUrl(content || {}, mediaBase);
  const alternates = content ? alternatesFor(content, locale) : Object.fromEntries(LOCALES.map(loc => [loc, SITE_URL + homePath(loc)]));
  const schemas = noindex ? [] : content ? contentSchemas(content, locale, mediaBase) : [organizationSchema(), {
    "@context": "https://schema.org", "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "Intexto", url: `${SITE_URL}/`,
    inLanguage: LOCALES, publisher: { "@id": `${SITE_URL}/#organization` },
  }];
  const values = {
    description, author: content?.author || "Rédaction Intexto",
    robots: noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    "og:type": content?.type === "article" ? "article" : "website", "og:url": url,
    "og:title": title, "og:description": description, "og:image": image, "og:site_name": "Intexto", "og:locale": OG_LOCALES[locale],
    "twitter:card": "summary_large_image", "twitter:site": "@jeannuma", "twitter:title": title,
    "twitter:description": description, "twitter:image": image,
    ...(content?.type === "article" ? { "article:published_time": content.publishedDate || content.publishedAt || content.createdAt, "article:modified_time": content.updatedAt } : {}),
  };
  return `<title data-intexto-seo>${escapeHtml(title)}</title>\n${Object.entries(values).map(([key, value]) => metaTag(key, value)).join("\n")}
${noindex ? "" : `<link rel="canonical" href="${escapeHtml(url)}" data-intexto-seo>`}
${noindex ? "" : Object.entries(alternates).map(([loc, href]) => `<link rel="alternate" hreflang="${loc}" href="${escapeHtml(href)}" data-intexto-seo>`).join("\n")}
${!noindex && alternates.fr ? `<link rel="alternate" hreflang="x-default" href="${escapeHtml(alternates.fr)}" data-intexto-seo>` : ""}
<script type="application/ld+json" id="intexto-structured-data">${safeJson(schemas)}</script>`;
}

function readerHeader(locale) {
  return `<header><a href="${homePath(locale)}"><img src="/Images/intextologo2.png" width="180" alt="Intexto"></a>
<nav aria-label="Languages">${LOCALES.map(loc => `<a href="${homePath(loc)}" lang="${loc}">${loc.toUpperCase()}</a>`).join(" · ")}</nav></header>`;
}
const readerFooter = `<footer><p>Intexto — Montréal, Québec · <a href="mailto:info@intexto.ca">info@intexto.ca</a></p><a href="https://pierremichaudpm.github.io/intextoarchives/">Archives 2014–2025</a></footer>`;

export function renderContent(content, locale, mediaBase) {
  const date = content.publishedDate || content.publishedAt || content.createdAt;
  const body = renderToStaticMarkup(createElement(ReactMarkdown, null, content.content || content.description || ""));
  const translations = alternatesFor(content, locale);
  const media = absoluteUrl(content.videoUrl || content.audioFile?.url || content.audioUrl, mediaBase);
  return `<div class="server-reader">${readerHeader(locale)}<main><article>
<h1>${escapeHtml(content.title)}</h1><p>${escapeHtml(content.author || "Rédaction Intexto")}${date ? ` · <time datetime="${escapeHtml(date)}">${escapeHtml(new Date(date).toLocaleDateString(locale === "ht" ? "fr-CA" : locale + "-CA", { timeZone: "America/Toronto" }))}</time>` : ""}</p>
<p>${escapeHtml(content.excerpt)}</p><figure><img src="${escapeHtml(imageUrl(content, mediaBase))}" alt="${escapeHtml(content.image?.alternativeText || content.title)}">${content.imageCaption || content.imageCredit ? `<figcaption>${escapeHtml([content.imageCaption, content.imageCredit].filter(Boolean).join(" — "))}</figcaption>` : ""}</figure>
${body}${content.type !== "article" && media ? `<p><a href="${escapeHtml(media)}">${locale === "en" ? "Play" : locale === "ht" ? "Koute / Gade" : "Écouter / Regarder"}</a></p>` : ""}
<nav aria-label="Translations">${Object.entries(translations).map(([loc, url]) => `<a href="${escapeHtml(url)}" hreflang="${loc}">${loc.toUpperCase()}</a>`).join(" · ")}</nav>
</article></main>${readerFooter}</div>`;
}

export function renderHome(items, locale) {
  return `<div class="server-reader">${readerHeader(locale)}<main><h1>${HOME_TITLES[locale]}</h1><p>${DESCRIPTIONS[locale]}</p>
${items.map(item => `<article><h2><a href="${escapeHtml(contentUrl(item, locale))}">${escapeHtml(item.title)}</a></h2><p>${escapeHtml(item.excerpt)}</p></article>`).join("\n")}
</main>${readerFooter}</div>`;
}

export function renderDocument(template, { content, items = [], locale = "fr", noindex = false, title, body }, mediaBase) {
  // Retain the built application scripts, icons and analytics; replace only SEO tags.
  const cleaned = template
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, "")
    .replace(/<meta\b[^>]*(?:name=["'](?:description|title|keywords|author|robots|language|revisit-after|twitter:[^"']+)["']|property=["'](?:og|article):[^"']+["'])[^>]*>/gi, "")
    .replace(/<link\b[^>]*rel=["'](?:canonical|alternate)["'][^>]*>/gi, "");
  const bootstrap = !noindex ? `<script>window.__INTEXTO_BOOTSTRAP__=${safeJson({ locale, items: content ? [content] : items })};</script>` : "";
  return cleaned.replace(/<html\b[^>]*>/i, `<html lang="${locale}">`)
    .replace("</head>", () => `${renderHead({ content, locale, noindex, title }, mediaBase)}</head>`)
    .replace(/<div id="root"><\/div>/, () => `<div id="root">${body ?? (content ? renderContent(content, locale, mediaBase) : renderHome(items, locale))}</div>${bootstrap}`);
}

export function renderSitemap(items, { news = false, now = Date.now() } = {}) {
  const entries = news ? [] : LOCALES.map(locale => `<url><loc>${SITE_URL}${homePath(locale)}</loc></url>`);
  for (const item of items) {
    if (!item.slug) continue;
    const date = item.publishedDate || item.publishedAt || item.createdAt;
    const timestamp = Date.parse(date);
    if (news && (item.type !== "article" || !Number.isFinite(timestamp) || timestamp > now || now - timestamp > 48 * 60 * 60 * 1000)) continue;
    const lastmod = Number.isFinite(Date.parse(item.updatedAt)) ? `<lastmod>${escapeHtml(item.updatedAt)}</lastmod>` : "";
    entries.push(`<url><loc>${escapeHtml(contentUrl(item))}</loc>${lastmod}${news ? `<news:news><news:publication><news:name>Intexto</news:name><news:language>${item.locale}</news:language></news:publication><news:publication_date>${escapeHtml(date)}</news:publication_date><news:title>${escapeHtml(item.title)}</news:title></news:news>` : ""}</url>`);
  }
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${news ? ' xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"' : ""}>${entries.join("\n")}</urlset>`;
}
