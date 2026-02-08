import { useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";

const StructuredData = ({ articles = [], videos = [], audios = [] }) => {
  const { locale } = useLanguage();

  useEffect(() => {
    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Intexto",
      url: "https://www.intexto.ca",
      logo: "https://www.intexto.ca/Images/intextologo.png",
      description:
        locale === "en"
          ? "Haitian community news in Montreal"
          : locale === "ht"
            ? "Nouvèl kominote ayisyen nan Monreyal"
            : "Journal communautaire haïtien à Montréal",
      sameAs: [
        "https://www.facebook.com/jnnuma/",
        "https://www.instagram.com/jnnuma/",
        "https://x.com/jeannuma",
      ],
    };

    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Intexto",
      url: "https://www.intexto.ca",
      inLanguage: locale === "ht" ? "ht" : `${locale}-CA`,
    };

    const articleSchemas = articles.slice(0, 10).map((article) => ({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description || "",
      author: {
        "@type": "Person",
        name: article.author || "Intexto",
      },
      publisher: {
        "@type": "Organization",
        name: "Intexto",
        logo: {
          "@type": "ImageObject",
          url: "https://www.intexto.ca/Images/intextologo.png",
        },
      },
      datePublished: article.publishedAt,
      dateModified: article.updatedAt || article.publishedAt,
      inLanguage: locale,
    }));

    const allSchemas = [orgSchema, websiteSchema, ...articleSchemas];

    document
      .querySelectorAll("script[data-structured-data]")
      .forEach((el) => el.remove());

    allSchemas.forEach((schema, index) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-structured-data", `schema-${index}`);
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      document
        .querySelectorAll("script[data-structured-data]")
        .forEach((el) => el.remove());
    };
  }, [articles, videos, audios, locale]);

  return null;
};

export default StructuredData;
