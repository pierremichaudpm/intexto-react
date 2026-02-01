import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Video,
  Headphones,
} from "lucide-react";
import { useContent } from "../../context/ContentContext";
import cmsService from "../../services/cmsService";
import ResponsiveImage from "../common/ResponsiveImage";

const categoryColors = {
  actualite: "#0f0600",
  politique: "#dd4f4f",
  voyage: "#dd9933",
  culture: "#008bff",
};

const categoryLabels = {
  actualite: "Actualité",
  politique: "Politique",
  voyage: "Voyage",
  culture: "Culture",
};

const HeroSection = ({ onContentClick }) => {
  const { content } = useContent();
  const [currentIndex, setCurrentIndex] = useState(0);

  const allContent = content;
  const articles = allContent
    .filter((item) => item.type === "article" && item.featured)
    .sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return new Date(b.date) - new Date(a.date);
    })
    .slice(0, 3);
  const videos = allContent
    .filter((item) => item.type === "video")
    .sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return new Date(b.date) - new Date(a.date);
    });
  const audios = allContent
    .filter((item) => item.type === "audio")
    .sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return new Date(b.date) - new Date(a.date);
    });

  const featuredVideo = videos.length > 0 ? videos[0] : null;
  const featuredAudio = audios.length > 0 ? audios[0] : null;

  useEffect(() => {
    if (articles.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [articles.length]);

  const paginate = (newDirection) => {
    setCurrentIndex((prev) => {
      const next = prev + newDirection;
      if (next < 0) return articles.length - 1;
      if (next >= articles.length) return 0;
      return next;
    });
  };

  if (articles.length === 0) return null;

  const current = articles[currentIndex];

  return (
    <section className="hero-section-new">
      <div className="hero-container-new">
        {/* Main Carousel */}
        <div className="hero-main-carousel">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.2,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="hero-main-slide"
              onClick={() => onContentClick(current)}
            >
              <div className="hero-main-image-wrapper">
                <ResponsiveImage
                  image={current.image}
                  fallbackUrl={current.imageFallback}
                  alt={current.title}
                  className="hero-main-image"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 60vw"
                />
                <div className="hero-main-gradient" />
              </div>

              <div className="hero-main-content">
                <span
                  className="hero-main-category"
                  style={{ backgroundColor: categoryColors[current.category] }}
                >
                  {categoryLabels[current.category]}
                </span>
                <h2 className="hero-main-title">{current.title}</h2>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <button
            className="hero-nav-btn hero-nav-left"
            onClick={() => paginate(-1)}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            className="hero-nav-btn hero-nav-right"
            onClick={() => paginate(1)}
          >
            <ChevronRight size={16} />
          </button>

          {/* Dots */}
          <div className="hero-dots">
            {articles.map((_, index) => (
              <button
                key={index}
                className={`hero-dot ${index === currentIndex ? "active" : ""}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Side Content: Video + Audio */}
        <div className="hero-side-articles">
          {/* Video */}
          {featuredVideo && (
            <div
              className="hero-side-card"
              onClick={() => onContentClick(featuredVideo)}
            >
              <div className="hero-side-image-wrapper">
                <ResponsiveImage
                  image={featuredVideo.image}
                  fallbackUrl={featuredVideo.imageFallback}
                  alt={featuredVideo.title}
                  className="hero-side-image"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 30vw, 20vw"
                />
                <div className="hero-side-media-badge">
                  <Video size={24} />
                </div>
              </div>
              <div className="hero-side-body">
                <span
                  className="hero-side-category"
                  style={{
                    backgroundColor: categoryColors[featuredVideo.category],
                  }}
                >
                  {categoryLabels[featuredVideo.category]}
                </span>
                <h3 className="hero-side-title">{featuredVideo.title}</h3>
                <div className="hero-side-meta">
                  <span>{featuredVideo.author}</span>
                  <span>•</span>
                  <span>{cmsService.formatDate(featuredVideo.date)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Audio */}
          {featuredAudio && (
            <div
              className="hero-side-card"
              onClick={() => onContentClick(featuredAudio)}
            >
              <div className="hero-side-image-wrapper">
                <ResponsiveImage
                  image={featuredAudio.image}
                  fallbackUrl={featuredAudio.imageFallback}
                  alt={featuredAudio.title}
                  className="hero-side-image"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 30vw, 20vw"
                />
                <div className="hero-side-media-badge">
                  <Headphones size={24} />
                </div>
              </div>
              <div className="hero-side-body">
                <span
                  className="hero-side-category"
                  style={{
                    backgroundColor: categoryColors[featuredAudio.category],
                  }}
                >
                  {categoryLabels[featuredAudio.category]}
                </span>
                <h3 className="hero-side-title">{featuredAudio.title}</h3>
                <div className="hero-side-meta">
                  <span>{featuredAudio.author}</span>
                  <span>•</span>
                  <span>{cmsService.formatDate(featuredAudio.date)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
