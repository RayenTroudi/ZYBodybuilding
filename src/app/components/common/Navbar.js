'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/translations';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check');
        const data = await res.json();
        if (data.success && data.user) setUser(data.user);
      } catch {}
    };
    checkAuth();
  }, []);

  const toggleMenu = () => {
    const next = !isOpen;
    setIsOpen(next);
    document.body.style.overflow = next ? 'hidden' : 'unset';
  };

  const closeMenu = () => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <nav
      className={`${
        isScrolled ? 'fixed top-0 left-0 w-full z-50 bg-dark/95 backdrop-blur-md border-b border-primary/20' : 'absolute top-0 left-0 w-full z-50'
      } transition-all duration-300`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 relative z-50">
          <Image
            src="/images/logoNobg.png"
            alt="ZY Bodybuilding Logo"
            width={40}
            height={40}
            className="object-contain sm:w-[50px] sm:h-[50px]"
          />
          <span className="text-base sm:text-xl font-bold text-primary tracking-tight">
            ZY BODYBUILDING
          </span>
        </Link>

        {/* Enhanced Hamburger Menu Icon with Animation */}
        <button
          className="lg:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none focus:ring-2 focus:ring-primary rounded-md transition-all relative z-50"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isOpen ? 'true' : 'false'}
        >
          <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-white mt-1.5 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-white mt-1.5 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300"
            onClick={closeMenu}
            aria-hidden="true"
          />
        )}

        {/* Mobile Menu Drawer */}
        <div
          className={`${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          } lg:hidden fixed top-0 right-0 w-full h-screen bg-black transition-all duration-300 ease-in-out flex flex-col justify-center items-center space-y-6 text-white text-center z-40 shadow-2xl`}
        >
          <Link href="/" className="text-2xl py-3 px-6 hover:text-primary transition-colors transform hover:scale-110 duration-200" onClick={closeMenu}>
            {t.publicNav.home}
          </Link>
          <Link href="#about" className="text-2xl py-3 px-6 hover:text-primary transition-colors transform hover:scale-110 duration-200" onClick={closeMenu}>
            {t.publicNav.about}
          </Link>
          <Link href="#schedule" className="text-2xl py-3 px-6 hover:text-primary transition-colors transform hover:scale-110 duration-200" onClick={closeMenu}>
            {t.publicNav.schedule}
          </Link>
          <Link href="#pricing" className="text-2xl py-3 px-6 hover:text-primary transition-colors transform hover:scale-110 duration-200" onClick={closeMenu}>
            {t.publicNav.pricing}
          </Link>
          <Link href="#contact" className="text-2xl py-3 px-6 hover:text-primary transition-colors transform hover:scale-110 duration-200" onClick={closeMenu}>
            {t.publicNav.contact}
          </Link>

          {/* Mobile language switcher */}
          <div className="flex items-center gap-1 bg-neutral-800 border border-neutral-700 rounded-lg p-1">
            <button
              onClick={() => setLang('fr')}
              className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${lang === 'fr' ? 'bg-primary text-white' : 'text-neutral-400 hover:text-white'}`}
            >
              FR
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${lang === 'en' ? 'bg-primary text-white' : 'text-neutral-400 hover:text-white'}`}
            >
              EN
            </button>
          </div>

          {/* Auth Buttons in Mobile Menu */}
          <div className="flex flex-col gap-4 mt-4 w-64">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-6 py-3 text-lg text-white hover:text-primary transition-colors text-center border-2 border-primary rounded-lg transform hover:scale-105 duration-200"
                  onClick={closeMenu}
                >
                  {t.publicNav.mySpace}
                </Link>
                <button
                  onClick={async () => {
                    await fetch('/api/auth/logout', { method: 'POST' });
                    setUser(null);
                    closeMenu();
                    router.push('/');
                    router.refresh();
                  }}
                  className="px-6 py-3 text-lg text-white hover:text-red-400 transition-colors text-center border-2 border-neutral-700 rounded-lg hover:border-red-400 transform hover:scale-105 duration-200"
                >
                  {t.publicNav.logout}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-6 py-3 text-lg text-white hover:text-primary transition-colors text-center border-2 border-neutral-700 rounded-lg hover:border-primary transform hover:scale-105 duration-200"
                  onClick={closeMenu}
                >
                  {t.publicNav.login}
                </Link>
                <Link
                  href="/register"
                  className="btn-primary text-lg text-center transform hover:scale-105 duration-200"
                  onClick={closeMenu}
                >
                  {t.publicNav.register}
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex lg:items-center lg:space-x-6 text-white font-medium">
          <Link href="/" className="block py-2 px-4 hover:text-primary transition-colors">{t.publicNav.home}</Link>
          <Link href="#about" className="block py-2 px-4 hover:text-primary transition-colors">{t.publicNav.about}</Link>
          <Link href="#schedule" className="block py-2 px-4 hover:text-primary transition-colors">{t.publicNav.schedule}</Link>
          <Link href="#pricing" className="block py-2 px-4 hover:text-primary transition-colors">{t.publicNav.pricing}</Link>
          <Link href="#contact" className="block py-2 px-4 hover:text-primary transition-colors">{t.publicNav.contact}</Link>

          {/* Desktop language switcher */}
          <div className="flex items-center gap-1 bg-neutral-800 border border-neutral-700 rounded-lg p-1 ml-2">
            <button
              onClick={() => setLang('fr')}
              className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${lang === 'fr' ? 'bg-primary text-white' : 'text-neutral-400 hover:text-white'}`}
            >
              FR
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${lang === 'en' ? 'bg-primary text-white' : 'text-neutral-400 hover:text-white'}`}
            >
              EN
            </button>
          </div>

          {/* Auth Buttons */}
          <div className="flex flex-row gap-3 ml-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-white hover:text-primary transition-colors text-center border border-primary rounded hover:bg-primary/10"
                >
                  {t.publicNav.mySpace}
                </Link>
                <button
                  onClick={async () => {
                    await fetch('/api/auth/logout', { method: 'POST' });
                    setUser(null);
                    router.push('/');
                    router.refresh();
                  }}
                  className="px-4 py-2 text-white hover:text-red-400 transition-colors text-center border border-neutral-700 rounded hover:border-red-400"
                >
                  {t.publicNav.logout}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-white hover:text-primary transition-colors text-center border border-neutral-700 rounded hover:border-primary"
                >
                  {t.publicNav.login}
                </Link>
                <Link
                  href="/register"
                  className="btn-primary text-center"
                >
                  {t.publicNav.register}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
