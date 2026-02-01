import { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import ContentCard from "../common/ContentCard";

const MediaSection = ({ videos, audios, onContentClick }) => {
  const [showAll, setShowAll] = useState(false);
  const allMedia = [...(videos || []), ...(audios || [])];

  if (allMedia.length === 0) return null;

  const initialCount = 3;
  const displayMedia = showAll ? allMedia : allMedia.slice(0, initialCount);
  const hasMore = allMedia.length > initialCount;

  return (
    <section className="media-section">
      <div className="media-section-container">
        <div className="media-section-header">
          <h2 className="media-section-title">Audio et Vidéo</h2>
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

        {hasMore && !showAll && (
          <div className="media-load-more">
            <button className="load-more-btn" onClick={() => setShowAll(true)}>
              <Plus size={18} />
              Plus de contenu
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MediaSection;
