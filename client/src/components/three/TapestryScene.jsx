import { Stars } from '@react-three/drei';
import { useLayout } from '../../context/LayoutContext';
import { useAccent } from '../../context/AccentContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import MouseRig from './MouseRig';
import FlowField from './themes/FlowField';
import LoomField from './themes/LoomField';
import AuroraField from './themes/AuroraField';
import GildedWire from './themes/GildedWire';
import NoirGrid from './themes/NoirGrid';
import PulseHex from './themes/PulseHex';

function readAccent() {
  if (typeof document === 'undefined') return '#22d3ee';
  return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#22d3ee';
}

// Per-theme accent (kept in sync with the CSS variant palettes).
const THEME_ACCENT = {
  loom: '#22d3ee',
  aurora: '#22d3ee',
  gilded: '#f0a830',
  noir: '#d6dde6',
  pulse: '#2ee6a6',
};

export default function TapestryScene() {
  const { meta } = useLayout();
  // Depend on accent so the scene re-reads CSS colours when it cycles.
  useAccent();
  const reduced = useReducedMotion();
  // Loom keeps the cyclable accent; other themes use their fixed palette so
  // the 3D colour stays in lock-step with the layout switch.
  const accent = meta.theme === 'loom' ? readAccent() : THEME_ACCENT[meta.theme] || '#22d3ee';
  const gold = '#c9a227';

  return (
    <>
      <fog attach="fog" args={['#04050d', 8, 24]} />
      <ambientLight intensity={0.15} />

      {/* Signature flowing nebula — the personal backdrop on every theme */}
      <FlowField accent={accent} />

      {/* Theme accents + stars parallax with the pointer */}
      <MouseRig strength={reduced ? 0 : 0.3}>
        <group position={[0, 0, 1]}>
          {meta.theme === 'loom' && <LoomField color={accent} />}
          {meta.theme === 'aurora' && <AuroraField accent={accent} gold={gold} />}
          {meta.theme === 'gilded' && <GildedWire accent={accent} gold={gold} />}
          {meta.theme === 'noir' && <NoirGrid />}
          {meta.theme === 'pulse' && <PulseHex accent={accent} />}
        </group>
        <Stars radius={90} depth={50} count={1400} factor={2.5} saturation={0} fade speed={0.3} />
      </MouseRig>
    </>
  );
}
