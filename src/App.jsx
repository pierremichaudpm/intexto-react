import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Settings } from "lucide-react";
import { ContentProvider } from "./context/ContentContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import SearchOverlay from "./components/layout/SearchOverlay";
import AdminPanel from "./components/admin/AdminPanel";
import AdBanner from "./components/ads/AdBanner";
import GDPRBanner from "./components/common/GDPRBanner";
import HomePage from "./pages/HomePage";
import "./styles/App.css";

function AppContent() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <div className="app">
      <Header
        onSearchClick={() => setSearchOpen(true)}
        adBanner={<AdBanner type="top" />}
      />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/article/:slug" element={<HomePage />} />
        <Route path="/video/:slug" element={<HomePage />} />
        <Route path="/audio/:slug" element={<HomePage />} />
      </Routes>

      <Footer />

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <AdminPanel isOpen={adminOpen} onClose={() => setAdminOpen(false)} />

      <button
        className="admin-toggle"
        onClick={() => setAdminOpen(true)}
        title="Administration"
      >
        <Settings size={24} />
      </button>

      <GDPRBanner />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ContentProvider>
        <AppContent />
      </ContentProvider>
    </BrowserRouter>
  );
}

export default App;
