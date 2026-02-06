import { ArrowRight } from "lucide-react";
import ContentCard from "../common/ContentCard";

const VideoSection = ({ videos, onContentClick }) => {
  if (!videos || videos.length === 0) return null;

  // Sort by orderMediaMixed, then by date
  const sortedVideos = [...videos].sort((a, b) => {
    const aHasOrder = a.orderMediaMixed && a.orderMediaMixed > 0;
    const bHasOrder = b.orderMediaMixed && b.orderMediaMixed > 0;

    if (aHasOrder && bHasOrder) {
      return a.orderMediaMixed - b.orderMediaMixed;
    }
    if (aHasOrder && !bHasOrder) {
      return -1;
    }
    if (!aHasOrder && bHasOrder) {
      return 1;
    }
    return new Date(b.publishedDate) - new Date(a.publishedDate);
  });

  const displayVideos = sortedVideos.slice(0, 6);

  return (
    <section className="media-section video-section">
      <div className="media-section-container">
        <div className="media-section-header">
          <h2 className="media-section-title">Vidéos</h2>
          <a href="#videos" className="media-section-more">
            Voir tout <ArrowRight size={18} />
          </a>
        </div>

        <div className="media-grid">
          {displayVideos.map((video) => (
            <ContentCard
              key={video.id}
              content={video}
              onClick={onContentClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
