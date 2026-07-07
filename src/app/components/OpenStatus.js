'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const OPEN_HOUR = 6;
const CLOSE_HOUR = 22;

const copy = {
  fr: {
    open: 'Ouvert',
    closed: 'Fermé',
    days: '7J / 7',
    hours: '06:00 — 22:00',
    closingSoon: (h) => `Ferme dans ${h}`,
  },
  en: {
    open: 'Open',
    closed: 'Closed',
    days: '7 Days / Week',
    hours: '6AM — 10PM',
    closingSoon: (h) => `Closes in ${h}`,
  },
};

function getStatus() {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  const isOpen = hour >= OPEN_HOUR && hour < CLOSE_HOUR;
  const hoursLeft = CLOSE_HOUR - hour;
  return { isOpen, hoursLeft };
}

const OpenStatus = () => {
  const { lang } = useLanguage();
  const t = copy[lang] || copy.fr;
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setStatus(getStatus());
    const interval = setInterval(() => setStatus(getStatus()), 60000);
    return () => clearInterval(interval);
  }, []);

  const isOpen = status?.isOpen ?? true;
  const showClosingSoon = status?.isOpen && status.hoursLeft <= 1;

  return (
    <section className="bg-[#111111] border-y border-[#1e1e1e] relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-between gap-3 sm:gap-6">

          {/* Live status */}
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              {isOpen && (
                <motion.span
                  className="absolute inline-flex h-full w-full rounded-full bg-primary"
                  animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isOpen ? 'bg-primary' : 'bg-neutral-600'
                }`}
              />
            </span>
            <span
              className="text-sm sm:text-base font-bold uppercase tracking-[0.15em]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              suppressHydrationWarning
            >
              {isOpen ? t.open : t.closed}
              {showClosingSoon && (
                <span className="text-neutral-500 font-medium normal-case tracking-normal">
                  {' '}· {t.closingSoon(`${Math.max(0, Math.round(status.hoursLeft * 60))}min`)}
                </span>
              )}
            </span>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-6 bg-[#242424]" />

          {/* Hours */}
          <div className="flex items-center gap-3 sm:gap-4 text-neutral-400">
            <span
              className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-primary"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {t.days}
            </span>
            <span className="text-neutral-700">/</span>
            <span
              className="text-base sm:text-lg font-bold tabular-nums"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {t.hours}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OpenStatus;
