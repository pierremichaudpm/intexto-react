import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X } from "lucide-react";
import { SiFacebook, SiInstagram, SiX, SiWhatsapp } from "react-icons/si";

const Header = ({ onSearchClick, adBanner, hideSearch = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSearchClick = () => {
    setMobileMenuOpen(false);
    onSearchClick();
  };

  // Door opening animation variants
  const menuVariants = {
    closed: {
      rotateY: -90,
      opacity: 0,
      transformOrigin: "left center",
    },
    open: {
      rotateY: 0,
      opacity: 1,
      transformOrigin: "left center",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      rotateY: -90,
      opacity: 0,
      transformOrigin: "left center",
      transition: {
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    }),
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
          <img
            src="/Images/intextologo.png"
            alt="Intexto Logo"
            className="logo"
          />
        </div>

        {/* Ad banner in center on desktop */}
        <div className="header-ad-slot">{adBanner}</div>

        {!hideSearch && (
          <>
            {/* Desktop actions */}
            <div className="header-actions header-actions-desktop">
              {/* Social media links */}
              <div className="header-social-links">
                <a
                  href="https://www.facebook.com/intexto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="header-social-btn"
                  title="Facebook"
                >
                  <SiFacebook size={18} />
                </a>
                <a
                  href="https://www.instagram.com/intexto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="header-social-btn"
                  title="Instagram"
                >
                  <SiInstagram size={18} />
                </a>
                <a
                  href="https://x.com/intexto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="header-social-btn"
                  title="X (Twitter)"
                >
                  <SiX size={16} />
                </a>
                <a
                  href="https://wa.me/15141234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="header-social-btn"
                  title="WhatsApp"
                >
                  <SiWhatsapp size={18} />
                </a>
              </div>

              <button className="search-btn" onClick={onSearchClick}>
                <Search size={20} />
              </button>
            </div>

            {/* Mobile burger menu */}
            <div className="header-actions-mobile">
              <button
                className="mobile-burger-btn"
                onClick={toggleMobileMenu}
                aria-label="Menu"
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X size={24} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu size={24} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile menu panel - door effect */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-menu-panel"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="exit"
          >
            <div className="mobile-menu-content">
              {/* Search button */}
              <motion.button
                className="mobile-menu-item mobile-menu-search"
                onClick={handleSearchClick}
                custom={0}
                variants={itemVariants}
                initial="closed"
                animate="open"
              >
                <Search size={20} />
                <span>Rechercher</span>
              </motion.button>

              {/* Divider */}
              <motion.div
                className="mobile-menu-divider"
                custom={1}
                variants={itemVariants}
                initial="closed"
                animate="open"
              />

              {/* Social links label */}
              <motion.span
                className="mobile-menu-label"
                custom={2}
                variants={itemVariants}
                initial="closed"
                animate="open"
              >
                Suivez-nous
              </motion.span>

              {/* Social media links */}
              <div className="mobile-menu-social">
                <motion.a
                  href="https://www.facebook.com/intexto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-social-btn facebook"
                  custom={3}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                >
                  <SiFacebook size={20} />
                </motion.a>
                <motion.a
                  href="https://www.instagram.com/intexto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-social-btn instagram"
                  custom={4}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                >
                  <SiInstagram size={22} />
                </motion.a>
                <motion.a
                  href="https://x.com/intexto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-social-btn twitter"
                  custom={5}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                >
                  <SiX size={20} />
                </motion.a>
                <motion.a
                  href="https://wa.me/15141234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-social-btn whatsapp"
                  custom={6}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                >
                  <SiWhatsapp size={22} />
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
