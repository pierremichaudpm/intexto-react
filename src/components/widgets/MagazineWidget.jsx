import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";

const API_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

const MagazineWidget = () => {
  const [currentIssue, setCurrentIssue] = useState(0);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/magazines?populate=*&sort=order:asc,publishedDate:desc`,
        );
        const data = await response.json();

        if (data.data && data.data.length > 0) {
          const transformed = data.data.map((item) => {
            // Get the best quality cover image (prefer large format, fallback to original)
            let coverUrl = null;
            if (item.coverImage) {
              // Use large format if available for better quality
              if (item.coverImage.formats?.large?.url) {
                coverUrl = item.coverImage.formats.large.url;
              } else if (item.coverImage.url) {
                coverUrl = item.coverImage.url;
              }
              // Ensure absolute URL
              if (coverUrl && !coverUrl.startsWith("http")) {
                coverUrl = `${API_URL}${coverUrl}`;
              }
            }

            // Get PDF URL
            let pdfUrl = null;
            if (item.pdfFile?.url) {
              pdfUrl = item.pdfFile.url;
              // Ensure absolute URL
              if (!pdfUrl.startsWith("http")) {
                pdfUrl = `${API_URL}${pdfUrl}`;
              }
            }

            return {
              id: item.documentId,
              title: item.title,
              edition: item.edition,
              coverImage: coverUrl,
              pdfUrl: pdfUrl,
              pages: item.pages || 0,
            };
          });
          setIssues(transformed);
        }
      } catch (error) {
        console.error("Error fetching magazines:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMagazines();
  }, []);

  if (loading) {
    return null;
  }

  if (issues.length === 0) {
    return null;
  }

  const currentMagazine = issues[currentIssue];

  const handlePrevious = () => {
    setCurrentIssue((prev) => (prev > 0 ? prev - 1 : issues.length - 1));
  };

  const handleNext = () => {
    setCurrentIssue((prev) => (prev < issues.length - 1 ? prev + 1 : 0));
  };

  const handleDownload = () => {
    if (!currentMagazine.pdfUrl) {
      alert("PDF non disponible");
      return;
    }
    // Add download flag for Cloudinary
    let downloadUrl = currentMagazine.pdfUrl;
    if (
      downloadUrl.includes("cloudinary") &&
      downloadUrl.includes("/upload/")
    ) {
      downloadUrl = downloadUrl.replace("/upload/", "/upload/fl_attachment/");
    }
    window.open(downloadUrl, "_blank", "noopener,noreferrer");
  };

  const handlePreview = () => {
    if (!currentMagazine.pdfUrl) {
      alert("PDF non disponible");
      return;
    }
    window.open(currentMagazine.pdfUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="magazine-widget">
      <div className="magazine-widget-header">
        <BookOpen size={20} />
        <h3>Version Papier</h3>
      </div>

      <div className="magazine-cover-container">
        <motion.div
          key={currentIssue}
          initial={{ opacity: 0, rotateY: -10 }}
          animate={{ opacity: 1, rotateY: 0 }}
          transition={{ duration: 0.5 }}
          className="magazine-cover"
        >
          {currentMagazine.coverImage ? (
            <img
              src={currentMagazine.coverImage}
              alt={`${currentMagazine.title} - ${currentMagazine.edition}`}
              className="magazine-cover-image"
              loading="lazy"
            />
          ) : (
            <div className="magazine-cover-placeholder">
              <BookOpen size={64} />
              <div className="magazine-cover-text">
                <h4>{currentMagazine.title}</h4>
                <p>{currentMagazine.edition}</p>
                <span className="magazine-pages">
                  {currentMagazine.pages} pages
                </span>
              </div>
            </div>
          )}

          {/* Navigation arrows */}
          {issues.length > 1 && (
            <>
              <button
                className="magazine-nav magazine-nav-left"
                onClick={handlePrevious}
                aria-label="Édition précédente"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className="magazine-nav magazine-nav-right"
                onClick={handleNext}
                aria-label="Édition suivante"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </motion.div>

        {/* Issue indicator dots */}
        {issues.length > 1 && (
          <div className="magazine-dots">
            {issues.map((_, index) => (
              <button
                key={index}
                className={`magazine-dot ${index === currentIssue ? "active" : ""}`}
                onClick={() => setCurrentIssue(index)}
                aria-label={`Aller à l'édition ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="magazine-info">
        <p className="magazine-edition">{currentMagazine.edition}</p>
        <p className="magazine-pages-info">{currentMagazine.pages} pages</p>
      </div>

      <div className="magazine-actions">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="magazine-btn magazine-btn-preview"
          onClick={handlePreview}
          disabled={!currentMagazine.pdfUrl}
        >
          <Eye size={18} />
          Feuilleter
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="magazine-btn magazine-btn-download"
          onClick={handleDownload}
          disabled={!currentMagazine.pdfUrl}
        >
          <Download size={18} />
          Télécharger PDF
        </motion.button>
      </div>
    </div>
  );
};

export default MagazineWidget;
