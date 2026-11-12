/* eslint-disable react-refresh/only-export-components -- Context provider and its consumer hook share this module. */
import { createContext, useContext, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  SUPPORTED_LOCALES,
  getLocaleFromPath,
  localePath,
  stripLocalePath,
} from "../i18n";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const locale = getLocaleFromPath(location.pathname);

  // Sync i18n on initial load
  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
    localStorage.setItem("intexto-locale", locale);
  }, [locale, i18n]);

  const setLocale = useCallback(
    (newLocale) => {
      if (!SUPPORTED_LOCALES.includes(newLocale) || newLocale === locale) return;

      // Get the current path without locale prefix
      const basePath = stripLocalePath(location.pathname);
      const search = location.search;

      // Navigate to the new locale path
      const alternate = document.head.querySelector(`link[rel="alternate"][hreflang="${newLocale}"]`);
      // Translations have their own slugs. Never invent a translated article URL.
      const newPath = /^\/(article|video|audio)\//.test(basePath)
        ? (alternate ? new URL(alternate.href).pathname : localePath("/", newLocale))
        : localePath(basePath, newLocale);
      navigate(newPath + search);

      localStorage.setItem("intexto-locale", newLocale);
    },
    [locale, location.pathname, location.search, navigate],
  );

  // Helper to build localized paths
  const buildPath = useCallback(
    (path) => localePath(path, locale),
    [locale],
  );

  const value = {
    locale,
    setLocale,
    buildPath,
  };

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};
