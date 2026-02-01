import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import strapiService from "../services/strapiService";

const ContentContext = createContext();

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within ContentProvider");
  }
  return context;
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ category: "all", type: "all" });
  const [searchQuery, setSearchQuery] = useState("");

  // Load content on mount
  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const data = await strapiService.loadContent();
      setContent(data);
    } catch (error) {
      console.error("Error loading content:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add content (for future CMS integration)
  const addContent = async (contentData) => {
    console.warn("Add content not yet implemented with Strapi");
    throw new Error("Add content requires admin authentication");
  };

  // Update content (for future CMS integration)
  const updateContent = async (id, updates) => {
    console.warn("Update content not yet implemented with Strapi");
    throw new Error("Update content requires admin authentication");
  };

  // Delete content (for future CMS integration)
  const deleteContent = async (id) => {
    console.warn("Delete content not yet implemented with Strapi");
    throw new Error("Delete content requires admin authentication");
  };

  // Get filtered content (articles only for main lineup) - memoized
  const getFilteredContent = useCallback(() => {
    // Start with articles only (videos and audios have dedicated sections)
    let filtered = content.filter((item) => item.type === "article");

    // Apply category filter
    if (filter.category !== "all") {
      filtered = strapiService.filterByCategory(filtered, filter.category);
    }

    // Apply search
    if (searchQuery) {
      filtered = strapiService.searchContent(filtered, searchQuery);
    }

    // Sort by order first (1, 2, 3...), then items with order 0 or no order by date
    filtered.sort((a, b) => {
      const aHasOrder = a.order && a.order > 0;
      const bHasOrder = b.order && b.order > 0;

      // Both have order > 0: sort by order ascending
      if (aHasOrder && bHasOrder) {
        return a.order - b.order;
      }
      // Only a has order: a comes first
      if (aHasOrder && !bHasOrder) {
        return -1;
      }
      // Only b has order: b comes first
      if (!aHasOrder && bHasOrder) {
        return 1;
      }
      // Neither has order (or order is 0): sort by date newest first
      return new Date(b.date) - new Date(a.date);
    });

    return filtered;
  }, [content, filter.category, searchQuery]);

  // Get featured content - memoized
  const getFeaturedContent = useCallback(() => {
    return content.filter((item) => item.featured).slice(0, 5);
  }, [content]);

  // Get content by ID - memoized
  const getContentById = useCallback(
    (id) => {
      return content.find((item) => item.id === id);
    },
    [content],
  );

  const value = {
    content,
    loading,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    addContent,
    updateContent,
    deleteContent,
    getFilteredContent,
    getFeaturedContent,
    getContentById,
    loadContent,
  };

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
};
