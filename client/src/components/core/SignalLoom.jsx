import { useEffect, useRef } from 'react';
import { useAccent } from '../../context/AccentContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/** Woven signal threads — click to cycle chroma */
export default function SignalLoom() {
  const canvasRef = useRef(null);
  const { cycleAccent } = useAccent();
  const reduced = useReducedMotion();
  const mouse = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return undefined;

    const ctx = canvas.getContext('2d');
    let raf = 0;
    let t = 0;

    const resize = () => {
      const size = Math.min(canvas.parentElement?.clientWidth || 320, 360);
      canvas.width = size;
      canvas.height = size;
    };
    resize();

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
    };
    canvas.addEventListener('mousemove', onMove);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      t += 0.008;
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim();

      ctx.clearRect(0, 0, w, h);
      const cx = w * mouse.current.x;
      const cy = h * mouse.current.y;

      for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2 + t;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        const ex = cx + Math.cos(angle) * w * 0.55;
        const ey = cy + Math.sin(angle) * h * 0.55;
        const mx = (cx + ex) / 2 + Math.sin(t * 2 + i) * 12;
        const my = (cy + ey) / 2 + Math.cos(t * 2 + i) * 12;
        ctx.quadraticCurveTo(mx, my, ex, ey);
        ctx.strokeStyle = `rgba(${accent}, ${0.08 + (i % 3) * 0.04})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${accent}, 0.5)`;
      ctx.fill();

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('mousemove', onMove);
    };
  }, [reduced]);

  return (
    <button
      type="button"
      onClick={cycleAccent}
      className="core-hit mx-auto block cursor-pointer border-0 bg-transparent p-2"
      aria-label="Signal loom, click to shift accent"
    >
      <canvas ref={canvasRef} className="h-[min(280px,70vw)] w-[min(280px,70vw)] max-w-[320px]" />
    </button>
  );
}
