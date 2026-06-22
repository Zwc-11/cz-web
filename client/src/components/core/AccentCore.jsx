import { useAccent } from '../../context/AccentContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import SignalLoom from './SignalLoom';
import PhaseDial from './PhaseDial';
import TopoField from './TopoField';
import ConstellationCore from './ConstellationCore';

function HexPulse() {
  const { cycleAccent } = useAccent();
  const reduced = useReducedMotion();

  return (
    <button
      type="button"
      onClick={cycleAccent}
      className="core-hit relative mx-auto flex h-[min(260px,65vw)] w-[min(260px,65vw)] max-w-[300px] items-center justify-center border-0 bg-transparent"
      aria-label="Hex pulse, click to shift accent"
    >
      <svg viewBox="0 0 200 200" className={`h-full w-full ${reduced ? '' : 'hex-spin-slow'}`} aria-hidden>
        <polygon points="100,20 175,60 175,140 100,180 25,140 25,60" fill="none" stroke="rgba(201,162,39,0.25)" strokeWidth="0.75" />
        <polygon points="100,45 150,75 150,125 100,155 50,125 50,75" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1" />
        <circle cx="100" cy="100" r="12" fill="var(--accent)" opacity="0.7" />
      </svg>
    </button>
  );
}

const CORES = {
  loom: SignalLoom,
  dial: PhaseDial,
  topo: TopoField,
  constellation: ConstellationCore,
  hex: HexPulse,
};

export default function AccentCore({ variant = 'loom', className = '' }) {
  const Core = CORES[variant] || SignalLoom;
  return (
    <div className={`accent-core ${className}`}>
      <Core />
    </div>
  );
}

export { CORES };
