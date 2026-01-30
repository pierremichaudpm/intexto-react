import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Eye, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

const MagazineWidget = () => {
  const [currentIssue, setCurrentIssue] = useState(0);

  // Sample magazine issues - replace with real data
  const issues = [
    {
      id: 1,
      title: "Intexto Magazine",
      edition: "Édition Janvier 2026",
      coverImage: "/Images/magazine-cover-jan.jpg", // You'll need to add actual cover images
      pdfUrl: "/pdfs/intexto-janvier-2026.pdf",
      pages: 24,
    },
    {
      id: 2,
      title: "Intexto Magazine",
      edition: "Édition Décembre 2025",
      coverImage: "/Images/magazine-cover-dec.jpg",
      pdfUrl: "/pdfs/intexto-decembre-2025.pdf",
      pages: 28,
    },
  ];

  const currentMagazine = issues[currentIssue];

  const handlePrevious = () => {
    setCurrentIssue((prev) => (prev > 0 ? prev - 1 : issues.length - 1));
  };

  const handleNext = () => {
    setCurrentIssue((prev) => (prev < issues.length - 1 ? prev + 1 : 0));
  };

  const handleDownload = () => {
    // Trigger PDF download
    window.open(currentMagazine.pdfUrl, "_blank");
  };

  const handlePreview = () => {
    // Open PDF in new tab for preview
    window.open(currentMagazine.pdfUrl, "_blank");
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
          {/* Fallback if no cover image */}
          <div className="magazine-cover-placeholder">
            <BookOpen size={64} />
            <div className="magazine-cover-text">
              <h4>{currentMagazine.title}</h4>
              <p>{currentMagazine.edition}</p>
              <span className="magazine-pages">{currentMagazine.pages} pages</span>
            </div>
          </div>

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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="magazine-btn magazine-btn-preview"
          onClick={handlePreview}
        >
          <Eye size={18} />
          Feuilleter
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="magazine-btn magazine-btn-download"
          onClick={handleDownload}
        >
          <Download size={18} />
          Télécharger PDF
        </motion.button>
      </div>
    </div>
  );
};

export default MagazineWidget;
