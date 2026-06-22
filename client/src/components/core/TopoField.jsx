import { useEffect, useRef } from 'react';
import { useAccent } from '../../context/AccentContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/** Topographic signal field — contour waves */
export default function TopoField() {
  const canvasRef = useRef(null);
  const { cycleAccent } = useAccent();
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return undefined;

    const ctx = canvas.getContext('2d');
    let raf = 0;
    let t = 0;

    const resize = () => {
      const w = canvas.parentElement?.clientWidth || 320;
      canvas.width = Math.min(w, 400);
      canvas.height = Math.min(w * 0.65, 260);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      t += 0.012;
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim();

      ctx.clearRect(0, 0, w, h);

      for (let layer = 0; layer < 8; layer++) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 3) {
          const y =
            h * 0.5 +
            Math.sin(x * 0.015 + t + layer * 0.5) * (18 - layer * 1.5) +
            Math.sin(x * 0.008 - t * 0.5) * 8;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${accent}, ${0.06 + layer * 0.025})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [reduced]);

  return (
    <button
      type="button"
      onClick={cycleAccent}
      className="core-hit mx-auto block w-full max-w-[400px] border-0 bg-transparent p-0"
      aria-label="Topo field, click to shift accent"
    >
      <canvas ref={canvasRef} className="w-full" />
    </button>
  );
}
