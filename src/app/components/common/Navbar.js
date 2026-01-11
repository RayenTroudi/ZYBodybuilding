'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Prevent body scroll when menu is open on mobile
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  };

  const handleScroll = () => {
    if (typeof window !== 'undefined' && window.scrollY > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
        document.body.style.overflow = 'unset';
      };
    }
  }, []);

  // Prevent hydration mismatch by not rendering scroll-dependent styles until mounted
  if (!mounted) {
    return (
      <nav className="absolute top-0 left-0 w-full z-50">
        <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <Image 
              src="/images/logoNobg.png" 
              alt="ZY Bodybuilding Logo" 
              width={40} 
              height={40}
              className="object-contain sm:w-[50px] sm:h-[50px]"
            />
            <span className="text-base sm:text-xl font-bold text-gradient tracking-widest">
              ZY BODYBUILDING
            </span>
          </Link>
          {/* Improved Hamburger Menu Icon */}
          <button 
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none focus:ring-2 focus:ring-primary rounded-md transition-all" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className="block h-0.5 w-6 bg-white transition-all duration-300"></span>
            <span className="block h-0.5 w-6 bg-white mt-1.5 transition-all duration-300"></span>
            <span className="block h-0.5 w-6 bg-white mt-1.5 transition-all duration-300"></span>
          </button>
          <div className="hidden lg:flex lg:items-center lg:space-x-6 text-white font-medium">
            <Link href="/" className="block py-2 px-4 hover:text-primary transition-colors">
              Accueil
            </Link>
            <Link href="#about" className="block py-2 px-4 hover:text-primary transition-colors">
              A propos
            </Link>
            <Link href="#schedule" className="block py-2 px-4 hover:text-primary transition-colors">
              Programme
            </Link>
            <Link href="#pricing" className="block py-2 px-4 hover:text-primary transition-colors">
              Tarifs
            </Link>
            <Link href="#contact" className="block py-2 px-4 hover:text-primary transition-colors">
              Contact
            </Link>
            
            <div className="flex flex-row gap-3 ml-4">
              <Link 
                href="/login" 
                className="px-4 py-2 text-white hover:text-primary transition-colors text-center border border-neutral-700 rounded hover:border-primary"
              >
                Connexion
              </Link>
              <Link 
                href="/admin/login" 
                className="btn-primary text-center"
              >
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

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
          <span className="text-base sm:text-xl font-bold text-gradient tracking-widest">
            ZY BODYBUILDING
          </span>
        </Link>

        {/* Enhanced Hamburger Menu Icon with Animation */}
        <button
          className="lg:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none focus:ring-2 focus:ring-primary rounded-md transition-all relative z-50"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-white mt-1.5 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-white mt-1.5 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

        {/* Mobile Menu Overlay - Dark backdrop for better focus */}
        {isOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300"
            onClick={closeMenu}
            aria-hidden="true"
          />
        )}

        {/* Mobile Menu - Solid Background Drawer */}
        <div
          className={`${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          } lg:hidden fixed top-0 right-0 w-full h-screen bg-black transition-all duration-300 ease-in-out flex flex-col justify-center items-center space-y-6 text-white text-center z-40 shadow-2xl`}
        >
          <Link href="/" className="text-2xl py-3 px-6 hover:text-primary transition-colors transform hover:scale-110 duration-200" onClick={closeMenu}>
            Accueil
          </Link>
          <Link href="#about" className="text-2xl py-3 px-6 hover:text-primary transition-colors transform hover:scale-110 duration-200" onClick={closeMenu}>
            A propos
          </Link>
          <Link href="#schedule" className="text-2xl py-3 px-6 hover:text-primary transition-colors transform hover:scale-110 duration-200" onClick={closeMenu}>
            Programme
          </Link>
          <Link href="#pricing" className="text-2xl py-3 px-6 hover:text-primary transition-colors transform hover:scale-110 duration-200" onClick={closeMenu}>
            Tarifs
          </Link>
          <Link href="#contact" className="text-2xl py-3 px-6 hover:text-primary transition-colors transform hover:scale-110 duration-200" onClick={closeMenu}>
            Contact
          </Link>
          
          {/* Auth Buttons in Mobile Menu */}
          <div className="flex flex-col gap-4 mt-8 w-64">
            <Link 
              href="/login" 
              className="px-6 py-3 text-lg text-white hover:text-primary transition-colors text-center border-2 border-neutral-700 rounded-lg hover:border-primary transform hover:scale-105 duration-200"
              onClick={closeMenu}
            >
              Connexion
            </Link>
            <Link 
              href="/register" 
              className="btn-primary text-lg text-center transform hover:scale-105 duration-200"
              onClick={closeMenu}
            >
              S'inscrire
            </Link>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex lg:items-center lg:space-x-6 text-white font-medium">
          <Link href="/" className="block py-2 px-4 hover:text-primary transition-colors">
            Accueil
          </Link>
          <Link href="#about" className="block py-2 px-4 hover:text-primary transition-colors">
            A propos
          </Link>
          <Link href="#schedule" className="block py-2 px-4 hover:text-primary transition-colors">
            Programme
          </Link>
          <Link href="#pricing" className="block py-2 px-4 hover:text-primary transition-colors">
            Tarifs
          </Link>
          <Link href="#contact" className="block py-2 px-4 hover:text-primary transition-colors">
            Contact
          </Link>
          
          {/* Auth Buttons */}
          <div className="flex flex-row gap-3 ml-4">
            <Link 
              href="/login" 
              className="px-4 py-2 text-white hover:text-primary transition-colors text-center border border-neutral-700 rounded hover:border-primary"
            >
              Connexion
            </Link>
            <Link 
              href="/register" 
              className="btn-primary text-center"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
