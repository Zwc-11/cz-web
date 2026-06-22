import { useReducedMotion } from '../../../hooks/useReducedMotion';

export default function AuroraVeil() {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <div
        className="aurora-veil pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 20% 20%, rgba(var(--accent-rgb),0.08), transparent 50%), radial-gradient(ellipse 60% 40% at 80% 30%, rgba(var(--paint-gold-rgb),0.06), transparent 55%)',
        }}
        aria-hidden
      />
    );
  }

  return (
    <div className="aurora-veil pointer-events-none absolute inset-0 overflow-hidden opacity-70" aria-hidden>
      <div className="aurora-sheet aurora-sheet-a" />
      <div className="aurora-sheet aurora-sheet-b" />
      <div className="aurora-sheet aurora-sheet-c" />
    </div>
  );
}
