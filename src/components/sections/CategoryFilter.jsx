import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { getCategoryColor, getCategoryLabel } from "../../config/categories";

const categorySlugs = [
  "all",
  "moisdelhistoiredesnoirs",
  "politique",
  "actualite",
  "culture",
  "economie",
  "immigration",
  "sante",
  "opinion",
  "apropos",
];

const CategoryFilter = ({ activeCategory, onCategoryChange }) => {
  const { t } = useTranslation();

  return (
    <div className="category-filter">
      <div className="category-filter-container">
        <img
          src="/Images/intextologo2.png"
          alt="Intexto"
          className="category-filter-logo"
        />
        {categorySlugs.map((slug) => {
          const isActive = activeCategory === slug;
          const color =
            slug === "all" || slug === "apropos"
              ? "#004ea0"
              : getCategoryColor(slug);
          const label =
            slug === "all" ? t("category.all") : getCategoryLabel(slug, t);

          return (
            <motion.button
              key={slug}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`category-btn ${isActive ? "active" : ""}`}
              style={
                isActive
                  ? {
                      backgroundColor: color,
                      borderColor: color,
                      color: "white",
                    }
                  : undefined
              }
              onClick={() => onCategoryChange(slug)}
            >
              {label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
