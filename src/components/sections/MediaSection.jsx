import { useState } from "react";
import ContentCard from "../common/ContentCard";
import { useContent } from "../../context/ContentContext";

const MediaSection = ({ videos, audios, onContentClick }) => {
  const [showAll, setShowAll] = useState(false);
  const { getLineup } = useContent();

  // Use media-mixed lineup if available, otherwise fall back to combining all videos + audios
  const mediaMixedLineup = getLineup("media-mixed");

  let allMedia;
  if (mediaMixedLineup) {
    // Lineup items come first (in order), then remaining items by date
    const lineupItems = [
      ...mediaMixedLineup.videos.map((v) => ({ ...v, type: "video" })),
      ...mediaMixedLineup.audios.map((a) => ({ ...a, type: "audio" })),
    ];
    const lineupIds = new Set(lineupItems.map((item) => item.id));
    const remainingMedia = [...(videos || []), ...(audios || [])]
      .filter((item) => !lineupIds.has(item.id))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    allMedia = [...lineupItems, ...remainingMedia];
  } else {
    allMedia = [...(videos || []), ...(audios || [])];
  }

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
              Plus de contenu
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MediaSection;
