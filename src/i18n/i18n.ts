
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import des traductions
import translationEN from './translations/en.json';
import translationFR from './translations/fr.json';
import translationES from './translations/es.json';
import translationDE from './translations/de.json';

// Les ressources de traduction
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
  }
};

i18n
  // Détecte la langue du navigateur
  .use(LanguageDetector)
  // Passe l'instance i18n à react-i18next
  .use(initReactI18next)
  // Initialise i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false, // non nécessaire pour React
    },
    detection: {
      order: ['navigator', 'htmlTag', 'path', 'localStorage'],
      caches: ['localStorage'],
    }
  });

export default i18n;
