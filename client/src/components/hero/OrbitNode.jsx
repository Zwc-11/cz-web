import { useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function OrbitNode({ label, angle, radius, delay = 0, mobile = false }) {
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotion();

  const style = {
    '--orbit-r': `${radius}px`,
    animationDelay: `${delay}s`,
  };

  if (mobile) {
    return (
      <div
        className="relative flex flex-col items-center"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--accent-glow)]" />
        <span className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/50">{label}</span>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-8 whitespace-nowrap rounded border border-white/10 bg-black/80 px-2 py-1 text-xs text-white/80"
          >
            {label}
          </motion.span>
        )}
      </div>
    );
  }

  return (
    <div
      className="absolute left-1/2 top-1/2 h-0 w-0"
      style={{ transform: `rotate(${angle}deg)` }}
    >
      <div
        className={`absolute left-0 top-0 ${reduced ? '' : 'animate-orbit'}`}
        style={style}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className="-translate-x-1/2 -translate-y-1/2 cursor-default"
          style={{ transform: `rotate(${-angle}deg)` }}
        >
          <div className="relative">
            <div className="h-2.5 w-2.5 rounded-full border border-white/20 bg-[var(--accent)] shadow-[0_0_16px_var(--accent-glow)]" />
            {hovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute left-1/2 top-full z-30 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-black/90 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-white/80 backdrop-blur-sm"
              >
                {label}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
