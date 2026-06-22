import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * A soft accent glow that trails the pointer, adding depth and a sense of
 * presence without obscuring content. Pointer-capable devices only; disabled
 * for touch and reduced-motion preferences. Uses rAF + direct style writes so
 * it never triggers React re-renders.
 */
export default function Spotlight() {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    // Skip on touch-primary devices where a cursor glow makes no sense.
    if (window.matchMedia('(hover: none)').matches) return;

    const el = ref.current;
    if (!el) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...target };
    let raf = 0;
    let visible = false;

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        el.style.opacity = '1';
      }
    };

    const onLeave = () => {
      visible = false;
      el.style.opacity = '0';
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.12;
      current.y += (target.y - current.y) * 0.12;
      el.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  if (reduced) return null;

  return <div ref={ref} className="cursor-spotlight" aria-hidden />;
}
