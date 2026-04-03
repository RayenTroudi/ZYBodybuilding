'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/translations';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { lang } = useLanguage();
  const t = translations[lang];

  const images = [
    { src: '/images/stronger.jpg', alt: 'Hero Image 1' },
    { src: '/images/zy.jpg', alt: 'Hero Image 2' },
    { src: '/images/2.jpg', alt: 'Hero Image 3' },
  ];

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, images.length]);

  const goToSlide = (index) => setCurrentSlide(index);
  const slideNum = String(currentSlide + 1).padStart(2, '0');
  const totalNum = String(images.length).padStart(2, '0');

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden bg-[#080808]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background images */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          >
            <Image
              src={images[currentSlide].src}
              alt={images[currentSlide].alt}
              fill
              style={{ objectFit: 'cover' }}
              priority
              quality={90}
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient layers — bottom-heavy + left-heavy for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/70 to-[#080808]/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/85 via-[#080808]/30 to-transparent" />

        {/* Noise grain overlay for depth */}
        <div className="noise-overlay" style={{ zIndex: 3 }} />

        {/* Scanline sweep */}
        <motion.div
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            height: '1px',
            zIndex: 4,
            background: 'linear-gradient(90deg, transparent 0%, rgba(204,19,3,0.5) 25%, rgba(204,19,3,0.85) 50%, rgba(204,19,3,0.5) 75%, transparent 100%)',
          }}
          animate={{ y: ['0vh', '100vh'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-20 flex flex-col justify-center flex-1 px-6 sm:px-10 lg:px-20 pt-32 pb-36">
        <div className="max-w-5xl">

          {/* Label */}
          <motion.div
            className="flex items-center gap-3 mb-7"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-8 h-[2px] bg-primary flex-shrink-0" />
            <span
              className="text-primary text-[10px] sm:text-xs font-semibold uppercase"
              style={{ letterSpacing: '0.25em', fontFamily: "'DM Sans', sans-serif" }}
            >
              {t.hero.label}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="font-black uppercase text-white mb-6"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: '-0.02em',
              lineHeight: '0.88',
              fontSize: 'clamp(4rem, 13vw, 9.5rem)',
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          >
            {t.hero.title.line1}<br />
            <span className="text-primary">{t.hero.title.line2}</span><br />
            {t.hero.title.line3}
          </motion.h1>

          {/* Animated red line */}
          <motion.div
            className="bg-primary mb-7"
            style={{ width: '56px', height: '3px', transformOrigin: 'left' }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.75 }}
          />

          {/* Subtitle */}
          <motion.p
            className="text-neutral-400 text-base sm:text-lg max-w-sm leading-relaxed mb-10"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.85 }}
          >
            {t.hero.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <a href="#join" className="btn-primary px-10 py-4 text-sm inline-block">
              {t.hero.joinUs}
            </a>
            <a
              href="#about"
              className="inline-flex items-center gap-2 text-white/60 text-sm font-semibold uppercase hover:text-white transition-colors duration-200"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.12em' }}
            >
              {t.hero.learnMore}
              <svg width="18" height="8" viewBox="0 0 18 8" fill="none">
                <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom stats + navigation bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-primary/25 bg-black/65 backdrop-blur-md glow-red-subtle">
        <div className="flex items-stretch">

          {/* Slide dots */}
          <div className="flex items-center justify-center gap-2 px-4 sm:px-6">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentSlide === index
                    ? 'bg-primary'
                    : 'bg-white/25 hover:bg-white/50'
                }`}
                style={{
                  width: currentSlide === index ? '24px' : '7px',
                  height: '7px',
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Slide counter */}
          <div className="flex items-center px-4 sm:px-6 border-l border-white/10">
            <span
              className="text-sm font-bold text-white"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {slideNum}
              <span className="text-neutral-600 font-normal">/{totalNum}</span>
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
