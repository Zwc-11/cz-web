import { useReducedMotion } from '../../hooks/useReducedMotion';

/** Renaissance construction geometry — golden ratio arcs, study lines */
export default function MasterComposition() {
  const reduced = useReducedMotion();

  return (
    <svg
      className={`master-study pointer-events-none fixed inset-0 z-[5] h-full w-full ${reduced ? 'opacity-20' : 'opacity-30'}`}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="goldLine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(201,162,39,0)" />
          <stop offset="50%" stopColor="rgba(201,162,39,0.35)" />
          <stop offset="100%" stopColor="rgba(201,162,39,0)" />
        </linearGradient>
        <radialGradient id="halo" cx="50%" cy="42%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.04)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      <rect width="100%" height="100%" fill="url(#halo)" />

      {/* Golden spiral approximation — da Vinci study */}
      <path
        d="M720 450 Q920 450 920 250 Q920 50 720 50 Q520 50 520 250 Q520 450 720 450 Q920 450 920 650 Q920 850 720 850"
        fill="none"
        stroke="url(#goldLine)"
        strokeWidth="0.75"
        className={reduced ? '' : 'master-study-draw'}
      />

      {/* Construction circle */}
      <circle cx="720" cy="450" r="280" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="2 8" />
      <circle cx="720" cy="450" r="180" fill="none" stroke="var(--accent)" strokeOpacity="0.12" strokeWidth="0.5" />
      <circle cx="720" cy="450" r="90" fill="none" stroke="rgba(201,162,39,0.15)" strokeWidth="0.5" />

      {/* Dynamic symmetry diagonals */}
      <line x1="0" y1="900" x2="1440" y2="0" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />
      <line x1="0" y1="0" x2="1440" y2="900" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />

      {/* Pentagonal study — abstract, not literal */}
      <polygon
        points="720,120 950,280 860,530 580,530 490,280"
        fill="none"
        stroke="rgba(201,162,39,0.08)"
        strokeWidth="0.5"
      />

      {/* Corner medallion arcs */}
      <path d="M0 200 Q0 0 200 0" fill="none" stroke="rgba(201,162,39,0.12)" strokeWidth="0.75" />
      <path d="M1440 700 Q1440 900 1240 900" fill="none" stroke="rgba(201,162,39,0.12)" strokeWidth="0.75" />

      {!reduced && (
        <>
          <circle cx="720" cy="450" r="4" fill="rgba(201,162,39,0.4)" className="master-pulse" />
          <circle cx="720" cy="450" r="12" fill="none" stroke="rgba(201,162,39,0.2)" strokeWidth="0.5" className="master-pulse-slow" />
        </>
      )}
    </svg>
  );
}
