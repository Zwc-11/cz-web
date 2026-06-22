import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function ThoughtGlyphs({ className = '' }) {
  const reduced = useReducedMotion();

  return (
    <svg
      className={`thought-glyphs pointer-events-none ${className}`}
      viewBox="0 0 120 400"
      aria-hidden
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(60, ${40 + i * 72})`} className={reduced ? '' : 'glyph-float'} style={{ animationDelay: `${i * 0.7}s` }}>
          <circle r="18" fill="none" stroke="rgba(201,162,39,0.15)" strokeWidth="0.5" />
          <path
            d={i % 2 ? 'M-8,0 L8,0 M0,-8 L0,8' : 'M0,-10 L8,6 L-8,6 Z'}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="0.75"
            opacity="0.5"
          />
        </g>
      ))}
    </svg>
  );
}
