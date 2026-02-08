import { useTranslation } from "react-i18next";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

const HeroCard = ({ item, type, onClick, priority = false }) => {
  const { t } = useTranslation();

  const getCoverUrl = () => {
    const cover = item.cover;
    if (!cover) return null;
    const formats = cover.formats;
    const url = formats?.large?.url || formats?.medium?.url || cover.url;
    if (!url) return null;
    return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
  };

  const coverUrl = getCoverUrl();
  const categoryName = item.category?.name || item.categorie?.name;

  const getTypeLabel = () => {
    switch (type) {
      case "video":
        return t("type.video");
      case "audio":
        return t("type.audio");
      default:
        return t("type.article");
    }
  };

  return (
    <div
      className="hero-card"
      onClick={() => onClick && onClick(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick && onClick(item)}
    >
      <div className="hero-card__image-wrapper">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={item.title}
            className="hero-card__image"
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
          />
        ) : (
          <div className="hero-card__placeholder" />
        )}
        <div className="hero-card__overlay" />
      </div>

      <div className="hero-card__content">
        <div className="hero-card__badges">
          {type !== "article" && (
            <span className="hero-card__type-badge">{getTypeLabel()}</span>
          )}
          {categoryName && (
            <span className="hero-card__category-badge">{categoryName}</span>
          )}
        </div>
        <h2 className="hero-card__title">{item.title}</h2>
        {item.description && (
          <p className="hero-card__description">
            {item.description.length > 160
              ? `${item.description.substring(0, 160)}...`
              : item.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default HeroCard;
