import { useReducedMotion } from '../../../hooks/useReducedMotion';

/** Concentric orbital rings — depth without clutter */
export default function OrbitalField() {
  const reduced = useReducedMotion();

  return (
    <svg
      className={`orbital-field pointer-events-none absolute left-1/2 top-[28%] z-[1] h-[min(90vw,56rem)] w-[min(90vw,56rem)] -translate-x-1/2 -translate-y-1/2 ${reduced ? 'opacity-15' : 'opacity-25'}`}
      viewBox="0 0 400 400"
      aria-hidden
    >
      <circle cx="200" cy="200" r="190" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
      <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(var(--accent-rgb),0.08)" strokeWidth="0.5" strokeDasharray="3 9" />
      <circle cx="200" cy="200" r="110" fill="none" stroke="rgba(var(--paint-gold-rgb),0.12)" strokeWidth="0.5" />
      <circle cx="200" cy="200" r="70" fill="none" stroke="rgba(var(--accent-rgb),0.1)" strokeWidth="0.75" />
      <ellipse cx="200" cy="200" rx="190" ry="70" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" transform="rotate(-18 200 200)" />
      {!reduced && (
        <g className="orbital-spin-slow" style={{ transformOrigin: '200px 200px' }}>
          <path d="M200 10 A190 190 0 0 1 390 200" fill="none" stroke="rgba(var(--accent-rgb),0.15)" strokeWidth="0.75" />
          <path d="M10 200 A190 190 0 0 1 200 390" fill="none" stroke="rgba(var(--paint-gold-rgb),0.12)" strokeWidth="0.5" />
        </g>
      )}
    </svg>
  );
}
