import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
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

const ContentModal = ({ content, isOpen, onClose }) => {
  if (!content) return null;

  const { type, title, category, image, excerpt, author, date, mediaUrl } = content;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={handleOverlayClick}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="modal-content"
          >
            <button className="modal-close" onClick={onClose}>
              <X size={24} />
            </button>

            <img src={image} alt={title} className="modal-image" />

            <div className="modal-body">
              <span
                className="content-card-category"
                style={{ backgroundColor: categoryColors[category] }}
              >
                {categoryLabels[category]}
              </span>

              <h1 className="modal-title">{title}</h1>

              <div className="modal-meta">
                <span><strong>{author}</strong></span>
                <span>{cmsService.formatDate(date)}</span>
              </div>

              {type === 'video' && mediaUrl && (
                <div className="modal-media">
                  <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
                    🎬 Regarder la vidéo <ExternalLink size={16} style={{ display: 'inline' }} />
                  </a>
                </div>
              )}

              {type === 'audio' && mediaUrl && (
                <div className="modal-media">
                  <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
                    🎵 Écouter l'audio <ExternalLink size={16} style={{ display: 'inline' }} />
                  </a>
                </div>
              )}

              <div className="modal-text">{content.content}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContentModal;
