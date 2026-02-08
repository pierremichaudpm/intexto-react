import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const GDPRBanner = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("intexto-gdpr-consent");
    if (!consent) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("intexto-gdpr-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("intexto-gdpr-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="gdpr-banner" role="dialog" aria-label={t("gdpr.label")}>
      <div className="gdpr-content">
        <p>{t("gdpr.message")}</p>
        <div className="gdpr-actions">
          <button className="gdpr-btn gdpr-btn--accept" onClick={handleAccept}>
            {t("gdpr.accept")}
          </button>
          <button className="gdpr-btn gdpr-btn--decline" onClick={handleDecline}>
            {t("gdpr.decline")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GDPRBanner;
