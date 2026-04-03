'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

function getInitialLanguage() {
  // During SSR, localStorage is not available
  if (typeof window === 'undefined') return 'fr';

  // On client, read from localStorage
  const saved = localStorage.getItem('lang');
  return (saved === 'en' || saved === 'fr') ? saved : 'fr';
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLanguage);

  const setLang = (l) => {
    setLangState(l);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', l);
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
