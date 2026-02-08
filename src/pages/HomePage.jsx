import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  lazy,
  Suspense,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useContent } from "../context/ContentContext";
import HeroSection from "../components/content/HeroSection";
import CategoryFilter from "../components/sections/CategoryFilter";
import MediaSection from "../components/sections/MediaSection";
import ContentCard from "../components/common/ContentCard";
import PartnerCard from "../components/partners/PartnerCard";
import MagazineWidget from "../components/widgets/MagazineWidget";
import SEOHead from "../components/seo/SEOHead";

// Lazy load heavy modal component
const ContentModal = lazy(() => import("../components/common/ContentModal"));

const HomePage = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { filter, setFilter, getFilteredContent, loading, content } =
    useContent();
  const [selectedContent, setSelectedContent] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [displayCount, setDisplayCount] = useState(isMobile ? 4 : 6);

  const filteredContent = getFilteredContent();
  const displayedContent = filteredContent.slice(0, displayCount);

  // Get all videos and audios for dedicated sections (memoized)
  const allVideos = useMemo(
    () => content.filter((item) => item.type === "video"),
    [content],
  );
  const allAudios = useMemo(
    () => content.filter((item) => item.type === "audio"),
    [content],
  );

  // Track mobile breakpoint
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle direct URL access - open modal if slug is in URL
  useEffect(() => {
    if (slug && content.length > 0) {
      const contentItem = content.find((item) => item.slug === slug);
      if (contentItem) {
        setSelectedContent(contentItem);
      }
    }
  }, [slug, content]);

  const handleCategoryFilter = useCallback(
    (categoryId) => {
      setFilter((prev) => ({ ...prev, category: categoryId }));
      setDisplayCount(isMobile ? 4 : 6);
    },
    [setFilter, isMobile],
  );

  const handleLoadMore = useCallback(() => {
    setDisplayCount((prev) => prev + 9);
  }, []);

  const handleContentClick = useCallback(
    (contentItem) => {
      setSelectedContent(contentItem);
      navigate(`/${contentItem.type}/${contentItem.slug}`, { replace: false });
    },
    [navigate],
  );

  const handleModalClose = useCallback(() => {
    setSelectedContent(null);
    navigate("/", { replace: false });
  }, [navigate]);

  const handleContentChange = useCallback(
    (newContent) => {
      setSelectedContent(newContent);
      navigate(`/${newContent.type}/${newContent.slug}`, { replace: false });
    },
    [navigate],
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{t("loading.content")}</p>
      </div>
    );
  }

  return (
    <>
      <SEOHead />

      {/* Hero Section */}
      <HeroSection onContentClick={handleContentClick} />

      {/* Mobile only: VisionMax banner between hero and filters */}
      <div className="mobile-only mobile-hero-ad">
        <PartnerCard ad="visionmax" />
      </div>

      {/* Category Filter */}
      <CategoryFilter
        activeCategory={filter.category}
        onCategoryChange={handleCategoryFilter}
      />

      {/* Main Content with Sidebar */}
      <main className="main-content-wrapper">
        <div className="main-content-grid">
          {/* Content Grid */}
          <div className="content-section">
            <div className="content-grid">
              {displayedContent.map((contentItem, index) => (
                <ContentCard
                  key={contentItem.id}
                  content={contentItem}
                  onClick={handleContentClick}
                  delay={index * 0.05}
                />
              ))}
            </div>

            {displayedContent.length === 0 && (
              <div className="no-content">
                <p>{t("content.noContent")}</p>
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
                  {t("content.loadMore")}
                </motion.button>
              </div>
            )}

            {/* Mobile only: StudioMicho banner between articles and media */}
            <div className="mobile-only mobile-mid-ad">
              <PartnerCard ad="studiomicho" />
            </div>

            {/* Mobile only: Audio/Video section before magazine */}
            <div className="mobile-only">
              <MediaSection
                videos={allVideos}
                audios={allAudios}
                onContentClick={handleContentClick}
              />
            </div>
          </div>

          {/* Sidebar with Ad and Magazine Widget */}
          <aside className="content-sidebar">
            <div className="desktop-only">
              <PartnerCard position="sidebar" />
            </div>
            <MagazineWidget />
            <div className="desktop-only">
              <PartnerCard position="sidebar-half" />
            </div>
          </aside>
        </div>
      </main>

      {/* Desktop only: Dedicated Media Section */}
      <div className="desktop-only">
        <MediaSection
          videos={allVideos}
          audios={allAudios}
          onContentClick={handleContentClick}
        />
      </div>

      {/* Content Modal - lazy loaded */}
      {selectedContent && (
        <Suspense fallback={null}>
          <ContentModal
            content={selectedContent}
            isOpen={!!selectedContent}
            onClose={handleModalClose}
            onContentChange={handleContentChange}
          />
        </Suspense>
      )}
    </>
  );
};

export default HomePage;
