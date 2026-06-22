import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function MarketFlowVisual() {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let raf = 0;
    let pulse = 0;

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const flows = Array.from({ length: 6 }, (_, i) => ({
      y: 18 + i * 16,
      speed: 0.4 + i * 0.08,
      offset: i * 40,
    }));

    const getAccent = () =>
      getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim();

    const draw = (ts) => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const accent = getAccent();
      ctx.clearRect(0, 0, w, h);

      flows.forEach((flow) => {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 4) {
          const y = flow.y + Math.sin((x + ts * flow.speed * 0.05 + flow.offset) * 0.04) * 5;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${accent}, 0.2)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      pulse = reduced ? 0 : (Math.sin(ts * 0.004) + 1) / 2;
      const cx = w * 0.72;
      const cy = h * 0.45;
      const r = 6 + pulse * 4;

      ctx.beginPath();
      ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${accent}, ${0.08 + pulse * 0.12})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = 'var(--accent)';
      ctx.fill();

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
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
