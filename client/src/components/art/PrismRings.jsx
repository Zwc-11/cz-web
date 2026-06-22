import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function PrismRings() {
  const reduced = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
      {[320, 420, 520].map((size, i) => (
        <div
          key={size}
          className={`absolute rounded-full border border-dashed border-white/[0.06] ${reduced ? '' : 'animate-spin-slow'}`}
          style={{
            width: size,
            height: size,
            animationDuration: `${18 + i * 6}s`,
            animationDirection: i % 2 ? 'reverse' : 'normal',
            borderColor: i === 1 ? 'rgba(var(--accent-rgb), 0.12)' : undefined,
          }}
        />
      ))}
      <div className="absolute h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(var(--accent-rgb),0.08)_0%,transparent_70%)]" />
    </div>
  );
}
