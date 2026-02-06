import { ArrowRight } from "lucide-react";
import ContentCard from "../common/ContentCard";

const AudioSection = ({ audios, onContentClick }) => {
  if (!audios || audios.length === 0) return null;

  // Sort by order field, then by date
  const sortedAudios = [...audios].sort((a, b) => {
    const aHasOrder = a.order && a.order > 0;
    const bHasOrder = b.order && b.order > 0;

    if (aHasOrder && bHasOrder) {
      return a.order - b.order;
    }
    if (aHasOrder && !bHasOrder) {
      return -1;
    }
    if (!aHasOrder && bHasOrder) {
      return 1;
    }
    return new Date(b.date) - new Date(a.date);
  });

  const displayAudios = sortedAudios.slice(0, 6);

  return (
    <section className="media-section audio-section">
      <div className="media-section-container">
        <div className="media-section-header">
          <h2 className="media-section-title">Podcasts</h2>
          <a href="#podcasts" className="media-section-more">
            Voir tout <ArrowRight size={18} />
          </a>
        </div>

        <div className="media-grid">
          {displayAudios.map((audio) => (
            <ContentCard
              key={audio.id}
              content={audio}
              onClick={onContentClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudioSection;
