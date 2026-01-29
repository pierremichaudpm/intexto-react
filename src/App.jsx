import { useState } from "react";
import { Settings } from "lucide-react";
import { ContentProvider } from "./context/ContentContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import SearchOverlay from "./components/layout/SearchOverlay";
import AdminPanel from "./components/admin/AdminPanel";
import HomePage from "./pages/HomePage";
import "./styles/App.css";

function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <ContentProvider>
      <div className="app">
        <Header onSearchClick={() => setSearchOpen(true)} />

        <HomePage />

        <Footer />

        <SearchOverlay
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
        />

        <AdminPanel isOpen={adminOpen} onClose={() => setAdminOpen(false)} />

        <button
          className="admin-toggle"
          onClick={() => setAdminOpen(true)}
          title="Administration"
        >
          <Settings size={24} />
        </button>
      </div>
    </ContentProvider>
  );
}

export default App;
