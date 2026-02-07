/**
 * Netlify Edge Function: Social Media OG Meta Tags
 *
 * Intercepts requests from social media crawlers (Facebook, Twitter, LinkedIn, WhatsApp, etc.)
 * and serves a minimal HTML page with proper Open Graph meta tags fetched from Strapi.
 * Normal users get the standard SPA experience.
 */

const STRAPI_URL =
  Deno.env.get("VITE_STRAPI_URL") ||
  "https://intexto-strapi-production.up.railway.app";
const SITE_URL = "https://www.intexto.ca";
const SITE_NAME = "Intexto";
const DEFAULT_IMAGE = `${SITE_URL}/Images/og-image.png`;
const DEFAULT_DESCRIPTION =
  "Intexto est le journal de référence de la communauté haïtienne à Montréal. Actualités, politique, culture, et événements.";

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

/**
 * Parse the URL path to extract content type and slug
 * Supports: /article/:slug, /video/:slug, /audio/:slug
 */
function parseContentPath(pathname) {
  const match = pathname.match(/^\/(article|video|audio)\/(.+)$/);
  if (!match) return null;
  return { type: match[1], slug: decodeURIComponent(match[2]) };
}

/**
 * Fetch content from Strapi by type and slug
 */
async function fetchContent(type, slug) {
  const endpointMap = {
    article: "articles",
    video: "videos",
    audio: "audios",
  };
  const endpoint = endpointMap[type];
  if (!endpoint) return null;

  try {
    const url = `${STRAPI_URL}/api/${endpoint}?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`;
    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();
    const item = data.data?.[0];
    if (!item) return null;

    return extractMeta(type, item);
  } catch (error) {
    console.error(`[og-meta] Error fetching ${type}/${slug}:`, error);
    return null;
  }
}

/**
 * Extract meta information from a Strapi content item
 */
function extractMeta(type, item) {
  const title = item.title || SITE_NAME;
  const description = item.excerpt || item.description || DEFAULT_DESCRIPTION;
  const author = item.author || "Rédaction Intexto";
  const publishedAt = item.publishedDate || item.publishedAt || item.createdAt;

  // Resolve image URL
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

/**
 * Build a minimal HTML page with Open Graph meta tags
 */
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

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default async function handler(request, context) {
  const userAgent = request.headers.get("user-agent") || "";
  const url = new URL(request.url);

  // Only intercept for social media bots on content paths
  if (!isBot(userAgent)) {
    return context.next();
  }

  const parsed = parseContentPath(url.pathname);
  if (!parsed) {
    return context.next();
  }

  // Fetch content from Strapi
  const meta = await fetchContent(parsed.type, parsed.slug);
  if (!meta) {
    return context.next();
  }

  // Return HTML with proper OG tags for the bot
  return new Response(buildOgHtml(meta), {
    headers: {
      "content-type": "text/html; charset=UTF-8",
      "cache-control": "public, max-age=300, s-maxage=600",
    },
  });
}

export const config = {
  path: ["/:type(article|video|audio)/:slug"],
};
