'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '#about', label: 'À propos' },
  { href: '#schedule', label: 'Programme' },
  { href: '#pricing', label: 'Tarifs' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check');
        const data = await res.json();
        if (data.success && data.user) setUser(data.user);
      } catch {}
      finally { setLoadingAuth(false); }
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
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = 'unset';
    };
  }, []);

  const navClass = mounted
    ? isScrolled
      ? 'fixed top-0 left-0 w-full z-50 bg-[#080808]/97 backdrop-blur-md border-b border-primary/20 glow-red-subtle'
      : 'absolute top-0 left-0 w-full z-50'
    : 'absolute top-0 left-0 w-full z-50';

  return (
    <nav className={`${navClass} transition-all duration-300`}>
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-10 py-4 sm:py-5">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 relative z-50">
          <Image
            src="/images/logoNobg.png"
            alt="ZY Bodybuilding Logo"
            width={34}
            height={34}
            className="object-contain"
          />
          <span
            className="text-white font-black uppercase text-base sm:text-lg"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.08em' }}
          >
            ZY <span className="text-primary">Bodybuilding</span>
          </span>
        </Link>

        {/* Hamburger */}
        <button
          className="lg:hidden relative z-50 flex flex-col justify-center items-center w-10 h-10 gap-[6px] focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span className={`block h-[2px] w-6 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-[2px] w-6 bg-white transition-all duration-300 ${isOpen ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block h-[2px] w-6 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>

        {/* Backdrop */}
        {mounted && isOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/75 backdrop-blur-sm z-30"
            onClick={closeMenu}
          />
        )}

        {/* Mobile drawer */}
        <div
          className={`${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          } lg:hidden fixed top-0 right-0 w-full h-screen bg-[#080808] transition-transform duration-300 ease-in-out flex flex-col justify-center items-center z-40`}
        >
          {/* Top red bar */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary" />

          <div className="flex flex-col items-center gap-1 mb-8">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-2xl sm:text-3xl py-3 px-8 text-neutral-400 hover:text-white transition-colors uppercase font-black"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.06em' }}
                onClick={closeMenu}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3 w-52">
            {user ? (
              <>
                <Link href="/dashboard" className="btn-secondary py-3 text-center" onClick={closeMenu}>
                  Mon Espace
                </Link>
                <button
                  onClick={async () => {
                    await fetch('/api/auth/logout', { method: 'POST' });
                    setUser(null);
                    closeMenu();
                    router.push('/');
                    router.refresh();
                  }}
                  className="py-3 text-sm text-neutral-600 hover:text-white uppercase tracking-widest transition-colors"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-outline py-3 text-center" onClick={closeMenu}>
                  Connexion
                </Link>
                <Link href="/register" className="btn-primary py-3 text-center" onClick={closeMenu}>
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-0">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="relative px-4 py-2 text-neutral-400 hover:text-white text-xs font-semibold uppercase tracking-widest transition-colors duration-200 group"
              style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.12em' }}
            >
              {label}
              <span className="absolute bottom-0 left-4 right-4 h-[1px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
            </Link>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden lg:flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="btn-secondary py-2 text-xs"
              >
                Mon Espace
              </Link>
              <button
                onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST' });
                  setUser(null);
                  router.push('/');
                  router.refresh();
                }}
                className="px-4 py-2 text-neutral-600 hover:text-white text-xs uppercase tracking-widest transition-colors"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-5 py-2 text-neutral-400 hover:text-white text-xs font-semibold uppercase tracking-widest transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Connexion
              </Link>
              <Link href="/register" className="btn-primary py-2 text-xs">
                S&apos;inscrire
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
