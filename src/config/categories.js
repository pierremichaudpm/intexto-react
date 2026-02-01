// Category configuration - refined color palette with Haitian heritage influence
export const categoryColors = {
  actualite: "#1C1917", // Deep charcoal
  politique: "#8B1538", // Burgundy (primary)
  economie: "#166534", // Forest green
  societe: "#7C3AED", // Purple
  culture: "#1A7FA8", // Teal blue
  sport: "#B45309", // Amber
  tech: "#0F766E", // Teal
  sante: "#DC2626", // Red
  environnement: "#15803D", // Green
  voyage: "#C4932A", // Gold (secondary)
  international: "#2563EB", // Blue
  opinion: "#6B21A8", // Deep purple
  immigration: "#0D9488", // Cyan
};

export const categoryLabels = {
  actualite: "Actualité",
  politique: "Politique",
  economie: "Économie",
  societe: "Société",
  culture: "Culture",
  sport: "Sport",
  tech: "Tech",
  sante: "Santé",
  environnement: "Environnement",
  voyage: "Voyage",
  international: "International",
  opinion: "Opinion",
  immigration: "Immigration",
};

// Default color for unknown categories
export const defaultCategoryColor = "#666666";

// Helper function to get category color with fallback
export const getCategoryColor = (category) => {
  return categoryColors[category] || defaultCategoryColor;
};

// Helper function to get category label with fallback (capitalize slug)
export const getCategoryLabel = (category) => {
  if (categoryLabels[category]) {
    return categoryLabels[category];
  }
  // Fallback: capitalize first letter of slug
  return category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "Autre";
};
