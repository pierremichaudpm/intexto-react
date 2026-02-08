import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ContentModal from "../components/common/ContentModal";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

const PreviewPage = () => {
  const { t } = useTranslation();
  const [item, setItem] = useState(null);
  const [type, setType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const contentType = params.get("type");
    const documentId = params.get("documentId");

    if (!contentType || !documentId) {
      setError(t("preview.error.missing"));
      setLoading(false);
      return;
    }

    const typeMap = {
      articles: "article",
      videos: "video",
      audios: "audio",
    };

    const fetchPreview = async () => {
      try {
        const res = await fetch(
          `${STRAPI_URL}/api/${contentType}/${documentId}?populate=cover,category&status=draft`,
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        setItem(json.data);
        setType(typeMap[contentType] || "article");
      } catch (err) {
        console.error("Preview fetch error:", err);
        setError(t("preview.error.loadFailed"));
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          color: "#ef4444",
        }}
      >
        <p>{error}</p>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <div
        style={{
          background: "#f59e0b",
          color: "#000",
          padding: "8px 16px",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        {t("preview.banner")}
      </div>
      <ContentModal
        item={item}
        type={type}
        isOpen={true}
        onClose={() => window.close()}
      />
    </div>
  );
};

export default PreviewPage;
