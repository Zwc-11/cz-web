import { useEffect } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/** Window-light that follows the cursor — Caravaggio tenebrism accent */
export default function ChiaroscuroLight() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;

    const onMove = (e) => {
      document.documentElement.style.setProperty('--light-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--light-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reduced]);

  return (
    <>
      <div className="chiaroscuro-base pointer-events-none fixed inset-0 z-[2]" aria-hidden />
      <div className="chiaroscuro-beam pointer-events-none fixed inset-0 z-[3]" aria-hidden />
      <div className="chiaroscuro-vignette pointer-events-none fixed inset-0 z-[4]" aria-hidden />
    </>
  );
}
