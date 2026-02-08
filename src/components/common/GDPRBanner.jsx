import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cookie, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

const GDPRBanner = () => {
  const { t } = useTranslation();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem("gdpr-consent");
    if (!consent) {
      // Show banner after a small delay
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("gdpr-consent", "accepted");
    localStorage.setItem("gdpr-consent-date", new Date().toISOString());
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("gdpr-consent", "declined");
    localStorage.setItem("gdpr-consent-date", new Date().toISOString());
    setShowBanner(false);
  };

  const handleClose = () => {
    setShowBanner(false);
    // Will show again next time if not accepted
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="gdpr-banner"
        >
          <button
            className="gdpr-banner-close"
            onClick={handleClose}
            aria-label={t("gdpr.close")}
          >
            <X size={20} />
          </button>

          <div className="gdpr-banner-content">
            <div className="gdpr-banner-icon">
              <Cookie size={32} />
            </div>

            <div className="gdpr-banner-text">
              <h3 className="gdpr-banner-title">
                <Shield size={20} />
                Confidentialité et cookies
              </h3>
              <p className="gdpr-banner-description">
                Nous utilisons des cookies pour améliorer votre expérience de
                navigation, analyser le trafic du site et personnaliser le
                contenu. En cliquant sur "Tout accepter", vous consentez à
                l'utilisation de TOUS les cookies. Consultez notre{" "}
                <a href="/politique-confidentialite" className="gdpr-link">
                  politique de confidentialité
                </a>{" "}
                pour plus d'informations.
              </p>
            </div>

            <div className="gdpr-banner-actions">
              <button
                className="gdpr-btn gdpr-btn-decline"
                onClick={handleDecline}
              >
                Refuser
              </button>
              <button
                className="gdpr-btn gdpr-btn-accept"
                onClick={handleAccept}
              >
                Tout accepter
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GDPRBanner;
