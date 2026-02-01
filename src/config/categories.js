// Category configuration - colors and labels for all categories
export const categoryColors = {
  actualite: "#000000",
  politique: "#dd4f4f",
  economie: "#2ecc71",
  societe: "#9b59b6",
  culture: "#008bff",
  sport: "#e67e22",
  tech: "#1abc9c",
  sante: "#e74c3c",
  environnement: "#27ae60",
  voyage: "#dd9933",
  international: "#3498db",
  opinion: "#8e44ad",
  immigration: "#16a085",
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
