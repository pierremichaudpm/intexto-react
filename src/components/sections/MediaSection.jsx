import { ArrowRight } from "lucide-react";
import ContentCard from "../common/ContentCard";

const MediaSection = ({ videos, audios, onContentClick }) => {
  const allMedia = [...(videos || []), ...(audios || [])];

  if (allMedia.length === 0) return null;

  const displayMedia = allMedia.slice(0, 6);

  return (
    <section className="media-section">
      <div className="media-section-container">
        <div className="media-section-header">
          <h2 className="media-section-title">Audio et Vidéo</h2>
          <a href="#media" className="media-section-more">
            Voir tout <ArrowRight size={18} />
          </a>
        </div>

        <div className="media-grid">
          {displayMedia.map((media) => (
            <ContentCard
              key={media.id}
              content={media}
              onClick={onContentClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MediaSection;
