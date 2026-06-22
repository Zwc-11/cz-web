import { useReducedMotion } from '../../hooks/useReducedMotion';

const NODES = [
  { x: 40, y: 50, r: 5 },
  { x: 90, y: 30, r: 4 },
  { x: 140, y: 55, r: 6 },
  { x: 190, y: 35, r: 4 },
  { x: 240, y: 60, r: 5 },
  { x: 115, y: 75, r: 3 },
  { x: 175, y: 80, r: 3 },
];

const EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 4], [1, 5], [2, 5], [2, 6], [3, 6],
];

export default function ChaosGraphVisual() {
  const reduced = useReducedMotion();

  return (
    <svg
      viewBox="0 0 280 100"
      className="h-28 w-full rounded-lg border border-white/5 bg-black/40"
      aria-hidden
    >
      {EDGES.map(([a, b], i) => {
        const n1 = NODES[a];
        const n2 = NODES[b];
        return (
          <line
            key={i}
            x1={n1.x}
            y1={n1.y}
            x2={n2.x}
            y2={n2.y}
            stroke="rgba(var(--accent-rgb), 0.25)"
            strokeWidth="1"
          />
        );
      })}
      {NODES.map((node, i) => (
        <g key={i}>
          {!reduced && (
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r + 6}
              fill="rgba(var(--accent-rgb), 0.12)"
            >
              <animate
                attributeName="r"
                values={`${node.r + 4};${node.r + 8};${node.r + 4}`}
                dur={`${2 + i * 0.3}s`}
                repeatCount="indefinite"
              />
            </circle>
          )}
          <circle cx={node.x} cy={node.y} r={node.r} fill="var(--accent)" opacity={0.5 + i * 0.06} />
        </g>
      ))}
    </svg>
  );
}
