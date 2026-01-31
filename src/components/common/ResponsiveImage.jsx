/**
 * ResponsiveImage Component
 * Renders responsive images using Strapi's auto-generated formats
 * with srcset and sizes for optimal loading on different devices
 */

const API_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

const ResponsiveImage = ({
  image,
  alt = '',
  className = '',
  sizes = '100vw',
  loading = 'lazy',
  fallbackUrl = null
}) => {
  // If no image object, use fallback
  if (!image && !fallbackUrl) {
    return null;
  }

  // If image is just a string URL (legacy support)
  if (typeof image === 'string') {
    return (
      <img
        src={image}
        alt={alt}
        className={className}
        loading={loading}
      />
    );
  }

  // If no formats available, use the main image URL or fallback
  if (!image?.formats || Object.keys(image.formats).length === 0) {
    const src = image?.url ? `${API_URL}${image.url}` : fallbackUrl;
    return (
      <img
        src={src}
        alt={alt || image?.alternativeText || ''}
        className={className}
        loading={loading}
      />
    );
  }

  // Build srcset from available formats
  const formats = image.formats;
  const srcSetItems = [];

  // Add formats in order of size (small to large)
  if (formats.thumbnail) {
    srcSetItems.push(`${API_URL}${formats.thumbnail.url} ${formats.thumbnail.width}w`);
  }
  if (formats.small) {
    srcSetItems.push(`${API_URL}${formats.small.url} ${formats.small.width}w`);
  }
  if (formats.medium) {
    srcSetItems.push(`${API_URL}${formats.medium.url} ${formats.medium.width}w`);
  }
  if (formats.large) {
    srcSetItems.push(`${API_URL}${formats.large.url} ${formats.large.width}w`);
  }

  // Add original if available
  if (image.url) {
    srcSetItems.push(`${API_URL}${image.url} ${image.width}w`);
  }

  const srcSet = srcSetItems.join(', ');

  // Default src (use medium, or first available format, or original)
  const defaultSrc = formats.medium?.url
    ? `${API_URL}${formats.medium.url}`
    : formats.small?.url
      ? `${API_URL}${formats.small.url}`
      : image.url
        ? `${API_URL}${image.url}`
        : fallbackUrl;

  return (
    <img
      src={defaultSrc}
      srcSet={srcSet || undefined}
      sizes={sizes}
      alt={alt || image.alternativeText || ''}
      className={className}
      loading={loading}
      width={image.width}
      height={image.height}
    />
  );
};

export default ResponsiveImage;
