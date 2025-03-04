
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import translationEN from './translations/en.json';
import translationFR from './translations/fr.json';
import translationES from './translations/es.json';
import translationDE from './translations/de.json';
import translationAR from './translations/ar.json';
import translationIT from './translations/it.json';
import translationPT from './translations/pt.json';
import translationRU from './translations/ru.json';
import translationZH from './translations/zh.json';
import translationJA from './translations/ja.json';

// Translation resources
const resources = {
  en: {
    translation: translationEN
  },
  fr: {
    translation: translationFR
  },
  es: {
    translation: translationES
  },
  de: {
    translation: translationDE
  },
  ar: {
    translation: translationAR
  },
  it: {
    translation: translationIT
  },
  pt: {
    translation: translationPT
  },
  ru: {
    translation: translationRU
  },
  zh: {
    translation: translationZH
  },
  ja: {
    translation: translationJA
  }
};

i18n
  // Detect browser language
  .use(LanguageDetector)
  // Pass i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false, // not needed for React
    },
    detection: {
      order: ['navigator', 'htmlTag', 'path', 'localStorage'],
      caches: ['localStorage'],
    }
  });

export default i18n;
