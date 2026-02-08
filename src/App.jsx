import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { ContentProvider } from "./context/ContentContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import SearchOverlay from "./components/layout/SearchOverlay";
import PartnerStrip from "./components/partners/PartnerStrip";
import GDPRBanner from "./components/common/GDPRBanner";
import HomePage from "./pages/HomePage";
import PreviewPage from "./pages/PreviewPage";
import "./styles/App.css";

function AppContent() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="app">
      <Header
        onSearchClick={() => setSearchOpen(true)}
        adBanner={<PartnerStrip type="top" />}
      />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/article/:slug" element={<HomePage />} />
        <Route path="/video/:slug" element={<HomePage />} />
        <Route path="/audio/:slug" element={<HomePage />} />
      </Routes>

      <Footer />

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <GDPRBanner />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ContentProvider>
          <Routes>
            <Route path="/preview" element={<PreviewPage />} />
            {/* French (default, no prefix) */}
            <Route path="/*" element={<AppContent />} />
            {/* English and Kreyòl (with prefix) */}
            <Route path="/en/*" element={<AppContent />} />
            <Route path="/ht/*" element={<AppContent />} />
          </Routes>
        </ContentProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
