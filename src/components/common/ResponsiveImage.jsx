/**
 * ResponsiveImage Component
 * Renders responsive images using Strapi's auto-generated formats
 * with srcset and sizes for optimal loading on different devices
 */

const API_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

// Helper to get full URL (handles both absolute Cloudinary URLs and relative local URLs)
const getFullUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `${API_URL}${url}`;
};

const ResponsiveImage = ({
  image,
  alt = "",
  className = "",
  sizes = "100vw",
  loading = "lazy",
  fallbackUrl = null,
  priority = false,
}) => {
  // Use eager loading for priority images (above the fold / LCP)
  const imgLoading = priority ? "eager" : loading;
  const fetchPriority = priority ? "high" : undefined;
  // If no image object, use fallback
  if (!image && !fallbackUrl) {
    return null;
  }

  // If image is just a string URL (legacy support)
  if (typeof image === "string") {
    return (
      <img
        src={image}
        alt={alt}
        className={className}
        loading={imgLoading}
        fetchPriority={fetchPriority}
      />
    );
  }

  // If no formats available, use the main image URL or fallback
  if (!image?.formats || Object.keys(image.formats).length === 0) {
    const src = image?.url ? getFullUrl(image.url) : fallbackUrl;
    return (
      <img
        src={src}
        alt={alt || image?.alternativeText || ""}
        className={className}
        loading={imgLoading}
        fetchPriority={fetchPriority}
      />
    );
  }

  // Build srcset from available formats
  const formats = image.formats;
  const srcSetItems = [];

  // Add formats in order of size (small to large)
  if (formats.thumbnail) {
    srcSetItems.push(
      `${getFullUrl(formats.thumbnail.url)} ${formats.thumbnail.width}w`,
    );
  }
  if (formats.small) {
    srcSetItems.push(
      `${getFullUrl(formats.small.url)} ${formats.small.width}w`,
    );
  }
  if (formats.medium) {
    srcSetItems.push(
      `${getFullUrl(formats.medium.url)} ${formats.medium.width}w`,
    );
  }
  if (formats.large) {
    srcSetItems.push(
      `${getFullUrl(formats.large.url)} ${formats.large.width}w`,
    );
  }

  // Add original if available
  if (image.url) {
    srcSetItems.push(`${getFullUrl(image.url)} ${image.width}w`);
  }

  const srcSet = srcSetItems.join(", ");

  // Default src (use medium, or first available format, or original)
  const defaultSrc = formats.medium?.url
    ? getFullUrl(formats.medium.url)
    : formats.small?.url
      ? getFullUrl(formats.small.url)
      : image.url
        ? getFullUrl(image.url)
        : fallbackUrl;

  return (
    <img
      src={defaultSrc}
      srcSet={srcSet || undefined}
      sizes={sizes}
      alt={alt || image.alternativeText || ""}
      className={className}
      loading={imgLoading}
      fetchPriority={fetchPriority}
      width={image.width}
      height={image.height}
    />
  );
};

export default ResponsiveImage;
