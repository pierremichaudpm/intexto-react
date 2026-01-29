import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, List } from 'lucide-react';
import AddContentForm from './AddContentForm';
import ContentList from './ContentList';

const AdminPanel = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('add');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 500 }}
          animate={{ x: 0 }}
          exit={{ x: 500 }}
          transition={{ type: 'spring', damping: 25 }}
          className="admin-panel"
        >
          <div className="admin-header">
            <h2>Gestion de contenu</h2>
            <button className="close-admin" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <div className="admin-tabs">
            <button
              className={`admin-tab ${activeTab === 'add' ? 'active' : ''}`}
              onClick={() => setActiveTab('add')}
            >
              <Plus size={18} />
              Ajouter
            </button>
            <button
              className={`admin-tab ${activeTab === 'manage' ? 'active' : ''}`}
              onClick={() => setActiveTab('manage')}
            >
              <List size={18} />
              Gérer
            </button>
          </div>

          <div className="admin-content">
            {activeTab === 'add' && <AddContentForm onSuccess={onClose} />}
            {activeTab === 'manage' && <ContentList />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminPanel;
