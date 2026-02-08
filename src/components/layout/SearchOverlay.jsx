import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X, Search, FileText, Video, Mic } from "lucide-react";
import { useContent } from "../../context/ContentContext";
import { getCategoryColor, getCategoryLabel } from "../../config/categories";
import cmsService from "../../services/cmsService";
import Header from "./Header";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";

const SearchOverlay = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { buildPath } = useLanguage();
  const { content, searchQuery, setSearchQuery } = useContent();
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const filtered = content.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.content &&
            item.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
          item.author.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setResults(filtered.slice(0, 8));
    } else {
      setResults([]);
    }
  }, [searchQuery, content]);

  const handleResultClick = (item) => {
    // Navigate to the content URL
    const typeRoute =
      item.type === "video"
        ? "video"
        : item.type === "audio"
          ? "audio"
          : "article";
    navigate(buildPath(`/${typeRoute}/${item.slug}`));
    handleClose();
  };

  const handleClose = () => {
    setSearchQuery("");
    setResults([]);
    onClose();
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "video":
        return <Video size={16} />;
      case "audio":
        return <Mic size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="search-overlay"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div className="search-overlay-header">
            <Header hideSearch={true} />
          </div>

          <div className="search-container">
            <div className="search-input-wrapper">
              <Search size={24} className="search-input-icon" />
              <input
                type="text"
                id="search-input"
                placeholder={t("search.placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
            <button className="close-search" onClick={handleClose}>
              <X size={32} />
            </button>
          </div>

          <div className="search-results">
            {searchQuery.length >= 2 && results.length === 0 && (
              <div className="search-no-results">
                <Search size={48} />
                <p>Aucun résultat trouvé pour "{searchQuery}"</p>
              </div>
            )}

            {searchQuery.length > 0 && searchQuery.length < 2 && (
              <div className="search-hint">
                <p>{t("search.minChars")}</p>
              </div>
            )}

            {results.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="search-result-item"
                onClick={() => handleResultClick(item)}
              >
                <div className="search-result-image">
                  {item.imageFallback ? (
                    <img src={item.imageFallback} alt={item.title} />
                  ) : (
                    <div className="search-result-placeholder">
                      {getTypeIcon(item.type)}
                    </div>
                  )}
                  <span className="search-result-type">
                    {getTypeIcon(item.type)}
                  </span>
                </div>
                <div className="search-result-content">
                  <span
                    className="search-result-category"
                    style={{ backgroundColor: getCategoryColor(item.category) }}
                  >
                    {getCategoryLabel(item.category)}
                  </span>
                  <h4>{item.title}</h4>
                  <p className="search-result-meta">
                    {item.author} • {cmsService.formatDate(item.date)}
                  </p>
                </div>
              </motion.div>
            ))}

            {results.length > 0 && (
              <p className="search-results-count">
                {results.length} résultat{results.length > 1 ? "s" : ""} trouvé
                {results.length > 1 ? "s" : ""}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
