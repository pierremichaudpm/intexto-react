import { motion } from "framer-motion";
import cmsService from "../../services/cmsService";
import ResponsiveImage from "./ResponsiveImage";
import { getCategoryColor, getCategoryLabel } from "../../config/categories";

const HeroCard = ({ content, size = "medium", onClick }) => {
  const { title, category, image, imageFallback, author, date } = content;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`hero-card hero-card-${size}`}
      onClick={() => onClick(content)}
    >
      <div className="hero-card-image-wrapper">
        <ResponsiveImage
          image={image}
          fallbackUrl={imageFallback}
          alt={title}
          className="hero-card-image"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
        />
      </div>

      <div className="hero-card-overlay">
        <span
          className="hero-card-category"
          style={{ backgroundColor: getCategoryColor(category) }}
        >
          {getCategoryLabel(category)}
        </span>

        <h2 className="hero-card-title">{title}</h2>

        <div className="hero-card-meta">
          <span>{author}</span>
          <span>{cmsService.formatDate(date)}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroCard;
