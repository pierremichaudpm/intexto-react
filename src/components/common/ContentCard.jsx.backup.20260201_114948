import { motion } from "framer-motion";
import { Video, Headphones } from "lucide-react";
import cmsService from "../../services/cmsService";
import ResponsiveImage from "./ResponsiveImage";
import { getCategoryColor, getCategoryLabel } from "../../config/categories";

const ContentCard = ({ content, onClick, delay = 0 }) => {
  const { type, title, category, image, imageFallback, excerpt, author, date } =
    content;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -8 }}
      className="content-card"
      data-type={type}
      onClick={() => onClick(content)}
    >
      <div className="content-card-image-wrapper">
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
            <Video size={24} />
          </div>
        )}
        {type === "audio" && (
          <div className="content-card-media-icon">
            <Headphones size={24} />
          </div>
        )}
      </div>

      <div className="content-card-body">
        <span
          className="content-card-category"
          style={{ backgroundColor: getCategoryColor(category) }}
        >
          {getCategoryLabel(category)}
        </span>

        <h3 className="content-card-title">{title}</h3>
        <p className="content-card-excerpt">{excerpt}</p>

        <div className="content-card-footer">
          <span className="content-card-author">{author}</span>
          <span className="content-card-date">
            {cmsService.formatDate(date)}
          </span>
        </div>
      </div>
    </motion.article>
  );
};

export default ContentCard;
