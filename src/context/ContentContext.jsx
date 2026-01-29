import { createContext, useContext, useState, useEffect } from 'react';
import cmsService from '../services/cmsService';

const ContentContext = createContext();

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within ContentProvider');
  }
  return context;
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ category: 'all', type: 'all' });
  const [searchQuery, setSearchQuery] = useState('');

  // Load content on mount
  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const data = await cmsService.loadContent();
      setContent(data);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add content
  const addContent = async (contentData) => {
    try {
      const newContent = await cmsService.addContent(contentData);
      setContent(prev => [newContent, ...prev]);
      return newContent;
    } catch (error) {
      console.error('Error adding content:', error);
      throw error;
    }
  };

  // Update content
  const updateContent = async (id, updates) => {
    try {
      const updated = await cmsService.updateContent(id, updates);
      setContent(prev =>
        prev.map(item => item.id === id ? updated : item)
      );
      return updated;
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  };

  // Delete content
  const deleteContent = async (id) => {
    try {
      await cmsService.deleteContent(id);
      setContent(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting content:', error);
      throw error;
    }
  };

  // Get filtered content
  const getFilteredContent = () => {
    let filtered = [...content];

    // Apply category filter
    if (filter.category !== 'all') {
      filtered = cmsService.filterByCategory(filtered, filter.category);
    }

    // Apply type filter
    if (filter.type !== 'all') {
      filtered = cmsService.filterByType(filtered, filter.type);
    }

    // Apply search
    if (searchQuery) {
      filtered = cmsService.searchContent(filtered, searchQuery);
    }

    return filtered;
  };

  // Get featured content
  const getFeaturedContent = () => {
    return content.filter(item => item.featured).slice(0, 5);
  };

  // Get content by ID
  const getContentById = (id) => {
    return content.find(item => item.id === id);
  };

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
    loadContent
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};
