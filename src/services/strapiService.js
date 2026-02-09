/**
 * Strapi API Service
 * Handles all communication with Strapi CMS backend
 * Supports locale-aware content fetching for i18n
 */

const API_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

class StrapiService {
  constructor() {
    this.apiUrl = API_URL;
  }

  /**
   * Build locale query string. Omit for default locale so Strapi
   * returns content regardless of locale tagging.
   */
  localeParam(locale) {
    return locale && locale !== "fr" ? `locale=${locale}&` : "";
  }

  /**
   * Fetch all content (articles, videos, audios) with populated relations
   */
  async loadContent(locale = "fr") {
    try {
      const [articles, videos, audios] = await Promise.all([
        this.fetchArticles(locale),
        this.fetchVideos(locale),
        this.fetchAudios(locale),
      ]);

      // Combine all content
      const allContent = [
        ...articles.map((a) => ({ ...a, type: "article" })),
        ...videos.map((v) => ({ ...v, type: "video" })),
        ...audios.map((a) => ({ ...a, type: "audio" })),
      ];

      // Sort by date (newest first)
      return allContent.sort((a, b) => {
        return new Date(b.publishedAt) - new Date(a.publishedAt);
      });
    } catch (error) {
      console.error("Error loading content from Strapi:", error);
      return [];
    }
  }

  /**
   * Fetch all lineups with their ordered content items populated.
   * Always fetches FR lineups (which have correct ordering), then
   * extracts documentId order so locale content can be sorted to match.
   */
  async fetchLineups(locale = "fr") {
    try {
      // Always fetch FR lineups — they are the source of truth for ordering
      const response = await fetch(
        `${this.apiUrl}/api/lineups?populate[articles][populate][0]=image&populate[articles][populate][1]=category&populate[videos][populate][0]=thumbnail&populate[videos][populate][1]=videoFile&populate[videos][populate][2]=category&populate[audios][populate][0]=coverImage&populate[audios][populate][1]=audioFile&populate[audios][populate][2]=category`,
      );
      const data = await response.json();
      const lineups = {};
      data.data.forEach((lineup) => {
        const slug = lineup.slug;
        lineups[slug] = {
          name: lineup.name,
          slug: slug,
          // Store documentId order from FR lineups
          articleOrder: (lineup.articles || []).map((item) => item.documentId),
          videoOrder: (lineup.videos || []).map((item) => item.documentId),
          audioOrder: (lineup.audios || []).map((item) => item.documentId),
          // Also store transformed FR content as fallback
          articles: (lineup.articles || [])
            .map((item) => this.transformArticle(item))
            .filter(Boolean),
          videos: (lineup.videos || [])
            .map((item) => this.transformVideo(item))
            .filter(Boolean),
          audios: (lineup.audios || [])
            .map((item) => this.transformAudio(item))
            .filter(Boolean),
        };
      });
      return lineups;
    } catch (error) {
      console.error("Error fetching lineups:", error);
      return {};
    }
  }

  /**
   * Fetch articles with category populated
   */
  async fetchArticles(locale = "fr") {
    try {
      const response = await fetch(
        `${this.apiUrl}/api/articles?${this.localeParam(locale)}populate[0]=image&populate[1]=category`,
      );
      const data = await response.json();
      return data.data.map((item) => this.transformArticle(item));
    } catch (error) {
      console.error("Error fetching articles:", error);
      return [];
    }
  }

  /**
   * Fetch videos with category populated
   */
  async fetchVideos(locale = "fr") {
    try {
      const response = await fetch(
        `${this.apiUrl}/api/videos?${this.localeParam(locale)}populate[0]=thumbnail&populate[1]=videoFile&populate[2]=category`,
      );
      const data = await response.json();
      return data.data.map((item) => this.transformVideo(item));
    } catch (error) {
      console.error("Error fetching videos:", error);
      return [];
    }
  }

  /**
   * Fetch audios with category populated
   */
  async fetchAudios(locale = "fr") {
    try {
      const response = await fetch(
        `${this.apiUrl}/api/audios?${this.localeParam(locale)}populate[0]=coverImage&populate[1]=audioFile&populate[2]=category`,
      );
      const data = await response.json();
      return data.data.map((item) => this.transformAudio(item));
    } catch (error) {
      console.error("Error fetching audios:", error);
      return [];
    }
  }

  /**
   * Fetch categories for the given locale
   */
  async fetchCategories(locale = "fr") {
    try {
      const response = await fetch(
        `${this.apiUrl}/api/categories?${this.localeParam(locale)}`,
      );
      const data = await response.json();
      return data.data.map((cat) => ({
        id: cat.documentId,
        name: cat.name,
        slug: cat.slug,
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  /**
   * Transform Strapi image object to include all formats
   * Handles both local uploads and Cloudinary URLs
   */
  transformImage(imageData) {
    if (!imageData) return null;

    // Check if URL is already absolute (Cloudinary or external)
    const isAbsoluteUrl =
      imageData.url?.startsWith("http://") ||
      imageData.url?.startsWith("https://");
    const fullUrl = isAbsoluteUrl
      ? imageData.url
      : `${this.apiUrl}${imageData.url}`;

    return {
      url: fullUrl,
      formats: imageData.formats || {},
      alternativeText: imageData.alternativeText || "",
      width: imageData.width,
      height: imageData.height,
    };
  }

  /**
   * Transform Strapi article to app format
   */
  transformArticle(item) {
    const imageUrl = item.image?.url;
    const isAbsoluteUrl =
      imageUrl?.startsWith("http://") || imageUrl?.startsWith("https://");
    const fullImageUrl = imageUrl
      ? isAbsoluteUrl
        ? imageUrl
        : `${this.apiUrl}${imageUrl}`
      : this.getPlaceholderImage("article");

    return {
      id: item.documentId,
      type: "article",
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      content: item.content,
      category: item.category?.slug || "actualite",
      author: item.author || "Rédaction Intexto",
      date: item.publishedDate || item.publishedAt || item.createdAt,
      image: item.image ? this.transformImage(item.image) : null,
      imageFallback: fullImageUrl,
      readTime: item.readTime || "5 min",
      tags: item.tags || [],
    };
  }

  /**
   * Transform Strapi video to app format
   */
  transformVideo(item) {
    const videoFileUrl = item.videoFile?.url;
    const isVideoAbsolute =
      videoFileUrl?.startsWith("http://") ||
      videoFileUrl?.startsWith("https://");
    const mediaUrl = videoFileUrl
      ? isVideoAbsolute
        ? videoFileUrl
        : `${this.apiUrl}${videoFileUrl}`
      : item.videoUrl;

    const thumbnailUrl = item.thumbnail?.url;
    const isThumbnailAbsolute =
      thumbnailUrl?.startsWith("http://") ||
      thumbnailUrl?.startsWith("https://");
    const fullThumbnailUrl = thumbnailUrl
      ? isThumbnailAbsolute
        ? thumbnailUrl
        : `${this.apiUrl}${thumbnailUrl}`
      : this.getPlaceholderImage("video");

    return {
      id: item.documentId,
      type: "video",
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      description: item.description,
      category: item.category?.slug || "actualite",
      author: item.author || "Équipe Vidéo Intexto",
      date: item.publishedDate || item.publishedAt || item.createdAt,
      image: item.thumbnail ? this.transformImage(item.thumbnail) : null,
      imageFallback: fullThumbnailUrl,
      videoUrl: mediaUrl,
      duration: item.duration || "10 min",
      tags: item.tags || [],
    };
  }

  /**
   * Transform Strapi audio to app format
   */
  transformAudio(item) {
    const audioFileUrl = item.audioFile?.url;
    const isAudioAbsolute =
      audioFileUrl?.startsWith("http://") ||
      audioFileUrl?.startsWith("https://");
    const mediaUrl = audioFileUrl
      ? isAudioAbsolute
        ? audioFileUrl
        : `${this.apiUrl}${audioFileUrl}`
      : item.audioUrl;

    const coverUrl = item.coverImage?.url;
    const isCoverAbsolute =
      coverUrl?.startsWith("http://") || coverUrl?.startsWith("https://");
    const fullCoverUrl = coverUrl
      ? isCoverAbsolute
        ? coverUrl
        : `${this.apiUrl}${coverUrl}`
      : this.getPlaceholderImage("audio");

    return {
      id: item.documentId,
      type: "audio",
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      description: item.description,
      category: item.category?.slug || "actualite",
      author: item.author || "Équipe Podcast Intexto",
      date: item.publishedDate || item.publishedAt || item.createdAt,
      image: item.coverImage ? this.transformImage(item.coverImage) : null,
      imageFallback: fullCoverUrl,
      audioUrl: mediaUrl,
      duration: item.duration || "30 min",
      tags: item.tags || [],
    };
  }

  getPlaceholderImage(type) {
    const placeholders = {
      article:
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800",
      video:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
      audio:
        "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800",
    };
    return placeholders[type] || placeholders.article;
  }

  filterByCategory(content, category) {
    if (category === "all") return content;
    return content.filter((item) => item.category === category);
  }

  filterByType(content, type) {
    if (type === "all") return content;
    return content.filter((item) => item.type === type);
  }

  searchContent(content, query) {
    if (!query) return content;
    const lowerQuery = query.toLowerCase();
    return content.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.excerpt.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery),
    );
  }

  /**
   * Fetch a single draft content item by type and slug for preview
   */
  async fetchDraftContent(type, slug, locale = "fr") {
    const endpointMap = {
      article: "articles",
      video: "videos",
      audio: "audios",
    };
    const endpoint = endpointMap[type];
    if (!endpoint) return null;

    try {
      const response = await fetch(
        `${this.apiUrl}/api/${endpoint}?${this.localeParam(locale)}filters[slug][$eq]=${encodeURIComponent(slug)}&status=draft&populate[0]=image&populate[1]=thumbnail&populate[2]=coverImage&populate[3]=videoFile&populate[4]=audioFile&populate[5]=category`,
      );
      const data = await response.json();
      const item = data.data?.[0];
      if (!item) return null;

      const transformMap = {
        article: (i) => ({ ...this.transformArticle(i), type: "article" }),
        video: (i) => ({ ...this.transformVideo(i), type: "video" }),
        audio: (i) => ({ ...this.transformAudio(i), type: "audio" }),
      };

      return transformMap[type](item);
    } catch (error) {
      console.error("Error fetching draft content:", error);
      return null;
    }
  }
}

export default new StrapiService();
