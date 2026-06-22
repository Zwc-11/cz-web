import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function PrismRipple({ active, onComplete }) {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!active || reduced) {
      onComplete?.();
      return undefined;
    }

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    let raf = 0;
    let start = 0;
    const duration = 600;

    const resize = () => {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resize();

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const accentRgb = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent-rgb')
      .trim();

    const draw = (ts) => {
      if (!start) start = ts;
      const t = (ts - start) / duration;
      if (t >= 1) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onComplete?.();
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const radius = Math.max(canvas.width, canvas.height) * 0.15 + t * Math.max(canvas.width, canvas.height) * 0.55;
      const alpha = (1 - t) * 0.35;

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${accentRgb}, ${alpha})`;
      ctx.lineWidth = 2 - t;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.65, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${accentRgb}, ${alpha * 0.5})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [active, reduced, onComplete]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
      aria-hidden
    />
  );
}
