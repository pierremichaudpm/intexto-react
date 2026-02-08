import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";
import { LOCALE_OG, SUPPORTED_LOCALES, localePath } from "../../i18n";

const SITE_URL = "https://www.intexto.ca";

const SEOHead = ({
  title,
  description,
  image = "https://www.intexto.ca/Images/og-image.png",
  url,
  type = "website",
}) => {
  const { t } = useTranslation();
  const { locale } = useLanguage();

  const resolvedTitle = title || t("seo.defaultTitle");
  const resolvedDescription = description || t("seo.defaultDescription");
  const ogLocale = LOCALE_OG[locale] || "fr_CA";

  useEffect(() => {
    document.title = resolvedTitle;

    const updateMeta = (property, content) => {
      let meta =
        document.querySelector(`meta[property="${property}"]`) ||
        document.querySelector(`meta[name="${property}"]`);
      if (meta) {
        meta.setAttribute("content", content);
      } else {
        meta = document.createElement("meta");
        if (property.startsWith("og:") || property.startsWith("article:")) {
          meta.setAttribute("property", property);
        } else {
          meta.setAttribute("name", property);
        }
        meta.setAttribute("content", content);
        document.head.appendChild(meta);
      }
    };

    // Standard meta
    updateMeta("description", resolvedDescription);

    // Open Graph
    updateMeta("og:title", resolvedTitle);
    updateMeta("og:description", resolvedDescription);
    updateMeta("og:image", image);
    updateMeta("og:url", url || SITE_URL);
    updateMeta("og:type", type);
    updateMeta("og:site_name", "Intexto");
    updateMeta("og:locale", ogLocale);

    // Alternate locales
    SUPPORTED_LOCALES.filter((l) => l !== locale).forEach((altLocale) => {
      updateMeta(`og:locale:alternate`, LOCALE_OG[altLocale]);
    });

    // Twitter Card
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", resolvedTitle);
    updateMeta("twitter:description", resolvedDescription);
    updateMeta("twitter:image", image);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", url || SITE_URL);
    } else {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      canonical.setAttribute("href", url || SITE_URL);
      document.head.appendChild(canonical);
    }

    // Hreflang alternate links
    document
      .querySelectorAll('link[data-hreflang="true"]')
      .forEach((el) => el.remove());
    const currentPath = window.location.pathname;
    SUPPORTED_LOCALES.forEach((loc) => {
      const link = document.createElement("link");
      link.setAttribute("rel", "alternate");
      link.setAttribute("hreflang", loc);
      link.setAttribute(
        "href",
        `${SITE_URL}${localePath(currentPath.replace(/^\/(en|ht)/, ""), loc)}`,
      );
      link.setAttribute("data-hreflang", "true");
      document.head.appendChild(link);
    });

    // Update html lang attribute
    document.documentElement.lang = locale;
  }, [resolvedTitle, resolvedDescription, image, url, type, locale, ogLocale]);

  return null;
};

export default SEOHead;
