import { ArrowRight } from "lucide-react";
import ContentCard from "../common/ContentCard";

const VideoSection = ({ videos, onContentClick }) => {
  if (!videos || videos.length === 0) return null;

  const displayVideos = videos.slice(0, 6);

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
