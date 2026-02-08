import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import HeroSection from "../components/content/HeroSection";
import HeroCarousel from "../components/content/HeroCarousel";
import MediaSection from "../components/sections/MediaSection";
import AudioSection from "../components/sections/AudioSection";
import VideoSection from "../components/sections/VideoSection";
import ContentModal from "../components/common/ContentModal";
import SEOHead from "../components/seo/SEOHead";
import StructuredData from "../components/seo/StructuredData";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

const HomePage = () => {
  const { t } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [useCarousel, setUseCarousel] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const [articlesRes, videosRes, audiosRes] = await Promise.all([
          fetch(
            `${STRAPI_URL}/api/articles?populate=cover,category&sort=publishedAt:desc&pagination[limit]=50`,
          ),
          fetch(
            `${STRAPI_URL}/api/videos?populate=cover,category&sort=publishedAt:desc&pagination[limit]=50`,
          ),
          fetch(
            `${STRAPI_URL}/api/audios?populate=cover,category&sort=publishedAt:desc&pagination[limit]=50`,
          ),
        ]);

        const [articlesData, videosData, audiosData] = await Promise.all([
          articlesRes.json(),
          videosRes.json(),
          audiosRes.json(),
        ]);

        setArticles(articlesData.data || []);
        setVideos(videosData.data || []);
        setAudios(audiosData.data || []);
      } catch (err) {
        console.error("Failed to fetch content:", err);
        setError(t("error.loadFailed"));
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  useEffect(() => {
    const checkWidth = () => setUseCarousel(window.innerWidth < 768);
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const getHeroItems = useCallback(() => {
    const heroItems = [];
    if (articles.length > 0) {
      heroItems.push({ item: articles[0], type: "article" });
    }
    if (videos.length > 0) {
      heroItems.push({ item: videos[0], type: "video" });
    }
    if (audios.length > 0) {
      heroItems.push({ item: audios[0], type: "audio" });
    }
    return heroItems;
  }, [articles, videos, audios]);

  const handleItemClick = (item, type) => {
    if (!type) {
      if (articles.find((a) => a.id === item.id)) type = "article";
      else if (videos.find((v) => v.id === item.id)) type = "video";
      else if (audios.find((a) => a.id === item.id)) type = "audio";
    }
    setSelectedItem(item);
    setSelectedType(type || "article");
  };

  const handleModalClose = () => {
    setSelectedItem(null);
    setSelectedType(null);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>{t("loading.content")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn--primary"
        >
          {t("error.retry")}
        </button>
      </div>
    );
  }

  const heroItems = getHeroItems();
  const gridArticles = articles.length > 1 ? articles.slice(1) : articles;

  return (
    <>
      <SEOHead />
      <StructuredData articles={articles} videos={videos} audios={audios} />

      <main className="home-page">
        {heroItems.length > 0 &&
          (useCarousel ? (
            <HeroCarousel
              items={heroItems}
              onItemClick={(item) => {
                const entry = heroItems.find((h) => h.item.id === item.id);
                handleItemClick(item, entry?.type);
              }}
            />
          ) : (
            <HeroSection
              items={heroItems}
              onItemClick={(item) => {
                const entry = heroItems.find((h) => h.item.id === item.id);
                handleItemClick(item, entry?.type);
              }}
            />
          ))}

        {gridArticles.length > 0 && (
          <MediaSection
            title={t("section.articles")}
            items={gridArticles}
            type="article"
            onItemClick={(item) => handleItemClick(item, "article")}
            id="articles"
          />
        )}

        {videos.length > 0 && (
          <VideoSection
            items={videos}
            onItemClick={(item) => handleItemClick(item, "video")}
          />
        )}

        {audios.length > 0 && (
          <AudioSection
            items={audios}
            onItemClick={(item) => handleItemClick(item, "audio")}
          />
        )}
      </main>

      <ContentModal
        item={selectedItem}
        type={selectedType}
        isOpen={!!selectedItem}
        onClose={handleModalClose}
      />
    </>
  );
};

export default HomePage;
