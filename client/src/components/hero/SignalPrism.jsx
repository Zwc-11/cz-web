import { useCallback, useEffect, useRef, useState } from 'react';
import { useAccent } from '../../context/AccentContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import OrbitNode from './OrbitNode';
import PrismRipple from './PrismRipple';

const NODES = [
  { label: 'AI Agents', angle: 0, delay: 0 },
  { label: 'Data Science', angle: 72, delay: 1.2 },
  { label: 'Trading Systems', angle: 144, delay: 2.4 },
  { label: 'Robotics', angle: 216, delay: 3.6 },
  { label: 'Full-Stack', angle: 288, delay: 4.8 },
];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export default function SignalPrism() {
  const containerRef = useRef(null);
  const { cycleAccent } = useAccent();
  const reduced = useReducedMotion();
  const [ripple, setRipple] = useState(false);
  const [mobile, setMobile] = useState(false);

  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0, rotX: 0, rotY: 0 });
  const glowRef = useRef(null);
  const prismRef = useRef(null);
  const gradRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || reduced) return undefined;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      target.current = { x: x * (mobile ? 0.4 : 1), y: y * (mobile ? 0.4 : 1) };
    };

    const onLeave = () => {
      target.current = { x: 0, y: 0 };
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    let raf = 0;
    const tick = () => {
      current.current.x = lerp(current.current.x, target.current.x, 0.08);
      current.current.y = lerp(current.current.y, target.current.y, 0.08);
      current.current.rotX = lerp(current.current.rotX, -target.current.y * 18, 0.08);
      current.current.rotY = lerp(current.current.rotY, target.current.x * 22, 0.08);

      if (prismRef.current) {
        prismRef.current.style.transform = `rotateX(${current.current.rotX}deg) rotateY(${current.current.rotY}deg)`;
      }
      if (glowRef.current) {
        const gx = 50 - target.current.x * 40;
        const gy = 50 - target.current.y * 40;
        glowRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, var(--accent-glow), transparent 65%)`;
        glowRef.current.style.transform = `translate(${target.current.x * -20}px, ${target.current.y * -20}px)`;
      }
      if (gradRef.current) {
        const angle = Math.atan2(target.current.y, target.current.x) * (180 / Math.PI) + 90;
        gradRef.current.setAttribute('gradientTransform', `rotate(${angle} 100 86)`);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [reduced, mobile]);

  const handleClick = useCallback(() => {
    cycleAccent();
    if (!reduced) setRipple(true);
  }, [cycleAccent, reduced]);

  const orbitRadius = mobile ? 0 : 130;

  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex h-[280px] w-full max-w-[340px] items-center justify-center sm:h-[360px] sm:max-w-[420px]"
      style={{ perspective: '900px' }}
    >
      <PrismRipple active={ripple} onComplete={() => setRipple(false)} />

      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 rounded-full opacity-80 blur-3xl transition-colors duration-500"
        aria-hidden
      />

      {!mobile &&
        NODES.map((node) => (
          <OrbitNode key={node.label} {...node} radius={orbitRadius} />
        ))}

      <button
        type="button"
        onClick={handleClick}
        className="relative z-10 cursor-pointer border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        aria-label="Signal prism, click to shift accent color"
      >
        <div ref={prismRef} className="transition-transform duration-75 will-change-transform">
          <svg
            viewBox="0 0 200 180"
            className="h-[200px] w-[220px] drop-shadow-[0_20px_60px_rgba(0,0,0,0.6)] sm:h-[240px] sm:w-[260px]"
            aria-hidden
          >
            <defs>
              <linearGradient id="prismFace" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
              </linearGradient>
              <linearGradient id="prismLight" ref={gradRef} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.55" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.15)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.02)" stopOpacity="0.05" />
              </linearGradient>
              <filter id="prismGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <polygon
              points="100,12 188,158 12,158"
              fill="url(#prismFace)"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
            />
            <polygon
              points="100,12 188,158 12,158"
              fill="url(#prismLight)"
              opacity="0.85"
              filter="url(#prismGlow)"
            />
            <polyline
              points="100,12 100,158"
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="0.75"
            />
            <polyline
              points="56,85 144,85"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.5"
            />
          </svg>
        </div>
      </button>

      {mobile && (
        <div className="absolute -bottom-2 left-0 right-0 flex justify-between px-2">
          {NODES.map((node) => (
            <OrbitNode key={node.label} {...node} mobile />
          ))}
        </div>
      )}
    </div>
  );
}
