import { memo } from "react";
import { motion as Motion } from "framer-motion";
import { Video, Mic } from "lucide-react";
import cmsService from "../../services/cmsService";
import ResponsiveImage from "./ResponsiveImage";
import { getCategoryColor, getCategoryLabel, getCategoryCardBackground } from "../../config/categories";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { contentPath } from "../../lib/seo";

const ContentCard = memo(function ContentCard({ content, onClick, delay = 0 }) {
  const { t } = useTranslation();
  const { locale } = useLanguage();
  const {
    type,
    title,
    category,
    image,
    imageFallback,
    excerpt,
    author,
    date,
    duration,
  } = content;

  // Format duration for display
  const formatDuration = (dur) => {
    if (!dur) return type === "video" ? "12:34" : "24:15";
    return dur;
  };

  const cardBackground = type === "article" ? getCategoryCardBackground(category) : null;

  return (
    <Motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -6 }}
      className="content-card"
      data-type={type}
      style={cardBackground ? { background: cardBackground } : undefined}
      onClick={(event) => {
        if (!event.target.closest("a")) onClick(content);
      }}
    >
      <div
        className="content-card-image-wrapper"
        data-duration={
          type !== "article" ? formatDuration(duration) : undefined
        }
      >
        <ResponsiveImage
          image={image}
          fallbackUrl={imageFallback}
          alt={title}
          className="content-card-image"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
        />
        {type === "video" && (
          <div className="content-card-media-icon">
            <Video size={22} />
          </div>
        )}
        {type === "audio" && (
          <div className="content-card-media-icon">
            <Mic size={22} />
          </div>
        )}
      </div>

      <div className="content-card-body">
        <span
          className="content-card-category"
          data-category={category}
          style={{
            backgroundColor:
              type === "article" ? getCategoryColor(category) : undefined,
          }}
        >
          {getCategoryLabel(category, t)}
        </span>

        <h3 className="content-card-title">
          <Link to={contentPath(type, content.slug, locale)} onClick={(event) => {
            if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            onClick(content);
          }}>{title}</Link>
        </h3>
        <p className="content-card-excerpt">{excerpt}</p>

        <div className="content-card-footer">
          <span className="content-card-author">{author}</span>
          <span className="content-card-date">
            {cmsService.formatDate(date)}
          </span>
        </div>
      </div>
    </Motion.article>
  );
});

export default ContentCard;
