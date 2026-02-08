import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  DEFAULT_LOCALE,
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

  // Derive locale from URL on mount and on URL change
  const [locale, setLocaleState] = useState(() => {
    return getLocaleFromPath(location.pathname);
  });

  // Sync locale with URL when location changes
  useEffect(() => {
    const urlLocale = getLocaleFromPath(location.pathname);
    if (urlLocale !== locale) {
      setLocaleState(urlLocale);
      i18n.changeLanguage(urlLocale);
    }
  }, [location.pathname]);

  // Sync i18n on initial load
  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
    localStorage.setItem("intexto-locale", locale);
  }, [locale]);

  const setLocale = useCallback(
    (newLocale) => {
      if (!SUPPORTED_LOCALES.includes(newLocale) || newLocale === locale) return;

      // Get the current path without locale prefix
      const basePath = stripLocalePath(location.pathname);
      const search = location.search;

      // Navigate to the new locale path
      const newPath = localePath(basePath, newLocale);
      navigate(newPath + search);

      setLocaleState(newLocale);
      i18n.changeLanguage(newLocale);
      localStorage.setItem("intexto-locale", newLocale);
    },
    [locale, location.pathname, location.search, navigate, i18n],
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
