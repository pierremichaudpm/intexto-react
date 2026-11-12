export const SITE_URL = "https://www.intexto.ca";
export const LOCALES = ["fr", "en", "ht"];
export const OG_LOCALES = { fr: "fr_CA", en: "en_CA", ht: "ht_HT" };
export const HOME_TITLES = {
  fr: "Intexto — Journal haïtien à Montréal et au Québec",
  en: "Intexto — Haitian news in Montreal and Quebec",
  ht: "Intexto — Nouvèl kominote ayisyen nan Monreyal ak Kebèk",
};
export const DESCRIPTIONS = {
  fr: "Intexto, journal de la communauté haïtienne à Montréal et au Québec : actualités, politique, immigration, culture, reportages, vidéos et balados.",
  en: "Intexto covers Montreal and Quebec's Haitian community: news, politics, immigration, culture, reporting, videos and podcasts.",
  ht: "Intexto, jounal kominote ayisyen nan Monreyal ak Kebèk : nouvèl, politik, imigrasyon, kilti, repòtaj, videyo ak balado.",
};

export const homePath = (locale = "fr") => locale === "fr" ? "/" : `/${locale}/`;
export const contentPath = (type, slug, locale = "fr") =>
  `${locale === "fr" ? "" : `/${locale}`}/${type}/${encodeURIComponent(slug)}`;
export const contentUrl = (content, locale = content.locale || "fr") =>
  SITE_URL + contentPath(content.type, content.slug, locale);

export function absoluteUrl(value, base = SITE_URL) {
  if (!value || typeof value !== "string") return undefined;
  try {
    const url = new URL(value, base);
    return ["https:", "http:"].includes(url.protocol) ? url.href : undefined;
  } catch { return undefined; }
}

export function imageUrl(content, base = SITE_URL) {
  const image = content.image || content.thumbnail || content.coverImage;
  return absoluteUrl(typeof image === "string" ? image : image?.url, base)
    || absoluteUrl(content.imageFallback, base)
    || `${SITE_URL}/Images/og-image.png`;
}

export function alternatesFor(content, locale = content.locale || "fr") {
  const result = { [locale]: contentUrl(content, locale) };
  for (const item of content.localizations || []) {
    if (LOCALES.includes(item.locale) && item.slug && item.publishedAt) {
      result[item.locale] = contentUrl({ ...item, type: content.type }, item.locale);
    }
  }
  return { ...result, ...content.alternates };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org", "@type": "NewsMediaOrganization",
    "@id": `${SITE_URL}/#organization`, name: "Intexto", alternateName: "InTexto, jounal nou!",
    url: `${SITE_URL}/`, description: DESCRIPTIONS.fr,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/Images/intextologo.png` },
    email: "info@intexto.ca", areaServed: ["Montréal", "Québec", "Canada"],
    sameAs: ["https://www.facebook.com/jnnuma/", "https://x.com/jeannuma", "https://www.instagram.com/jnnuma/"],
  };
}

export function durationISO(duration) {
  if (typeof duration !== "string") return undefined;
  if (/^PT(?:\d+H)?(?:\d+M)?(?:\d+(?:\.\d+)?S)?$/.test(duration) && duration !== "PT") return duration;
  const parts = duration.split(":");
  if (![2, 3].includes(parts.length) || !parts.every(p => /^\d+$/.test(p))) return undefined;
  return parts.length === 3 ? `PT${parts[0]}H${parts[1]}M${parts[2]}S` : `PT${parts[0]}M${parts[1]}S`;
}

export function contentSchemas(content, locale = content.locale || "fr", base = SITE_URL) {
  const url = contentUrl(content, locale);
  const date = content.date || content.publishedDate || content.publishedAt || content.createdAt;
  const image = imageUrl(content, base);
  const author = content.author || "Rédaction Intexto";
  const schema = {
    "@context": "https://schema.org",
    "@type": content.type === "video" ? "VideoObject" : content.type === "audio" ? "AudioObject" : "NewsArticle",
    "@id": `${url}#content`, url, name: content.title, headline: content.title,
    description: content.excerpt, image: [image], inLanguage: locale,
    datePublished: date, dateModified: content.updatedAt || date,
    author: [{ "@type": /^(Rédaction|Équipe)/i.test(author) ? "Organization" : "Person", name: author }],
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
  if (content.type !== "article") {
    schema.uploadDate = date;
    schema.duration = durationISO(content.duration);
    const media = absoluteUrl(content.videoUrl || content.audioFile?.url || content.audioUrl, base);
    const youtube = media?.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
    if (youtube) schema.embedUrl = `https://www.youtube.com/embed/${youtube[1]}`;
    else if (media) schema.contentUrl = media;
    if (content.type === "video") schema.thumbnailUrl = [image];
  }
  return [organizationSchema(), schema, {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: locale === "en" ? "Home" : locale === "ht" ? "Akèy" : "Accueil", item: SITE_URL + homePath(locale) },
      { "@type": "ListItem", position: 2, name: content.title, item: url },
    ],
  }];
}

export const safeJson = (value) => JSON.stringify(value).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
