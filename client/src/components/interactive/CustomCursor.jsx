import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Custom pointer: a single small accent dot that tracks the cursor closely.
 * Over interactive targets it gains a soft halo (a glow, not a hard ring) and
 * a subtle press state on mousedown. The native cursor is hidden while active
 * for a clean, intentional feel (text caret is preserved on inputs). Pointer
 * devices only; disabled for reduced-motion. rAF-driven with direct style
 * writes (no React re-renders).
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const dot = dotRef.current;
    if (!dot) return;

    document.documentElement.classList.add('has-custom-cursor');

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let raf = 0;
    let visible = false;

    const interactiveSel = 'a, button, [role="button"], input, textarea, label, .core-hit';

    const show = () => {
      if (visible) return;
      visible = true;
      dot.style.opacity = '1';
    };

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      show();
    };
    const onOver = (e) => {
      if (e.target.closest && e.target.closest(interactiveSel)) {
        dot.classList.add('cursor-dot--active');
      }
    };
    const onOut = (e) => {
      if (e.target.closest && e.target.closest(interactiveSel)) {
        dot.classList.remove('cursor-dot--active');
      }
    };
    const onDown = () => dot.classList.add('cursor-dot--down');
    const onUp = () => dot.classList.remove('cursor-dot--down');
    const onLeave = () => {
      visible = false;
      dot.style.opacity = '0';
    };

    const tick = () => {
      // 1:1 tracking — match the pointer exactly so there is no perceived lag
      pos.x = target.x;
      pos.y = target.y;
      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
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
  return <div ref={dotRef} className="cursor-dot" aria-hidden />;
}
