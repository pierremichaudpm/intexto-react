import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import strapiService from "../services/strapiService";
import { useLanguage } from "./LanguageContext";

const ContentContext = createContext();

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within ContentProvider");
  }
  return context;
};

export const ContentProvider = ({ children }) => {
  const { locale } = useLanguage();
  const [content, setContent] = useState([]);
  const [lineups, setLineups] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ category: "all", type: "all" });
  const [searchQuery, setSearchQuery] = useState("");

  // Reload content when locale changes
  useEffect(() => {
    loadContent(locale);
  }, [locale]);

  const loadContent = async (loc) => {
    setLoading(true);
    try {
      // Lineups always come from FR (source of truth for ordering).
      // Content comes from the requested locale.
      const [data, lineupsData] = await Promise.all([
        strapiService.loadContent(loc),
        strapiService.fetchLineups(loc),
      ]);
      setContent(data);

      // For non-FR locales, rebuild lineup items from locale content
      // using the FR documentId order
      if (loc !== "fr") {
        const contentById = new Map(data.map((item) => [item.id, item]));
        const resolved = {};
        for (const [slug, lineup] of Object.entries(lineupsData)) {
          resolved[slug] = {
            ...lineup,
            articles: (lineup.articleOrder || [])
              .map((docId) => contentById.get(docId))
              .filter(Boolean),
            videos: (lineup.videoOrder || [])
              .map((docId) => contentById.get(docId))
              .filter(Boolean),
            audios: (lineup.audioOrder || [])
              .map((docId) => contentById.get(docId))
              .filter(Boolean),
          };
        }
        setLineups(resolved);
      } else {
        setLineups(lineupsData);
      }
    } catch (error) {
      console.error("Error loading content:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get lineup by slug
  const getLineup = useCallback(
    (slug) => {
      return lineups[slug] || null;
    },
    [lineups],
  );

  // Get filtered content (articles only for main feed)
  const getFilteredContent = useCallback(() => {
    const articlesLineup = lineups["articles"];
    let filtered;

    if (articlesLineup && articlesLineup.articles.length > 0) {
      const lineupIds = new Set(articlesLineup.articles.map((a) => a.id));
      const remainingArticles = content
        .filter((item) => item.type === "article" && !lineupIds.has(item.id))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      filtered = [
        ...articlesLineup.articles.map((a) => ({ ...a, type: "article" })),
        ...remainingArticles,
      ];
    } else {
      filtered = content
        .filter((item) => item.type === "article")
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    if (filter.category !== "all") {
      filtered = strapiService.filterByCategory(filtered, filter.category);
    }

    if (searchQuery) {
      filtered = strapiService.searchContent(filtered, searchQuery);
    }

    return filtered;
  }, [content, lineups, filter.category, searchQuery]);

  const getContentById = useCallback(
    (id) => {
      return content.find((item) => item.id === id);
    },
    [content],
  );

  const value = {
    content,
    lineups,
    loading,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    getFilteredContent,
    getContentById,
    getLineup,
    loadContent: () => loadContent(locale),
  };

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
};
