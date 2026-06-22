import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * A small accent ring that trails the pointer with smooth lag and grows when
 * hovering interactive elements. The native cursor stays for precision; this
 * is pure flair. Pointer devices only, disabled for reduced-motion.
 * rAF-driven with direct style writes (no React re-renders).
 */
export default function CustomCursor() {
  const ringRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const ring = ringRef.current;
    if (!ring) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let raf = 0;
    let visible = false;

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        ring.style.opacity = '1';
      }
    };
    const onOver = (e) => {
      if (e.target.closest && e.target.closest('a, button, [role="button"], input, textarea, label, .core-hit')) {
        ring.classList.add('cursor-ring--active');
      }
    };
    const onOut = (e) => {
      if (e.target.closest && e.target.closest('a, button, [role="button"], input, textarea, label, .core-hit')) {
        ring.classList.remove('cursor-ring--active');
      }
    };
    const onDown = () => ring.classList.add('cursor-ring--down');
    const onUp = () => ring.classList.remove('cursor-ring--down');
    const onLeave = () => { ring.style.opacity = '0'; visible = false; };

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      ring.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, true);
    document.addEventListener('mouseout', onOut, true);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver, true);
      document.removeEventListener('mouseout', onOut, true);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [reduced]);

  if (reduced) return null;
  return <div ref={ringRef} className="cursor-ring" aria-hidden />;
}
