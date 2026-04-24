export default function SkeletonLoader({ rows = 3, className = '' }) {
  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-16 bg-white/5 rounded-xl border border-white/5"
          style={{ opacity: 1 - i * 0.15 }}
        />
      ))}
    </div>
  );
}
