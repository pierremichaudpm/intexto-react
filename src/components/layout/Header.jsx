import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X } from "lucide-react";
import {
  SiFacebook,
  SiInstagram,
  SiX,
  SiWhatsapp,
  SiLinkedin,
} from "react-icons/si";
import { useLanguage } from "../../context/LanguageContext";
import { SUPPORTED_LOCALES, LOCALE_LABELS } from "../../i18n";

const LanguageToggle = () => {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="language-toggle">
      {SUPPORTED_LOCALES.map((loc, i) => (
        <span key={loc}>
          {i > 0 && <span className="language-toggle__separator">|</span>}
          <button
            className={`language-toggle__btn ${locale === loc ? "language-toggle__btn--active" : ""}`}
            onClick={() => setLocale(loc)}
            aria-label={loc === "fr" ? "Français" : loc === "en" ? "English" : "Kreyòl"}
          >
            {LOCALE_LABELS[loc]}
          </button>
        </span>
      ))}
    </div>
  );
};

const Header = ({ onSearchClick, adBanner, hideSearch = false }) => {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSearchClick = () => {
    setMobileMenuOpen(false);
    onSearchClick();
  };

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

        <div className="header-ad-slot">{adBanner}</div>

        {!hideSearch && (
          <>
            <div className="header-actions header-actions-desktop">
              {/* <LanguageToggle /> — uncomment when ready to show language switcher */}

              <div className="header-social-links">
                <a
                  href="https://www.facebook.com/jnnuma/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="header-social-btn"
                  title="Facebook"
                >
                  <SiFacebook size={18} />
                </a>
                <a
                  href="https://www.instagram.com/jnnuma/reels/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="header-social-btn"
                  title="Instagram"
                >
                  <SiInstagram size={18} />
                </a>
                <a
                  href="https://x.com/jeannuma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="header-social-btn"
                  title="X (Twitter)"
                >
                  <SiX size={16} />
                </a>
                <a
                  href="https://www.linkedin.com/in/jean-numa-goudou-a27ab130/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="header-social-btn"
                  title="LinkedIn"
                >
                  <SiLinkedin size={18} />
                </a>
                <a
                  href="https://wa.me/14383951256"
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

            <div className="header-actions-mobile">
              {/* <LanguageToggle /> — uncomment when ready to show language switcher */}
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
              <motion.button
                className="mobile-menu-item mobile-menu-search"
                onClick={handleSearchClick}
                custom={0}
                variants={itemVariants}
                initial="closed"
                animate="open"
              >
                <Search size={20} />
                <span>{t("nav.search")}</span>
              </motion.button>

              <motion.div
                className="mobile-menu-divider"
                custom={1}
                variants={itemVariants}
                initial="closed"
                animate="open"
              />

              <motion.span
                className="mobile-menu-label"
                custom={2}
                variants={itemVariants}
                initial="closed"
                animate="open"
              >
                {t("nav.followUs")}
              </motion.span>

              <div className="mobile-menu-social">
                <motion.a
                  href="https://www.facebook.com/jnnuma/"
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
                  href="https://www.instagram.com/jnnuma/reels/?hl=en"
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
                  href="https://x.com/jeannuma"
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
                  href="https://www.linkedin.com/in/jean-numa-goudou-a27ab130/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-social-btn linkedin"
                  custom={6}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                >
                  <SiLinkedin size={20} />
                </motion.a>
                <motion.a
                  href="https://wa.me/14383951256"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-social-btn whatsapp"
                  custom={7}
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
