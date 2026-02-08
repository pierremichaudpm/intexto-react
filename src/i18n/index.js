import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import fr from "./locales/fr.json";
import en from "./locales/en.json";
import ht from "./locales/ht.json";

export const SUPPORTED_LOCALES = ["fr", "en", "ht"];
export const DEFAULT_LOCALE = "fr";

export const LOCALE_LABELS = {
  fr: "FR",
  en: "EN",
  ht: "KR",
};

export const LOCALE_FULL_NAMES = {
  fr: "Français",
  en: "English",
  ht: "Kreyòl",
};

export const LOCALE_OG = {
  fr: "fr_CA",
  en: "en_CA",
  ht: "ht_HT",
};

/**
 * Detect locale from URL path.
 * /en/... → 'en', /ht/... → 'ht', anything else → 'fr'
 */
export function getLocaleFromPath(pathname) {
  const match = pathname.match(/^\/(en|ht)(\/|$)/);
  return match ? match[1] : "fr";
}

/**
 * Build a localized path.
 * For French (default), no prefix. For en/ht, add prefix.
 */
export function localePath(path, locale) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (locale === "fr") return cleanPath;
  return `/${locale}${cleanPath}`;
}

/**
 * Strip the locale prefix from a path.
 */
export function stripLocalePath(pathname) {
  return pathname.replace(/^\/(en|ht)(\/|$)/, "/");
}

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
    ht: { translation: ht },
  },
  lng: DEFAULT_LOCALE,
  fallbackLng: "fr",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
