'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const OPEN_HOUR = 6;
const CLOSE_HOUR = 23;

const copy = {
  fr: {
    open: 'Ouvert',
    closed: 'Fermé',
    days: '7J/7',
    hours: '06:00 — 23:00',
    closingSoon: (h) => `Ferme dans ${h}`,
  },
  en: {
    open: 'Open',
    closed: 'Closed',
    days: '7/7',
    hours: '6AM — 11PM',
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
  const statusColor = isOpen ? '#22C55E' : '#EF4444';

  return (
    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 sm:px-5 sm:py-2">
      <span className="relative flex h-2 w-2">
        {isOpen && (
          <motion.span
            className="absolute inline-flex h-full w-full rounded-full"
            style={{ backgroundColor: statusColor }}
            animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <span
          className="relative inline-flex rounded-full h-2 w-2"
          style={{ backgroundColor: statusColor }}
        />
      </span>
      <span
        className="text-xs sm:text-sm font-bold uppercase tracking-[0.15em]"
        style={{ fontFamily: "'Barlow Condensed', sans-serif", color: statusColor }}
        suppressHydrationWarning
      >
        {isOpen ? t.open : t.closed}
      </span>
      {showClosingSoon ? (
        <span className="text-white/50 text-xs font-medium normal-case">
          · {t.closingSoon(`${Math.max(0, Math.round(status.hoursLeft * 60))}min`)}
        </span>
      ) : (
        <>
          <span className="w-px h-3 bg-white/15" />
          <span className="text-white/60 text-xs sm:text-sm font-semibold tracking-wide">
            {t.days}
          </span>
          <span className="w-px h-3 bg-white/15" />
          <span className="text-white/60 text-xs sm:text-sm font-semibold tabular-nums tracking-wide">
            {t.hours}
          </span>
        </>
      )}
    </div>
  );
};

export default OpenStatus;
