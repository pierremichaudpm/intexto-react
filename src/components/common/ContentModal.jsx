import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
} from "lucide-react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import { useContent } from "../../context/ContentContext";
import cmsService from "../../services/cmsService";
import SEOHead from "../seo/SEOHead";
import StructuredData from "../seo/StructuredData";
import Header from "../layout/Header";
import ResponsiveImage from "./ResponsiveImage";
import { getCategoryColor, getCategoryLabel } from "../../config/categories";

const ContentModal = ({ content, isOpen, onClose, onContentChange }) => {
  const { content: allContent } = useContent();
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const playerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll to top when content changes
  useEffect(() => {
    if (content && isOpen) {
      // Use querySelector to find modal-content and scroll it
      const modalContent = document.querySelector(".modal-content");
      if (modalContent) {
        modalContent.scrollTop = 0;
      }
    }
  }, [content, isOpen]);

  // Initialize Plyr when modal opens with media
  useEffect(() => {
    if (!isOpen || !content) {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      return;
    }

    if (content.type === "video" && videoRef.current && content.videoUrl) {
      playerRef.current = new Plyr(videoRef.current, {
        controls: [
          "play-large",
          "play",
          "progress",
          "current-time",
          "mute",
          "volume",
          "settings",
          "fullscreen",
        ],
      });
    } else if (
      content.type === "audio" &&
      audioRef.current &&
      content.audioUrl
    ) {
      playerRef.current = new Plyr(audioRef.current, {
        controls: ["play", "progress", "current-time", "mute", "volume"],
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [isOpen, content]);

  if (!content) return null;

  const {
    type,
    title,
    category,
    image,
    imageFallback,
    excerpt,
    author,
    date,
    videoUrl,
    audioUrl,
  } = content;

  // Use videoUrl or audioUrl depending on content type
  const mediaUrl =
    type === "video" ? videoUrl : type === "audio" ? audioUrl : null;

  // Get suggested stories - last 5 by date, excluding current item
  const getRelatedStories = () => {
    return allContent
      .filter((item) => item.id !== content.id) // Exclude current item
      .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date, newest first
      .slice(0, 5); // Take last 5
  };

  const relatedStories = getRelatedStories();

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Social sharing functions
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = title;

  const handleShare = (platform) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);

    const shareLinks = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    };

    if (shareLinks[platform]) {
      window.open(shareLinks[platform], "_blank", "width=600,height=400");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <SEOHead
            title={`${title} | Intexto`}
            description={excerpt}
            image={image}
            type={type === "article" ? "article" : "website"}
            author={author}
            publishedTime={date}
          />
          <StructuredData content={content} />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={handleOverlayClick}
          >
            {isMobile && (
              <div className="modal-header-wrapper">
                <Header hideSearch={true} />
              </div>
            )}

            {/* Close button - always render, CSS handles visibility */}
            <button
              className="modal-close modal-close-mobile"
              onClick={onClose}
            >
              <X size={24} />
            </button>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="modal-content"
            >
              <button
                className="modal-close modal-close-desktop"
                onClick={onClose}
              >
                <X size={24} />
              </button>

              {/* Show video/audio player instead of image for media content */}
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
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw"
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
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw"
                  loading="eager"
                />
              )}

              <div className="modal-body">
                <span
                  className="content-card-category"
                  style={{ backgroundColor: getCategoryColor(category) }}
                >
                  {getCategoryLabel(category)}
                </span>

                <h1 className="modal-title">{title}</h1>

                <div className="modal-meta">
                  <span>
                    <strong>{author}</strong>
                  </span>
                  <span>{cmsService.formatDate(date)}</span>
                </div>

                {/* Social Sharing Buttons */}
                <div className="modal-share">
                  <div className="modal-share-label">
                    <Share2 size={16} />
                    <span>Partager:</span>
                  </div>
                  <div className="modal-share-buttons">
                    <button
                      className="modal-share-btn facebook"
                      onClick={() => handleShare("facebook")}
                      title="Partager sur Facebook"
                    >
                      <Facebook size={18} />
                    </button>
                    <button
                      className="modal-share-btn twitter"
                      onClick={() => handleShare("twitter")}
                      title="Partager sur Twitter"
                    >
                      <Twitter size={18} />
                    </button>
                    <button
                      className="modal-share-btn linkedin"
                      onClick={() => handleShare("linkedin")}
                      title="Partager sur LinkedIn"
                    >
                      <Linkedin size={18} />
                    </button>
                    <button
                      className="modal-share-btn whatsapp"
                      onClick={() => handleShare("whatsapp")}
                      title="Partager sur WhatsApp"
                    >
                      <MessageCircle size={18} />
                    </button>
                  </div>
                </div>

                <div className="modal-text">{content.content}</div>

                {/* Related Stories */}
                {relatedStories.length > 0 && (
                  <div className="modal-related">
                    <h3 className="modal-related-title">Contenus suggérés</h3>
                    <div className="modal-related-grid">
                      {relatedStories.map((story) => (
                        <div
                          key={story.id}
                          className={`modal-related-item ${story.type === "video" || story.type === "audio" ? "modal-related-item-media" : ""}`}
                          data-type={story.type}
                          onClick={() => {
                            if (onContentChange) {
                              onContentChange(story);
                            }
                          }}
                        >
                          <div className="modal-related-image-wrapper">
                            <ResponsiveImage
                              image={story.image}
                              fallbackUrl={story.imageFallback}
                              alt={story.title}
                              className="modal-related-image"
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              loading="lazy"
                            />
                            {story.type === "video" && (
                              <div className="modal-related-media-badge">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                              </div>
                            )}
                            {story.type === "audio" && (
                              <div className="modal-related-media-badge">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="modal-related-content">
                            <span
                              className="modal-related-category"
                              style={{
                                backgroundColor: getCategoryColor(
                                  story.category,
                                ),
                              }}
                            >
                              {getCategoryLabel(story.category)}
                            </span>
                            <h4 className="modal-related-title-text">
                              {story.title}
                            </h4>
                            <p className="modal-related-meta">{story.author}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContentModal;
