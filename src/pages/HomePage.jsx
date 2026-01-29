import { useState } from "react";
import { motion } from "framer-motion";
import { useContent } from "../context/ContentContext";
import HeroSection from "../components/content/HeroSection";
import ContentCard from "../components/common/ContentCard";
import ContentModal from "../components/common/ContentModal";
import AdBanner from "../components/ads/AdBanner";
import AdBox from "../components/ads/AdBox";

const typeFilters = [
  { id: "all", label: "Tous" },
  { id: "article", label: "Articles" },
  { id: "video", label: "Vidéos" },
  { id: "audio", label: "Audio" },
];

const HomePage = () => {
  const { filter, setFilter, getFilteredContent, loading } = useContent();
  const [selectedContent, setSelectedContent] = useState(null);
  const [displayCount, setDisplayCount] = useState(9);

  const filteredContent = getFilteredContent();
  const displayedContent = filteredContent.slice(0, displayCount);

  const handleTypeFilter = (typeId) => {
    setFilter((prev) => ({ ...prev, type: typeId }));
    setDisplayCount(9);
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 9);
  };

  const handleContentClick = (content) => {
    setSelectedContent(content);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <>
      {/* Top Ad Banner */}
      <AdBanner type="top" />

      {/* Hero Section */}
      <HeroSection onContentClick={handleContentClick} />

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="container">
          {typeFilters.map((type) => (
            <motion.button
              key={type.id}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`filter-btn ${filter.type === type.id ? "active" : ""}`}
              onClick={() => handleTypeFilter(type.id)}
            >
              {type.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <main className="main-content-wrapper">
        <div className="main-content-grid">
          {/* Content Grid */}
          <div className="content-section">
            <div className="content-grid">
              {displayedContent.map((content, index) => (
                <ContentCard
                  key={content.id}
                  content={content}
                  onClick={handleContentClick}
                  delay={index * 0.05}
                />
              ))}
            </div>

            {displayedContent.length === 0 && (
              <div className="no-content">
                <p>Aucun contenu trouvé</p>
              </div>
            )}

            {displayCount < filteredContent.length && (
              <div className="load-more-container">
                <motion.button
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="load-more-btn"
                  onClick={handleLoadMore}
                >
                  Charger plus d'articles
                  <motion.span
                    animate={{ y: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    style={{ display: "inline-block", marginLeft: "8px" }}
                  >
                    ↓
                  </motion.span>
                </motion.button>
              </div>
            )}
          </div>

          {/* Sidebar with Big Box Ad */}
          <aside className="content-sidebar">
            <AdBox position="sidebar" />
          </aside>
        </div>
      </main>

      {/* Content Modal */}
      <ContentModal
        content={selectedContent}
        isOpen={!!selectedContent}
        onClose={() => setSelectedContent(null)}
      />
    </>
  );
};

export default HomePage;
