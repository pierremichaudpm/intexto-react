import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ContentCard from "../common/ContentCard";
import CategoryFilter from "./CategoryFilter";

const MediaSection = ({ title, items, type, onItemClick, id }) => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("all");
  const [showAll, setShowAll] = useState(false);

  const categories = useMemo(() => {
    const cats = new Map();
    items.forEach((item) => {
      const cat = item.category || item.categorie;
      if (cat?.name) {
        cats.set(cat.name, {
          id: cat.id,
          name: cat.name,
          slug: cat.slug || cat.name.toLowerCase(),
        });
      }
    });
    return Array.from(cats.values());
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter((item) => {
      const cat = item.category || item.categorie;
      return (
        cat &&
        (cat.slug === activeCategory ||
          cat.name?.toLowerCase() === activeCategory)
      );
    });
  }, [items, activeCategory]);

  const displayedItems = showAll ? filteredItems : filteredItems.slice(0, 6);

  if (!items || items.length === 0) return null;

  return (
    <section className="media-section" id={id} aria-label={title}>
      <div className="media-section__header">
        <h2 className="media-section__title">{title}</h2>
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      <div className="media-section__grid">
        {displayedItems.map((item) => (
          <ContentCard
            key={item.id}
            item={item}
            type={type}
            onClick={onItemClick}
          />
        ))}
      </div>

      {filteredItems.length > 6 && (
        <div className="media-section__load-more">
          <button
            className="btn btn--outline"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll
              ? t("section.showLess")
              : t("section.showAll", { count: filteredItems.length })}
          </button>
        </div>
      )}
    </section>
  );
};

export default MediaSection;
