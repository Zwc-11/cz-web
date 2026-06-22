import { useReducedMotion } from '../../hooks/useReducedMotion';

const FRAGMENTS = [
  'RAG::89.5% strict',
  'PR-AUC::0.769',
  'pass@k::30 fan-out',
  'LangGraph::8 tools',
  'Hyperliquid::markout +15bps',
  'NDCG@5::leakage-safe',
  'FRC::PID::bring-up',
  'agent trace::replay ok',
];

export default function MarginCipher({ vertical = false }) {
  const reduced = useReducedMotion();
  const text = [...FRAGMENTS, ...FRAGMENTS, ...FRAGMENTS].join('  ◆  ');

  if (vertical) {
    return (
      <div className="cipher-rail overflow-hidden border border-white/[0.08] bg-black/30 p-2 font-mono text-[8px] uppercase leading-relaxed tracking-wider text-[rgba(201,162,39,0.45)]" aria-hidden>
        {FRAGMENTS.map((f) => (
          <p key={f} className="mb-3 [writing-mode:vertical-rl] rotate-180">
            {f}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`cipher-rail cipher-rail-horizontal overflow-hidden border-y border-white/[0.08] bg-black/30 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[rgba(201,162,39,0.45)] ${reduced ? '' : ''}`}
      aria-hidden
    >
      <div className="cipher-track whitespace-nowrap">{text}</div>
    </div>
  );
}
