import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Custom pointer: a small, precise accent dot that tracks the cursor closely,
 * plus a thin ring that trails with gentle lag and reacts to interactive
 * targets. The native cursor is hidden while active for a clean, intentional
 * feel (text caret is preserved on inputs). Pointer devices only; disabled for
 * reduced-motion. rAF-driven with direct style writes (no React re-renders).
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add('has-custom-cursor');

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dotPos = { ...target };
    const ringPos = { ...target };
    let raf = 0;
    let visible = false;

    const interactiveSel = 'a, button, [role="button"], input, textarea, label, .core-hit';

    const show = () => {
      if (visible) return;
      visible = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      show();
    };
    const onOver = (e) => {
      if (e.target.closest && e.target.closest(interactiveSel)) {
        ring.classList.add('cursor-ring--active');
      }
    };
    const onOut = (e) => {
      if (e.target.closest && e.target.closest(interactiveSel)) {
        ring.classList.remove('cursor-ring--active');
      }
    };
    const onDown = () => ring.classList.add('cursor-ring--down');
    const onUp = () => ring.classList.remove('cursor-ring--down');
    const onLeave = () => {
      visible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    const tick = () => {
      // dot tracks tightly (feels precise), ring trails softly
      dotPos.x += (target.x - dotPos.x) * 0.45;
      dotPos.y += (target.y - dotPos.y) * 0.45;
      ringPos.x += (target.x - ringPos.x) * 0.16;
      ringPos.y += (target.y - ringPos.y) * 0.16;
      dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
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
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver, true);
      document.removeEventListener('mouseout', onOut, true);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [reduced]);

  if (reduced) return null;
  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
    </>
  );
}
