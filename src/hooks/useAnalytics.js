import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const GA_ID = "G-ZYEESY9GMF";

function gtag() {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(arguments);
}

/**
 * Sync GA4 consent state with the GDPR banner stored in localStorage.
 * Called once on mount and again whenever the GDPR banner sets a value.
 */
function syncConsent() {
  const consent = localStorage.getItem("gdpr-consent");
  if (consent === "accepted") {
    gtag("consent", "update", { analytics_storage: "granted" });
  }
}

/**
 * Hook that:
 * 1. Grants/denies analytics based on GDPR consent
 * 2. Sends a page_view on every route change (SPA navigation)
 */
export default function useAnalytics() {
  const location = useLocation();

  // On mount: sync consent and listen for storage changes (e.g. banner click)
  useEffect(() => {
    syncConsent();

    // Listen for consent changes from the GDPR banner (same tab)
    const onStorage = () => syncConsent();
    window.addEventListener("storage", onStorage);

    // Also poll briefly to catch same-tab localStorage writes from the banner
    const interval = setInterval(syncConsent, 2000);
    const timeout = setTimeout(() => clearInterval(interval), 30000);

    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // Send page_view on every route change
  useEffect(() => {
    gtag("event", "page_view", {
      page_path: location.pathname + location.search,
      page_title: document.title,
    });
  }, [location]);
}
