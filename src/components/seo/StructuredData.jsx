import { Helmet } from "react-helmet";

const StructuredData = ({ content }) => {
  if (!content) return null;

  const { type, title, excerpt, image, author, date, category } = content;

  // Article structured data
  const articleSchema = {
    "@context": "https://schema.org",
    "@type":
      type === "video"
        ? "VideoObject"
        : type === "audio"
          ? "AudioObject"
          : "NewsArticle",
    headline: title,
    description: excerpt,
    image: [image],
    datePublished: date,
    dateModified: date,
    author: [
      {
        "@type": "Person",
        name: author,
      },
    ],
    publisher: {
      "@type": "Organization",
      name: "Intexto",
      logo: {
        "@type": "ImageObject",
        url: "https://www.intexto.ca/Images/intextologo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.intexto.ca/${type}/${content.id}`,
    },
  };

  // Add video-specific properties
  if (type === "video") {
    articleSchema.uploadDate = date;
    articleSchema.thumbnailUrl = image;
    if (content.mediaUrl) {
      articleSchema.contentUrl = content.mediaUrl;
    }
    if (content.duration) {
      // Convert duration like "12:34" to ISO 8601 format "PT12M34S"
      const parts = content.duration.split(":");
      if (parts.length === 2) {
        articleSchema.duration = `PT${parts[0]}M${parts[1]}S`;
      } else if (parts.length === 3) {
        articleSchema.duration = `PT${parts[0]}H${parts[1]}M${parts[2]}S`;
      }
    }
  }

  // Add audio-specific properties
  if (type === "audio") {
    articleSchema.uploadDate = date;
    if (content.mediaUrl) {
      articleSchema.contentUrl = content.mediaUrl;
    }
    if (content.duration) {
      const parts = content.duration.split(":");
      if (parts.length === 2) {
        articleSchema.duration = `PT${parts[0]}M${parts[1]}S`;
      } else if (parts.length === 3) {
        articleSchema.duration = `PT${parts[0]}H${parts[1]}M${parts[2]}S`;
      }
    }
  }

  // Organization schema for the site
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "Intexto",
    url: "https://www.intexto.ca",
    logo: "https://www.intexto.ca/Images/intextologo.png",
    description:
      "Journal haïtien à Montréal - Actualités, politique, culture et événements de la communauté haïtienne",
    sameAs: [
      "https://www.facebook.com/jnnuma/",
      "https://x.com/jeannuma",
      "https://www.instagram.com/intexto",
      "https://www.youtube.com/@intexto",
    ],
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: "https://www.intexto.ca",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category.charAt(0).toUpperCase() + category.slice(1),
        item: `https://www.intexto.ca/categorie/${category}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
      },
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};

export default StructuredData;
