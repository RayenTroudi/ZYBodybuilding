'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const colorMap = {
  red: {
    bg: 'from-primary/15 via-transparent',
    icon: 'bg-primary/20 text-primary',
    border: 'border-primary/20',
  },
  blue: {
    bg: 'from-blue-500/10 via-transparent',
    icon: 'bg-blue-500/20 text-blue-400',
    border: 'border-blue-500/20',
  },
  green: {
    bg: 'from-green-500/10 via-transparent',
    icon: 'bg-green-500/20 text-green-400',
    border: 'border-green-500/20',
  },
  orange: {
    bg: 'from-orange-500/10 via-transparent',
    icon: 'bg-orange-500/20 text-orange-400',
    border: 'border-orange-500/20',
  },
  purple: {
    bg: 'from-purple-500/10 via-transparent',
    icon: 'bg-purple-500/20 text-purple-400',
    border: 'border-purple-500/20',
  },
};

export default function StatCard({ icon: Icon, label, value, suffix = '', color = 'red', subtext, className = '' }) {
  const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  const isNumeric = typeof value === 'number' || (!isNaN(parseFloat(value)) && value !== '');
  const [count, setCount] = useState(0);
  const c = colorMap[color] || colorMap.red;

  useEffect(() => {
    if (!isNumeric || numValue === 0) return;
    let frame;
    const duration = 700;
    const startTime = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * numValue);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [numValue, isNumeric]);

  const displayValue = isNumeric
    ? Number.isInteger(numValue)
      ? Math.round(count)
      : count.toFixed(1)
    : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={`relative overflow-hidden bg-gradient-to-br ${c.bg} bg-white/[0.04] backdrop-blur-md border ${c.border} rounded-2xl p-5 ${className}`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.icon}`}>
        <Icon size={19} strokeWidth={2} />
      </div>
      <p className="text-2xl font-display font-bold text-white tracking-tight leading-none">
        {displayValue}{suffix}
      </p>
      <p className="text-[11px] text-neutral-400 mt-1.5 uppercase tracking-widest font-medium">{label}</p>
      {subtext && <p className="text-xs text-neutral-500 mt-0.5">{subtext}</p>}
    </motion.div>
  );
}
