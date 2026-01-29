import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Menu, X } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

const categories = [
  { id: 'all', label: 'Tout' },
  { id: 'actualite', label: 'Actualité' },
  { id: 'politique', label: 'Politique' },
  { id: 'voyage', label: 'Voyage' },
  { id: 'culture', label: 'Culture' }
];

const Header = ({ onSearchClick }) => {
  const { filter, setFilter } = useContent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCategoryClick = (categoryId) => {
    setFilter(prev => ({ ...prev, category: categoryId }));
    setMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="main-header"
    >
      <div className="header-container">
        <div className="logo-section">
          <img src="/Images/intextologo.png" alt="Intexto Logo" className="logo" />
        </div>

        <nav className={`main-nav ${mobileMenuOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            {categories.map(cat => (
              <li key={cat.id}>
                <a
                  href="#"
                  className={filter.category === cat.id ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryClick(cat.id);
                  }}
                >
                  {cat.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <button className="search-btn" onClick={onSearchClick}>
            <Search size={20} />
          </button>

          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
