import { useTranslation } from "react-i18next";

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  const { t } = useTranslation();

  if (!categories || categories.length <= 1) return null;

  return (
    <div className="category-filter" role="tablist" aria-label={t("category.filterLabel")}>
      <button
        className={`category-filter__btn ${activeCategory === "all" ? "category-filter__btn--active" : ""}`}
        onClick={() => onCategoryChange("all")}
        role="tab"
        aria-selected={activeCategory === "all"}
      >
        {t("category.all")}
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id || cat}
          className={`category-filter__btn ${activeCategory === (cat.slug || cat) ? "category-filter__btn--active" : ""}`}
          onClick={() => onCategoryChange(cat.slug || cat)}
          role="tab"
          aria-selected={activeCategory === (cat.slug || cat)}
        >
          {cat.name || cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
