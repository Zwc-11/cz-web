import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function MurmurTraceVisual() {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let raf = 0;
    let scan = 0;

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const traces = Array.from({ length: 8 }, (_, i) => ({
      y: 20 + i * 14,
      points: Array.from({ length: 24 }, (_, j) => 12 + j * 10 + Math.sin(j + i) * 6),
    }));

    const getAccent = () =>
      getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim();

    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const accent = getAccent();
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      ctx.fillRect(0, 0, w, h);

      traces.forEach((trace, ti) => {
        ctx.beginPath();
        trace.points.forEach((x, i) => {
          const y = trace.y + Math.sin(i * 0.4 + ti) * 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = `rgba(${accent}, ${0.25 + ti * 0.05})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      if (!reduced) {
        scan = (scan + 1.2) % (w + 40);
        ctx.fillStyle = `rgba(${accent}, 0.35)`;
        ctx.fillRect(scan - 20, 0, 2, h);
        ctx.fillStyle = `rgba(${accent}, 0.08)`;
        ctx.fillRect(scan - 40, 0, 40, h);
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      className="h-28 w-full rounded-lg border border-white/5 bg-black/40"
      aria-hidden
    />
  );
}
