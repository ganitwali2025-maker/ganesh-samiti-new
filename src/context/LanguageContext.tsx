import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '../locales/en';
import { hi } from '../locales/hi';

export type LocaleType = 'en' | 'hi';
export type TranslationsType = typeof en;

interface LanguageContextType {
  locale: LocaleType;
  setLocale: (locale: LocaleType) => void;
  t: (key: keyof TranslationsType) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<LocaleType>(() => {
    const saved = localStorage.getItem('app_language');
    return (saved as LocaleType) || 'hi'; // Default to Hindi
  });

  useEffect(() => {
    localStorage.setItem('app_language', locale);
  }, [locale]);

  const t = (key: keyof TranslationsType): string => {
    const translations = locale === 'en' ? en : hi;
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
