import express from "express";
import compression from "compression";
import { Buffer } from "node:buffer";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createContentStore } from "./content.js";
import { renderDocument, renderSitemap } from "./render.js";
import { SITE_URL } from "../src/lib/seo.js";

const legacyRedirects = JSON.parse(readFileSync(new URL("./legacy-redirects.json", import.meta.url), "utf8"));

export function createApp({ distDir, strapiUrl, store = createContentStore(strapiUrl), template = readFileSync(join(distDir, "index.html"), "utf8") }) {
  const app = express();
  app.disable("x-powered-by");
  app.use(compression());
  app.get("/healthz", (_req, res) => res.type("text").send("ok"));

  // Keep API requests on intexto.ca for readers on restricted networks.
  app.use("/api", async (req, res) => {
    try {
      const response = await fetch(`${strapiUrl}/api${req.url}`, {
        method: req.method,
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(15000),
        ...(req.method !== "GET" && req.method !== "HEAD" ? { body: JSON.stringify(req.body) } : {}),
      });
      res.status(response.status);
      res.set("Content-Type", response.headers.get("content-type") || "application/json");
      res.set("Cache-Control", req.method === "GET" && response.ok ? "public, max-age=60, s-maxage=120" : "no-store");
      res.send(Buffer.from(await response.arrayBuffer()));
    } catch (error) {
      console.error("[proxy]", error.message);
      res.status(502).json({ error: "Backend unavailable" });
    }
  });

  app.get("/robots.txt", (_req, res) => {
    res.type("text").send(`User-agent: *\nAllow: /\nDisallow: /preview\n\nSitemap: ${SITE_URL}/sitemap.xml\nSitemap: ${SITE_URL}/news-sitemap.xml\n`);
  });
  for (const path of ["/sitemap.xml", "/news-sitemap.xml"]) {
    app.get(path, async (req, res) => {
      try {
        const items = await store.getSitemapItems();
        res.type("application/xml").set("Cache-Control", "public, max-age=60, s-maxage=60").send(renderSitemap(items, { news: req.path === "/news-sitemap.xml" }));
      } catch (error) {
        console.error("[sitemap]", error.message);
        res.status(503).set("Retry-After", "60").set("Cache-Control", "no-store").type("text").send("Sitemap temporarily unavailable");
      }
    });
  }

  function sendError(res, status, locale = "fr") {
    const title = status === 503 ? "Service temporairement indisponible" : "Page introuvable";
    const errorTemplate = template.replace(/<script\b[^>]*type="module"[^>]*><\/script>/gi, "");
    res.status(status).type("html").set("Cache-Control", "no-store");
    if (status === 503) res.set("Retry-After", "60");
    return res.send(renderDocument(errorTemplate, { locale, noindex: true, title,
      body: `<main class="server-reader"><h1>${title}</h1><p><a href="/">Retour à Intexto</a></p></main>`,
    }, strapiUrl));
  }

  // Identical complete HTML for readers, search crawlers and AI crawlers.
  app.get(["/:type(article|video|audio)/:slug", "/:lang(en|ht)/:type(article|video|audio)/:slug"], async (req, res) => {
    const { type, slug, lang = "fr" } = req.params;
    if (req.path.endsWith("/")) return res.redirect(301, req.path.slice(0, -1) + (req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : ""));
    try {
      const content = await store.getContent(type, slug, lang);
      if (!content) return sendError(res, 404, lang);
      res.type("html").set("Cache-Control", "public, max-age=60, s-maxage=60").send(renderDocument(template, { content, locale: lang }, strapiUrl));
    } catch (error) {
      console.error("[content]", error.message);
      sendError(res, 503, lang);
    }
  });

  app.get(["/", "/en/", "/ht/"], async (req, res) => {
    const locale = req.path.match(/^\/(en|ht)/)?.[1] || "fr";
    if (req.path === "/en" || req.path === "/ht") return res.redirect(301, req.path + "/" + (req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : ""));
    try {
      const items = await store.getHome(locale);
      res.type("html").set("Cache-Control", "public, max-age=60, s-maxage=60").send(renderDocument(template, { items, locale }, strapiUrl));
    } catch (error) {
      console.error("[home]", error.message);
      sendError(res, 503, locale);
    }
  });

  app.get("/preview", (_req, res) => res.type("html").set("X-Robots-Tag", "noindex, nofollow").set("Cache-Control", "no-store")
    .send(renderDocument(template, { noindex: true, body: "" }, strapiUrl)));
  app.get("/index.html", (_req, res) => res.redirect(301, "/"));

  app.use((req, res, next) => {
    const slug = legacyRedirects[req.path.replace(/\/$/, "")];
    if ((req.method === "GET" || req.method === "HEAD") && slug) {
      return res.redirect(301, `https://pierremichaudpm.github.io/intextoarchives/posts/${encodeURIComponent(slug)}.html`);
    }
    next();
  });
  app.use(express.static(distDir, { index: false }));
  app.use((_req, res) => sendError(res, 404));
  app.use((error, _req, res, _next) => {
    // Express identifies error middleware by its four arguments.
    void _next;
    console.error("[server]", error.message);
    sendError(res, error instanceof URIError ? 400 : 500);
  });
  return app;
}
