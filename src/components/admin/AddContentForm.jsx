import { useState } from 'react';
import { useContent } from '../../context/ContentContext';

const AddContentForm = ({ onSuccess }) => {
  const { addContent } = useContent();
  const [formData, setFormData] = useState({
    type: 'article',
    title: '',
    category: 'actualite',
    image: '',
    excerpt: '',
    content: '',
    author: '',
    featured: false,
    mediaUrl: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const contentData = {
        ...formData,
        image: formData.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80'
      };

      await addContent(contentData);

      // Reset form
      setFormData({
        type: 'article',
        title: '',
        category: 'actualite',
        image: '',
        excerpt: '',
        content: '',
        author: '',
        featured: false,
        mediaUrl: ''
      });

      alert('✅ Contenu publié avec succès!');
      // onSuccess();
    } catch (error) {
      alert('❌ Erreur lors de la publication');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-content-form">
      <div className="form-group">
        <label>Type de contenu</label>
        <select name="type" value={formData.type} onChange={handleChange} required>
          <option value="article">Article</option>
          <option value="video">Vidéo</option>
          <option value="audio">Audio</option>
        </select>
      </div>

      <div className="form-group">
        <label>Titre</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Catégorie</label>
        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="actualite">Actualité</option>
          <option value="politique">Politique</option>
          <option value="voyage">Voyage</option>
          <option value="culture">Culture</option>
        </select>
      </div>

      <div className="form-group">
        <label>Image de couverture (URL)</label>
        <input
          type="url"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://..."
        />
      </div>

      {(formData.type === 'video' || formData.type === 'audio') && (
        <div className="form-group">
          <label>URL média (pour vidéo/audio)</label>
          <input
            type="url"
            name="mediaUrl"
            value={formData.mediaUrl}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>
      )}

      <div className="form-group">
        <label>Extrait</label>
        <textarea
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          rows="3"
          required
        />
      </div>

      <div className="form-group">
        <label>Contenu</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows="8"
          required
        />
      </div>

      <div className="form-group">
        <label>Auteur</label>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
          />
          Article à la une
        </label>
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Publication...' : 'Publier'}
      </button>
    </form>
  );
};

export default AddContentForm;
