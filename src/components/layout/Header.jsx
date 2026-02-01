import { motion } from "framer-motion";
import { Search, Facebook, Instagram, MessageCircle } from "lucide-react";

const Header = ({ onSearchClick, adBanner, hideSearch = false }) => {
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
          <div className="header-actions">
            {/* Social media links */}
            <div className="header-social-links">
              <a
                href="https://www.facebook.com/intexto"
                target="_blank"
                rel="noopener noreferrer"
                className="header-social-btn"
                title="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://www.instagram.com/intexto"
                target="_blank"
                rel="noopener noreferrer"
                className="header-social-btn"
                title="Instagram"
              >
                <Instagram size={18} />
              </a>
              {/* X (Twitter) icon */}
              <a
                href="https://x.com/intexto"
                target="_blank"
                rel="noopener noreferrer"
                className="header-social-btn"
                title="X (Twitter)"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* WhatsApp */}
              <a
                href="https://wa.me/15141234567"
                target="_blank"
                rel="noopener noreferrer"
                className="header-social-btn whatsapp"
                title="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
            </div>

            <button className="search-btn" onClick={onSearchClick}>
              <Search size={20} />
            </button>
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
