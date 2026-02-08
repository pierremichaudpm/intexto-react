import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useContent } from "../../context/ContentContext";

const HeroCarousel = ({ onContentClick }) => {
  const { getFeaturedContent } = useContent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const featuredContent = getFeaturedContent();

  useEffect(() => {
    if (featuredContent.length === 0) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % featuredContent.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [featuredContent.length]);

  // EFFET DOUX - Juste fade
  const slideVariants = {
    enter: {
      opacity: 0,
    },
    center: {
      zIndex: 1,
      opacity: 1,
    },
    exit: {
      zIndex: 0,
      opacity: 0,
    },
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      const next = prev + newDirection;
      if (next < 0) return featuredContent.length - 1;
      if (next >= featuredContent.length) return 0;
      return next;
    });
  };

  if (featuredContent.length === 0) return null;

  const current = featuredContent[currentIndex];

  return (
    <div className="hero-carousel-wrapper">
      <div className="hero-carousel-container">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              opacity: { duration: 0.5 },
            }}
            className="hero-carousel-slide"
            onClick={() => onContentClick(current)}
          >
            <div className="hero-carousel-image-wrapper">
              <img
                src={current.image}
                alt={current.title}
                className="hero-carousel-image"
              />
              <div className="hero-carousel-gradient" />
            </div>

            <div className="hero-carousel-content">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <span className="hero-carousel-category">
                  {current.category.toUpperCase()}
                </span>
                <h1 className="hero-carousel-title">{current.title}</h1>
                <p className="hero-carousel-excerpt">{current.excerpt}</p>
                <div className="hero-carousel-meta">
                  <span className="hero-carousel-author">{current.author}</span>
                  <span className="hero-carousel-dot">•</span>
                  <span>
                    {new Date(current.date).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <button className="hero-carousel-cta">Lire l'article</button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          className="hero-carousel-nav hero-carousel-nav-left"
          onClick={() => paginate(-1)}
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className="hero-carousel-nav hero-carousel-nav-right"
          onClick={() => paginate(1)}
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots Indicator */}
        <div className="hero-carousel-dots">
          {featuredContent.map((_, index) => (
            <button
              key={index}
              className={`hero-carousel-dot-btn ${index === currentIndex ? "active" : ""}`}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
