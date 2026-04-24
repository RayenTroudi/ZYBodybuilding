const glowMap = {
  red: 'shadow-[0_4px_24px_rgba(204,19,3,0.25)]',
  blue: 'shadow-[0_4px_24px_rgba(59,130,246,0.2)]',
  green: 'shadow-[0_4px_24px_rgba(16,185,129,0.2)]',
  orange: 'shadow-[0_4px_24px_rgba(245,158,11,0.2)]',
  purple: 'shadow-[0_4px_24px_rgba(168,85,247,0.2)]',
};

export default function GlassCard({ children, className = '', glow }) {
  return (
    <div
      className={`bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl ${
        glow ? glowMap[glow] : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
