import type { Project } from '../content/work'

// Small, theme-aware diagrams that say what each project does, drawn in
// the site's own tokens instead of stock screenshots.

const ink = 'var(--fg)'
const faint = 'var(--faint)'
const line = 'var(--line-2)'
const rec = 'var(--rec)'

function Grid() {
  return (
    <g stroke={line} strokeWidth="1" opacity="0.6">
      {[50, 100, 150].map((y) => (
        <line key={y} x1="0" x2="320" y1={y} y2={y} />
      ))}
    </g>
  )
}

function Hindsight() {
  const naive = 'M16 168 L48 152 L80 156 L112 130 L144 134 L176 102 L208 106 L240 72 L272 76 L304 40'
  const audited = 'M16 168 L48 164 L80 168 L112 154 L144 158 L176 146 L208 150 L240 136 L272 140 L304 128'
  return (
    <>
      <Grid />
      <path d={`${naive} L304 128 L272 140 L240 136 L208 150 L176 146 L144 158 L112 154 L80 168 L48 164 Z`} fill="var(--rec-soft)" />
      <path d={naive} fill="none" stroke={faint} strokeWidth="1.6" strokeDasharray="4 4" />
      <path d={audited} fill="none" stroke={rec} strokeWidth="2" />
      <line x1="176" x2="176" y1="24" y2="184" stroke={ink} strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />
      <text x="182" y="34" fontFamily="var(--font-mono)" fontSize="9" fill={faint} letterSpacing=".06em">LEAK CHECK</text>
      <text x="236" y="60" fontFamily="var(--font-mono)" fontSize="9" fill={faint} letterSpacing=".06em">NAIVE</text>
      <text x="252" y="124" fontFamily="var(--font-mono)" fontSize="9" fill={rec} letterSpacing=".06em">AUDITED</text>
    </>
  )
}

function Murmur() {
  // 30 attempts, pass^k style: filled = pass, red = fail
  const fails = new Set([4, 11, 17, 26])
  return (
    <>
      {Array.from({ length: 30 }, (_, n) => {
        const c = n % 10
        const r = Math.floor(n / 10)
        const x = 24 + c * 28
        const y = 36 + r * 34
        const f = fails.has(n)
        return <rect key={n} x={x} y={y} width="20" height="20" rx="4" fill={f ? rec : ink} opacity={f ? 1 : 0.14 + ((n * 7) % 5) * 0.04} />
      })}
      <g stroke={line}>
        <line x1="24" x2="296" y1="156" y2="156" />
      </g>
      {[0, 1, 2, 3, 4].map((n) => (
        <g key={n}>
          <rect x={24 + n * 58} y="166" width="44" height="18" rx="4" fill="none" stroke={n === 3 ? rec : line} />
          <text x={46 + n * 58} y="178" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8.5" fill={n === 3 ? rec : faint}>
            {['a3f9', '0c7e', '91bd', 'e44a', '5d02'][n]}
          </text>
          {n < 4 && <line x1={68 + n * 58} x2={82 + n * 58} y1="175" y2="175" stroke={line} />}
        </g>
      ))}
    </>
  )
}

function MarketImmune() {
  const bars = [30, 52, 24, 64, 40, 88, 36, 58, 22, 70, 46, 96, 34, 50, 28, 62, 44, 80, 30, 54]
  const flagged = new Set([5, 11, 17])
  return (
    <>
      <line x1="12" x2="308" y1="104" y2="104" stroke={line} />
      {bars.map((h, n) => {
        const up = n % 3 !== 1
        const x = 18 + n * 14.6
        const f = flagged.has(n)
        return <rect key={n} x={x} y={up ? 104 - h * 0.8 : 104} width="8" height={h * 0.8} rx="2" fill={f ? rec : ink} opacity={f ? 1 : 0.22} />
      })}
      {[...flagged].map((n) => (
        <g key={n}>
          <rect x={14 + n * 14.6} y="14" width="16" height="16" rx="3" fill="none" stroke={rec} />
          <line x1={22 + n * 14.6} x2={22 + n * 14.6} y1="30" y2="36" stroke={rec} />
        </g>
      ))}
      <text x="12" y="186" fontFamily="var(--font-mono)" fontSize="9" fill={faint} letterSpacing=".06em">AGENT ORDER FLOW · 3 FLAGGED</text>
    </>
  )
}

function AgentReplay() {
  const xs = [28, 76, 124, 172, 220, 268]
  return (
    <>
      <text x="16" y="52" fontFamily="var(--font-mono)" fontSize="9" fill={faint} letterSpacing=".06em">RECORDED</text>
      <text x="16" y="142" fontFamily="var(--font-mono)" fontSize="9" fill={faint} letterSpacing=".06em">REPLAY</text>
      <line x1="28" x2="292" y1="72" y2="72" stroke={line} />
      <path d="M28 124 L172 124 L220 150 L292 150" fill="none" stroke={line} />
      <line x1="172" x2="172" y1="60" y2="164" stroke={rec} strokeDasharray="3 3" />
      {xs.map((x, n) => (
        <g key={x}>
          <circle cx={x} cy="72" r="7" fill="var(--surface)" stroke={ink} strokeOpacity=".5" />
          <circle cx={x} cy={n < 4 ? 124 : 150} r="7" fill={n === 4 ? rec : 'var(--surface)'} stroke={n === 4 ? rec : ink} strokeOpacity={n === 4 ? 1 : 0.5} />
        </g>
      ))}
      <text x="180" y="184" fontFamily="var(--font-mono)" fontSize="9" fill={rec} letterSpacing=".06em">FIRST DIVERGENCE</text>
    </>
  )
}

export function ProjectArt({ kind }: { kind: Project['art'] }) {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" role="presentation" aria-hidden>
      {kind === 'hindsight' && <Hindsight />}
      {kind === 'murmur' && <Murmur />}
      {kind === 'marketimmune' && <MarketImmune />}
      {kind === 'agentreplay' && <AgentReplay />}
    </svg>
  )
}
