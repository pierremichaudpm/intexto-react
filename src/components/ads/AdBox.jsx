import { motion } from 'framer-motion';

const AdBox = ({ position = 'sidebar' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`ad-box ad-box-${position}`}
    >
      <div className="ad-label">PUBLICITÉ</div>
      <div className="ad-box-content">
        <p>Big Box</p>
        <p className="ad-box-size">300x600</p>
      </div>
    </motion.div>
  );
};

export default AdBox;
