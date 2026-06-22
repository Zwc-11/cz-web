import { useEffect, useRef } from 'react';
import { useAccent } from '../../context/AccentContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/** Astrolabe-style phase rings */
export default function PhaseDial() {
  const { cycleAccent } = useAccent();
  const reduced = useReducedMotion();
  const rot = useRef(0);

  useEffect(() => {
    if (reduced) return undefined;
    let raf = 0;
    const tick = () => {
      rot.current += 0.15;
      const el = document.getElementById('phase-dial-outer');
      const el2 = document.getElementById('phase-dial-inner');
      if (el) el.style.transform = `rotate(${rot.current}deg)`;
      if (el2) el2.style.transform = `rotate(${-rot.current * 0.6}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return (
    <button
      type="button"
      onClick={cycleAccent}
      className="core-hit relative mx-auto flex h-[min(280px,70vw)] w-[min(280px,70vw)] max-w-[320px] items-center justify-center border-0 bg-transparent"
      aria-label="Phase dial, click to shift accent"
    >
      <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
        <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(201,162,39,0.15)" strokeWidth="0.5" />
        <g id="phase-dial-outer" style={{ transformOrigin: '100px 100px' }}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line
              key={a}
              x1="100"
              y1="100"
              x2={100 + 85 * Math.cos((a * Math.PI) / 180)}
              y2={100 + 85 * Math.sin((a * Math.PI) / 180)}
              stroke="var(--accent)"
              strokeOpacity="0.25"
              strokeWidth="0.75"
            />
          ))}
          <circle cx="100" cy="100" r="70" fill="none" stroke="var(--accent)" strokeOpacity="0.2" strokeDasharray="4 6" />
        </g>
        <g id="phase-dial-inner" style={{ transformOrigin: '100px 100px' }}>
          <polygon
            points="100,35 155,145 45,145"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="0.75"
          />
          <circle cx="100" cy="100" r="22" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1" />
        </g>
      </svg>
    </button>
  );
}
