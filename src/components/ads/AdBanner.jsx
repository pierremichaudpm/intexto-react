import { motion } from 'framer-motion';

const AdBanner = ({ type = 'top' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`ad-banner ad-banner-${type}`}
    >
      <div className="ad-label">PUBLICITÉ</div>
      <div className="ad-content">
        <p>Espace publicitaire {type === 'top' ? '728x90' : '300x250'}</p>
      </div>
    </motion.div>
  );
};

export default AdBanner;
