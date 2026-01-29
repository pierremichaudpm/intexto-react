import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

const SearchOverlay = ({ isOpen, onClose }) => {
  const { content, searchQuery, setSearchQuery } = useContent();
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const filtered = content.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered.slice(0, 5));
    } else {
      setResults([]);
    }
  }, [searchQuery, content]);

  const handleResultClick = (item) => {
    // This will be handled by parent component
    onClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    setResults([]);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="search-overlay"
        >
          <div className="search-container">
            <input
              type="text"
              id="search-input"
              placeholder="Rechercher des articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button className="close-search" onClick={handleClose}>
              <X size={32} />
            </button>
          </div>

          <div className="search-results">
            {searchQuery.length >= 2 && results.length === 0 && (
              <p className="search-no-results">Aucun résultat trouvé</p>
            )}

            {results.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="search-result-item"
                onClick={() => handleResultClick(item)}
              >
                <h4>{item.title}</h4>
                <p>{item.excerpt.substring(0, 100)}...</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
