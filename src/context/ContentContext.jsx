/* eslint-disable react-refresh/only-export-components -- Context provider and its consumer hook share this module. */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import strapiService from "../services/strapiService";
import { useLanguage } from "./LanguageContext";

const ContentContext = createContext();

function bootstrapContent(locale) {
  const bootstrap = window.__INTEXTO_BOOTSTRAP__;
  if (bootstrap?.locale !== locale) return [];
  return bootstrap.items.map(item => {
    const transform = { article: "transformArticle", video: "transformVideo", audio: "transformAudio" }[item.type];
    return strapiService[transform](item);
  });
}

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within ContentProvider");
  }
  return context;
};

export const ContentProvider = ({ children }) => {
  const { locale } = useLanguage();
  const [content, setContent] = useState(() => bootstrapContent(locale));
  const [lineups, setLineups] = useState({});
  const [loading, setLoading] = useState(window.__INTEXTO_BOOTSTRAP__?.locale !== locale);
  const [filter, setFilter] = useState({ category: "all", type: "all" });
  const [searchQuery, setSearchQuery] = useState("");
  const loadVersion = useRef(0);

  const loadContent = useCallback(async (loc) => {
    const version = ++loadVersion.current;
    const bootstrap = window.__INTEXTO_BOOTSTRAP__;
    if (bootstrap?.locale !== loc) setLoading(true);
    try {
      const [data, lineupsData] = await Promise.all([
        strapiService.loadContent(loc),
        strapiService.fetchLineups(loc),
      ]);
      if (version !== loadVersion.current) return;
      // Keep a directly requested article reachable even beyond the feed's page limit.
      const requested = bootstrap?.locale === loc
        ? bootstrapContent(loc).filter(item => !data.some(other => other.id === item.id && other.type === item.type))
        : [];
      setContent([...data, ...requested]);
      setLineups(lineupsData);
    } catch (error) {
      console.error("Error loading content:", error);
    } finally {
      if (version === loadVersion.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContent(locale);
  }, [locale, loadContent]);

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
