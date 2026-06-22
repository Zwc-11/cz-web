import { useAccent } from '../../context/AccentContext';

const NODES = [
  { label: 'Agents', x: 100, y: 28 },
  { label: 'Data', x: 168, y: 72 },
  { label: 'Markets', x: 152, y: 148 },
  { label: 'Robotics', x: 48, y: 148 },
  { label: 'Stack', x: 32, y: 72 },
];

const EDGES = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 2], [1, 3]];

export default function ConstellationCore() {
  const { cycleAccent } = useAccent();

  return (
    <button
      type="button"
      onClick={cycleAccent}
      className="core-hit mx-auto block max-w-[320px] border-0 bg-transparent p-4"
      aria-label="Constellation, click to shift accent"
    >
      <svg viewBox="0 0 200 180" className="w-full" aria-hidden>
        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            stroke="var(--accent)"
            strokeOpacity="0.2"
            strokeWidth="0.75"
          />
        ))}
        {NODES.map((n) => (
          <g key={n.label}>
            <circle cx={n.x} cy={n.y} r="14" fill="var(--accent-soft)" />
            <circle cx={n.x} cy={n.y} r="4" fill="var(--accent)" />
            <text x={n.x} y={n.y + 28} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="7" fontFamily="monospace">
              {n.label}
            </text>
          </g>
        ))}
        <circle cx="100" cy="95" r="6" fill="var(--accent)" opacity="0.8" />
      </svg>
    </button>
  );
}
