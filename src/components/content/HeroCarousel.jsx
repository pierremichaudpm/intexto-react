import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import HeroCard from "../common/HeroCard";

const HeroCarousel = ({ items, onItemClick }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (!isAutoPlaying || items.length <= 1) return;
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext, items.length]);

  if (!items || items.length === 0) return null;

  return (
    <section className="hero-carousel" aria-label={t("hero.featured")}>
      <div className="hero-carousel__container">
        <div
          className="hero-carousel__track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((entry, index) => (
            <div
              key={`${entry.type}-${entry.item.id}`}
              className="hero-carousel__slide"
            >
              <HeroCard
                item={entry.item}
                type={entry.type}
                onClick={onItemClick}
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {items.length > 1 && (
          <>
            <button
              className="hero-carousel__nav hero-carousel__nav--prev"
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
                setIsAutoPlaying(false);
              }}
              aria-label={t("hero.previous")}
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              className="hero-carousel__nav hero-carousel__nav--next"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
                setIsAutoPlaying(false);
              }}
              aria-label={t("hero.next")}
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            <div className="hero-carousel__dots">
              {items.map((_, index) => (
                <button
                  key={index}
                  className={`hero-carousel__dot ${index === currentIndex ? "hero-carousel__dot--active" : ""}`}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  aria-label={t("hero.goToSlide", { number: index + 1 })}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default HeroCarousel;
