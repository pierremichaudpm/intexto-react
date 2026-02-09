import { useContent } from "../../context/ContentContext";
import { Trash2, Star } from "lucide-react";
import cmsService from "../../services/cmsService";
import { getCategoryLabel } from "../../config/categories";
import { useTranslation } from "react-i18next";

const ContentList = () => {
  const { t } = useTranslation();
  const { content, deleteContent } = useContent();

  const handleDelete = async (id, title) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${title}"?`)) {
      try {
        await deleteContent(id);
      } catch (error) {
        alert("❌ Erreur lors de la suppression");
      }
    }
  };

  if (content.length === 0) {
    return (
      <div className="no-content">
        <p>Aucun contenu disponible</p>
      </div>
    );
  }

  return (
    <div className="content-list">
      {content.map((item) => (
        <div key={item.id} className="content-item">
          <div className="content-item-info">
            <h4>{item.title}</h4>
            <div className="content-item-meta">
              {getCategoryLabel(item.category, t)} • {item.type} •{" "}
              {cmsService.formatDate(item.date)}
              {item.featured && (
                <span className="featured-badge">
                  <Star size={14} fill="currentColor" /> À la une
                </span>
              )}
            </div>
          </div>

          <div className="content-item-actions">
            <button
              className="btn-delete"
              onClick={() => handleDelete(item.id, item.title)}
            >
              <Trash2 size={16} />
              Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContentList;
