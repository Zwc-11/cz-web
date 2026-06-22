import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/** Pigment veins — thin flowing lines like glaze cracks / underpainting */
export default function PigmentVeins() {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return undefined;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let raf = 0;
    let t = 0;

    const veins = Array.from({ length: 12 }, (_, i) => {
      const startX = Math.random();
      const startY = Math.random();
      const len = 80 + Math.random() * 160;
      const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.5;
      return { startX, startY, len, angle, w: 0.3 + Math.random() * 0.6 };
    });

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      t += 0.003;

      ctx.clearRect(0, 0, w, h);

      const accent = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent-rgb')
        .trim();

      veins.forEach((v, i) => {
        const sx = v.startX * w;
        const sy = v.startY * h;
        const drift = Math.sin(t + i) * 8;
        const ex = sx + Math.cos(v.angle) * v.len + drift;
        const ey = sy + Math.sin(v.angle) * v.len;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        const mx = (sx + ex) / 2 + Math.sin(t * 2 + i) * 20;
        const my = (sy + ey) / 2 + Math.cos(t * 2 + i) * 15;
        ctx.quadraticCurveTo(mx, my, ex, ey);

        const alpha = 0.04 + Math.sin(t + i) * 0.02;
        ctx.strokeStyle = i % 3 === 0 ? `rgba(${accent}, ${alpha})` : `rgba(201,162,39,${alpha * 0.8})`;
        ctx.lineWidth = v.w;
        ctx.stroke();
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[6] opacity-60"
      aria-hidden
    />
  );
}
