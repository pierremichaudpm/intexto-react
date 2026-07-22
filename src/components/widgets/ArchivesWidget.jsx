import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Archive, ExternalLink } from "lucide-react";

const ARCHIVES_URL = "https://pierremichaudpm.github.io/intextoarchives/";

const ArchivesWidget = () => {
  const { t } = useTranslation();

  return (
    <div className="magazine-widget archives-widget">
      <div className="magazine-widget-header">
        <Archive size={20} />
        <h3>
          <span className="archives-wordmark">Archives</span>
        </h3>
      </div>

      <div className="archives-body">
        <img
          src="/Images/intextologo2.png"
          alt="inTexto"
          className="archives-logo"
          loading="lazy"
        />
        <p className="archives-description">{t("archives.description")}</p>
      </div>

      <div className="magazine-actions">
        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="magazine-btn magazine-btn-download archives-btn"
          href={ARCHIVES_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink size={18} />
          {t("archives.visit")}
        </motion.a>
      </div>
    </div>
  );
};

export default ArchivesWidget;
