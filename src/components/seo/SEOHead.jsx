import { useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import {
  SITE_URL, LOCALES, HOME_TITLES, DESCRIPTIONS, OG_LOCALES, homePath,
  contentSchemas, organizationSchema, alternatesFor, absoluteUrl, safeJson,
} from "../../lib/seo";

const SEOHead = ({ title, description, image, url, type = "website", author = "Rédaction Intexto", publishedTime, modifiedTime, content }) => {
  const { locale } = useLanguage();
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = title || HOME_TITLES[locale];
    const canonical = url || SITE_URL + homePath(locale);
    const summary = description || DESCRIPTIONS[locale];
    const picture = absoluteUrl(image) || `${SITE_URL}/Images/og-image.png`;
    const values = {
      description: summary, author,
      robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      "og:type": type, "og:url": canonical, "og:title": document.title,
      "og:description": summary, "og:image": picture, "og:site_name": "Intexto", "og:locale": OG_LOCALES[locale],
      "twitter:card": "summary_large_image", "twitter:site": "@jeannuma", "twitter:title": document.title,
      "twitter:description": summary, "twitter:image": picture, "twitter:url": canonical,
      "article:published_time": publishedTime, "article:modified_time": modifiedTime,
    };
    for (const [key, value] of Object.entries(values)) {
      const attr = key.startsWith("og:") || key.startsWith("article:") ? "property" : "name";
      const existing = [...document.head.querySelectorAll(`meta[${attr}="${key}"]`)];
      const node = existing.shift() || document.createElement("meta");
      existing.forEach(extra => extra.remove());
      if (!value) { node.remove(); continue; }
      node.setAttribute(attr, key);
      node.content = value;
      node.dataset.intextoSeo = "";
      if (!node.isConnected) document.head.append(node);
    }
    document.head.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]').forEach(node => node.remove());
    const addLink = (rel, href, lang) => {
      const node = document.createElement("link");
      node.rel = rel; node.href = href;
      if (lang) node.hreflang = lang;
      node.dataset.intextoSeo = "";
      document.head.append(node);
    };
    addLink("canonical", canonical);
    const alternates = content ? alternatesFor(content, locale) : Object.fromEntries(LOCALES.map(loc => [loc, SITE_URL + homePath(loc)]));
    Object.entries(alternates).forEach(([loc, href]) => addLink("alternate", href, loc));
    if (alternates.fr) addLink("alternate", alternates.fr, "x-default");
    const schemas = content ? contentSchemas(content, locale) : [organizationSchema(), {
      "@context": "https://schema.org", "@type": "WebSite", "@id": `${SITE_URL}/#website`,
      name: "Intexto", url: `${SITE_URL}/`, inLanguage: LOCALES, publisher: { "@id": `${SITE_URL}/#organization` },
    }];
    const script = document.getElementById("intexto-structured-data") || document.createElement("script");
    script.id = "intexto-structured-data";
    script.type = "application/ld+json";
    script.textContent = safeJson(schemas);
    if (!script.isConnected) document.head.append(script);
  }, [title, description, image, url, type, author, publishedTime, modifiedTime, content, locale]);
  return null;
};

export default SEOHead;
