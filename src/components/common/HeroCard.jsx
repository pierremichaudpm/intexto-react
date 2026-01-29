import { motion } from 'framer-motion';
import cmsService from '../../services/cmsService';

const categoryColors = {
  actualite: '#0f0600',
  politique: '#dd4f4f',
  voyage: '#dd9933',
  culture: '#008bff'
};

const categoryLabels = {
  actualite: 'Actualité',
  politique: 'Politique',
  voyage: 'Voyage',
  culture: 'Culture'
};

const HeroCard = ({ content, size = 'medium', onClick }) => {
  const { title, category, image, author, date } = content;

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
        <img src={image} alt={title} className="hero-card-image" />
      </div>

      <div className="hero-card-overlay">
        <span
          className="hero-card-category"
          style={{ backgroundColor: categoryColors[category] }}
        >
          {categoryLabels[category]}
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
