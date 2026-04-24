'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  // Always start with 'fr' so server and client initial render match,
  // then sync from localStorage after hydration in useEffect.
  const [lang, setLangState] = useState('fr');

  useEffect(() => {
    const saved = localStorage.getItem('lang');
    if (saved === 'en' || saved === 'fr') {
      setLangState(saved);
    }
  }, []);

  const setLang = (l) => {
    setLangState(l);
    localStorage.setItem('lang', l);
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
