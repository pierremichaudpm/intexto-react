import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const STRAPI_URL =
  process.env.VITE_STRAPI_URL ||
  "https://intexto-strapi-production.up.railway.app";
const SITE_URL = "https://www.intexto.ca";
const SITE_NAME = "Intexto";
const DEFAULT_IMAGE = `${SITE_URL}/Images/og-image.png`;
const DEFAULT_DESCRIPTION =
  "Intexto est le journal de référence de la communauté haïtienne à Montréal. Actualités, politique, culture, et événements.";
const DIST_DIR = join(__dirname, "dist");

// Social media bot user-agent patterns
const BOT_PATTERNS = [
  "facebookexternalhit",
  "Facebot",
  "Twitterbot",
  "LinkedInBot",
  "WhatsApp",
  "Slackbot",
  "TelegramBot",
  "Discordbot",
  "Pinterest",
  "Googlebot",
  "bingbot",
  "Applebot",
];

function isBot(userAgent) {
  if (!userAgent) return false;
  return BOT_PATTERNS.some((bot) => userAgent.includes(bot));
}

async function fetchContent(type, slug) {
  const endpointMap = {
    article: "articles",
    video: "videos",
    audio: "audios",
  };
  const endpoint = endpointMap[type];
  if (!endpoint) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const url = `${STRAPI_URL}/api/${endpoint}?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`;
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) return null;

    const data = await response.json();
    const item = data.data?.[0];
    if (!item) return null;

    return extractMeta(type, item);
  } catch (error) {
    console.error(`[og-meta] Error fetching ${type}/${slug}:`, error.message);
    return null;
  }
}

function extractMeta(type, item) {
  const title = item.title || SITE_NAME;
  const description = item.excerpt || item.description || DEFAULT_DESCRIPTION;
  const author = item.author || "Rédaction Intexto";
  const publishedAt = item.publishedDate || item.publishedAt || item.createdAt;

  let image = DEFAULT_IMAGE;
  const imageField =
    type === "video"
      ? item.thumbnail
      : type === "audio"
        ? item.coverImage
        : item.image;
  if (imageField?.url) {
    image = imageField.url.startsWith("http")
      ? imageField.url
      : `${STRAPI_URL}${imageField.url}`;
  }

  const slug = item.slug;
  const url = `${SITE_URL}/${type}/${slug}`;

  return { title, description, image, url, author, publishedAt, type };
}

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildOgHtml(meta) {
  const ogType = meta.type === "article" ? "article" : "website";
  const escapedTitle = escapeHtml(meta.title);
  const escapedDescription = escapeHtml(meta.description);
  const escapedAuthor = escapeHtml(meta.author);

  return `<!DOCTYPE html>
<html lang="fr" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <title>${escapedTitle} | ${SITE_NAME}</title>
  <meta name="description" content="${escapedDescription}">
  <meta name="author" content="${escapedAuthor}">
  <link rel="canonical" href="${meta.url}">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="${ogType}">
  <meta property="og:url" content="${meta.url}">
  <meta property="og:title" content="${escapedTitle}">
  <meta property="og:description" content="${escapedDescription}">
  <meta property="og:image" content="${meta.image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:locale" content="fr_CA">
  ${meta.publishedAt ? `<meta property="article:published_time" content="${meta.publishedAt}">` : ""}
  ${meta.author ? `<meta property="article:author" content="${escapedAuthor}">` : ""}

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@jeannuma">
  <meta name="twitter:creator" content="@jeannuma">
  <meta name="twitter:url" content="${meta.url}">
  <meta name="twitter:title" content="${escapedTitle}">
  <meta name="twitter:description" content="${escapedDescription}">
  <meta name="twitter:image" content="${meta.image}">

  <!-- Redirect real users to the SPA -->
  <meta http-equiv="refresh" content="0;url=${meta.url}">
</head>
<body>
  <h1>${escapedTitle}</h1>
  <p>${escapedDescription}</p>
  <img src="${meta.image}" alt="${escapedTitle}">
  <a href="${meta.url}">Lire sur ${SITE_NAME}</a>
</body>
</html>`;
}

const app = express();

// Bot interception for content routes
app.get("/:type(article|video|audio)/:slug", async (req, res, next) => {
  const userAgent = req.headers["user-agent"] || "";

  if (!isBot(userAgent)) {
    return next();
  }

  const { type, slug } = req.params;
  const meta = await fetchContent(type, decodeURIComponent(slug));

  if (!meta) {
    return next();
  }

  res.set("Content-Type", "text/html; charset=UTF-8");
  res.set("Cache-Control", "public, max-age=300, s-maxage=600");
  res.send(buildOgHtml(meta));
});

// Serve static files from dist/
app.use(express.static(DIST_DIR));

// SPA fallback - serve index.html for all other routes
app.get("*", (req, res) => {
  res.sendFile(join(DIST_DIR, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[server] Intexto running on port ${PORT}`);
});
