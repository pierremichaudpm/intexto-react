import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import strapiService from "../services/strapiService";
import cmsService from "../services/cmsService";
import ResponsiveImage from "../components/common/ResponsiveImage";
import { getCategoryColor, getCategoryLabel } from "../config/categories";
import { useTranslation } from "react-i18next";

const PREVIEW_SECRET = import.meta.env.VITE_PREVIEW_SECRET;

const PreviewPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const playerRef = useRef(null);

  const type = searchParams.get("type");
  const slug = searchParams.get("slug");
  const status = searchParams.get("status");
  const secret = searchParams.get("secret");

  useEffect(() => {
    if (secret !== PREVIEW_SECRET) {
      setError(t("preview.error.unauthorized"));
      setLoading(false);
      return;
    }
    if (!type || !slug) {
      setError(t("preview.error.missing"));
      setLoading(false);
      return;
    }

    const loadPreview = async () => {
      setLoading(true);
      const data = await strapiService.fetchDraftContent(type, slug);
      if (!data) {
        setError(t("preview.error.notFound"));
      } else {
        setContent(data);
      }
      setLoading(false);
    };

    loadPreview();
  }, [type, slug, status, secret]);

  // Initialize Plyr for video/audio
  useEffect(() => {
    if (!content) return;
    const el = videoRef.current || audioRef.current;
    if (el) {
      playerRef.current = new Plyr(el, {
        controls: [
          "play",
          "progress",
          "current-time",
          "mute",
          "volume",
          "fullscreen",
        ],
      });
    }
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [content]);

  if (loading) {
    return (
      <div className="preview-page">
        <div className="preview-banner">Apercu</div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="preview-page">
        <div className="preview-banner">Apercu</div>
        <div className="loading-container">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const {
    title,
    excerpt,
    author,
    date,
    category,
    image,
    imageFallback,
    videoUrl,
    audioUrl,
  } = content;
  const mediaUrl = videoUrl || audioUrl;

  return (
    <div className="preview-page">
      <div className="preview-banner">Apercu — {status === "draft" ? t("preview.draft") : t("preview.published")}</div>

      <div className="preview-content">
        {type === "video" && mediaUrl ? (
          <div className="modal-media-player modal-media-hero">
            <video ref={videoRef} controls playsInline>
              <source src={mediaUrl} type="video/mp4" />
            </video>
          </div>
        ) : type === "audio" && mediaUrl ? (
          <>
            <ResponsiveImage
              image={image}
              fallbackUrl={imageFallback}
              alt={title}
              className="modal-image"
              sizes="90vw"
              loading="eager"
            />
            <div className="modal-media-player modal-audio-hero">
              <audio ref={audioRef} controls>
                <source src={mediaUrl} type="audio/mp3" />
              </audio>
            </div>
          </>
        ) : (
          <ResponsiveImage
            image={image}
            fallbackUrl={imageFallback}
            alt={title}
            className="modal-image"
            sizes="90vw"
            loading="eager"
          />
        )}

        <div className="modal-body">
          <span
            className="content-card-category"
            style={{ backgroundColor: getCategoryColor(category) }}
          >
            {getCategoryLabel(category, t)}
          </span>

          <h1 className="modal-title">{title}</h1>

          <div className="modal-meta">
            <span>
              <strong>{author}</strong>
            </span>
            <span>{cmsService.formatDate(date)}</span>
          </div>

          {(content.content || content.description) && (
            <div className="modal-text">
              <ReactMarkdown>
                {content.content || content.description}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
