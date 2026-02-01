import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ContentProvider } from "./context/ContentContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import SearchOverlay from "./components/layout/SearchOverlay";
import AdBanner from "./components/ads/AdBanner";
import GDPRBanner from "./components/common/GDPRBanner";
import HomePage from "./pages/HomePage";
import "./styles/App.css";

function AppContent() {
  const [searchOpen, setSearchOpen] = useState(false);

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
