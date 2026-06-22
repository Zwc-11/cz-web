import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/** Slow drifting sfumato — Leonardo-style atmospheric soft-focus layers */
export default function SfumatoCanvas() {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return undefined;

    const ctx = canvas.getContext('2d');
    let raf = 0;
    let t = 0;

    const blobs = Array.from({ length: 7 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.18 + Math.random() * 0.22,
      speed: 0.00008 + i * 0.00002,
      phase: Math.random() * Math.PI * 2,
      hue: i % 3,
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const palettes = [
      [201, 162, 39],
      [167, 139, 250],
      [34, 211, 238],
      [120, 72, 48],
      [180, 100, 60],
    ];

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      t += 1;

      ctx.clearRect(0, 0, w, h);

      blobs.forEach((b, i) => {
        const cx = (b.x + Math.sin(t * b.speed + b.phase) * 0.12) * w;
        const cy = (b.y + Math.cos(t * b.speed * 0.7 + b.phase) * 0.1) * h;
        const radius = b.r * Math.min(w, h);

        const accent = getComputedStyle(document.documentElement)
          .getPropertyValue('--accent-rgb')
          .trim()
          .split(',')
          .map((n) => parseInt(n.trim(), 10));
        const base = palettes[i % palettes.length];
        const rgb = i === 0 ? accent : base;

        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        g.addColorStop(0, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.09)`);
        g.addColorStop(0.45, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.03)`);
        g.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [reduced]);

  if (reduced) {
    return (
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 70% 30%, rgba(201,162,39,0.08), transparent 60%), radial-gradient(ellipse 60% 50% at 20% 70%, rgba(120,72,48,0.06), transparent 55%)',
        }}
        aria-hidden
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[1] opacity-70 mix-blend-screen"
      aria-hidden
    />
  );
}
