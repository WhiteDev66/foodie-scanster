
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define available languages
export type Language = 'fr' | 'en' | 'es' | 'de';

// Define the context type
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'fr',
  setLanguage: () => {},
  t: (key: string) => key,
});

// Create a hook for using the language context
export const useLanguage = () => useContext(LanguageContext);

// Define props for the provider
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // State to store the current language
  const [language, setLanguage] = useState<Language>('fr');
  // State to store the translations
  const [translations, setTranslations] = useState<Record<string, string>>({});

  // Detect user's preferred language on mount
  useEffect(() => {
    const detectLanguage = async () => {
      const userLanguage = navigator.language.split('-')[0];
      // Set default to 'fr', or map to supported language
      let detectedLanguage: Language = 'fr';
      
      if (userLanguage === 'en') detectedLanguage = 'en';
      else if (userLanguage === 'es') detectedLanguage = 'es';
      else if (userLanguage === 'de') detectedLanguage = 'de';
      
      setLanguage(detectedLanguage);
    };

    detectLanguage();
  }, []);

  // Load translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translationModule = await import(`../translations/${language}.ts`);
        setTranslations(translationModule.default);
      } catch (error) {
        console.error('Failed to load translations:', error);
        // Fallback to empty translations if file not found
        setTranslations({});
      }
    };

    loadTranslations();
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
