import { motion } from "framer-motion";
import { getCategoryColor, getCategoryLabel } from "../../config/categories";

const categories = [
  { id: "all", label: "Tout" },
  { id: "politique", label: "Politique" },
  { id: "actualite", label: "Actualité" },
  { id: "culture", label: "Culture" },
  { id: "economie", label: "Économie" },
  { id: "immigration", label: "Immigration" },
  { id: "sport", label: "Sport" },
  { id: "sante", label: "Santé" },
  { id: "opinion", label: "Opinion" },
  { id: "voyage", label: "Voyage" },
  { id: "societe", label: "Société" },
];

const CategoryFilter = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="category-filter">
      <div className="category-filter-container">
        <img
          src="/Images/intextologo2.png"
          alt="Intexto"
          className="category-filter-logo"
        />
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          const color =
            category.id === "all" ? "#074999" : getCategoryColor(category.id);

          return (
            <motion.button
              key={category.id}
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
              onClick={() => onCategoryChange(category.id)}
            >
              {category.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
