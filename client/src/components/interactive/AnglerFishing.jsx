import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * A tiny matchstick angler who sits on top of the "Let's talk" button and
 * fishes into the page below with a long line. Every so often (randomised
 * interval) a small gold fish wanders in along a different, organic path —
 * never the same route twice, and it sometimes nibbles and swims off without
 * biting — so it never reads as a scripted loop. On a bite the angler reels it
 * up, it wriggles, then is released. Decorative only (pointer-events: none) so
 * the button stays clickable. Static pose for reduced-motion.
 */

const ROD_TIP = { x: 84, y: 18 };
const HOOK = { x: 84, down: 178, up: 32 };

const PHASE = {
  cast: { line: HOOK.down, fish: { x: 150, y: 176, o: 0 }, rod: 0, dur: 0.6 },
  approach: { line: HOOK.down, fish: { x: HOOK.x, y: 176, o: 1 }, rod: 0, dur: 3 },
  bite: { line: HOOK.down + 4, fish: { x: HOOK.x, y: 178, o: 1 }, rod: 3, dur: 0.4 },
  reel: { line: HOOK.up, fish: { x: HOOK.x, y: 36, o: 1 }, rod: -13, dur: 0.9 },
  caught: { line: HOOK.up, fish: { x: HOOK.x, y: 36, o: 1 }, rod: -13, dur: 0.4 },
  release: { line: HOOK.down, fish: { x: -24, y: 160, o: 0 }, rod: 0, dur: 0.9 },
};

const NEXT = {
  cast: 'approach',
  approach: 'bite', // may be overridden by a random "miss"
  bite: 'reel',
  reel: 'caught',
  caught: 'release',
  release: 'cast',
};

const HOLD = {
  cast: () => 5000 + Math.random() * 11000, // 5–16s between visits
  bite: () => 450,
  reel: () => 950,
  caught: () => 900,
  release: () => 850,
};

// Build a fresh, wandering approach path to the hook — random side, random
// entry height, random midpoints and duration, so no two arrivals match.
function makeRoute() {
  const fromLeft = Math.random() < 0.5;
  const startX = fromLeft ? -24 : 164;
  const startY = 150 + Math.random() * 42;
  const xs = [startX];
  const ys = [startY];
  const mids = 2 + Math.floor(Math.random() * 2);
  for (let i = 1; i <= mids; i += 1) {
    const tt = i / (mids + 1);
    xs.push(startX + (HOOK.x - startX) * tt + (Math.random() - 0.5) * 70);
    ys.push(startY + (HOOK.down - startY) * tt + (Math.random() - 0.5) * 55);
  }
  xs.push(HOOK.x);
  ys.push(HOOK.down);
  return {
    xs,
    ys,
    dur: 2.6 + Math.random() * 2.6, // 2.6–5.2s of wandering
    face: fromLeft ? -1 : 1, // -1 → nose points right (swimming right)
  };
}

function FishGlyph() {
  return (
    <>
      <ellipse cx="0" cy="0" rx="5" ry="3" fill="#e8b524" />
      <path d="M5 0 L9 -3 L9 3 Z" fill="#c79a1d" />
      <circle cx="-3" cy="-1" r="0.8" fill="#1a1206" />
    </>
  );
}

export default function AnglerFishing() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState('cast');
  const [route, setRoute] = useState(null);

  useEffect(() => {
    if (reduced) return undefined;
    const hold = phase === 'approach' && route ? route.dur * 1000 + 200 : HOLD[phase]();
    const id = setTimeout(() => {
      let np = NEXT[phase];
      // ~30% of arrivals are a near-miss: nibble then swim away.
      if (phase === 'approach' && Math.random() < 0.3) np = 'release';
      if (np === 'approach') setRoute(makeRoute());
      setPhase(np);
    }, hold);
    return () => clearTimeout(id);
  }, [phase, route, reduced]);

  const p = PHASE[phase];
  const isCast = phase === 'cast' && !reduced;
  const lineTo = reduced ? HOOK.down : p.line;
  const bob = isCast ? [HOOK.down - 2, HOOK.down + 3, HOOK.down - 2] : lineTo;
  const lineTransition = isCast
    ? { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
    : { duration: p.dur, ease: 'easeInOut' };

  const useRoute = phase === 'approach' && route;
  const fishAnim = useRoute
    ? { x: route.xs, y: route.ys, opacity: 1 }
    : { x: p.fish.x, y: p.fish.y, opacity: p.fish.o };
  const fishTransition = useRoute
    ? { duration: route.dur, ease: 'easeInOut' }
    : { duration: p.dur, ease: 'easeInOut' };
  const face = route?.face ?? 1;

  return (
    <span className="angler" aria-hidden>
      <svg viewBox="0 0 140 220" width="140" height="220">
        {/* fishing line + hook */}
        <motion.line
          x1={ROD_TIP.x}
          y1={ROD_TIP.y}
          x2={ROD_TIP.x}
          animate={{ y2: bob }}
          transition={lineTransition}
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="0.9"
        />
        <motion.circle
          cx={HOOK.x}
          r="1.7"
          fill="none"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="1"
          animate={{ cy: bob }}
          transition={lineTransition}
        />

        {/* the gold fish */}
        {!reduced && (
          <motion.g animate={fishAnim} transition={fishTransition}>
            <g style={{ transform: `scaleX(${face})` }}>
              <motion.g
                animate={phase === 'caught' ? { rotate: [0, -22, 22, -12, 0] } : { rotate: 0 }}
                transition={phase === 'caught' ? { duration: 0.7, repeat: Infinity } : { duration: 0.3 }}
              >
                <FishGlyph />
              </motion.g>
            </g>
          </motion.g>
        )}

        {/* matchstick angler, sitting and facing the rod */}
        <g
          stroke="rgba(255,255,255,0.88)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <circle cx="40" cy="13" r="5" fill="rgba(255,255,255,0.88)" stroke="none" />
          <path d="M40 18 Q41 28 43 39" />
          <path d="M43 39 Q50 42 53 45 L55 57" />
          <path d="M43 39 Q49 44 51 48 L52 60" />
          <path d="M41 23 Q52 26 60 30" />
        </g>

        {/* rod (tilts up when reeling) */}
        <motion.g
          style={{ transformOrigin: '60px 30px' }}
          animate={{ rotate: reduced ? 0 : p.rod }}
          transition={{ duration: p.dur, ease: 'easeInOut' }}
          stroke="rgba(255,255,255,0.72)"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        >
          <line x1="60" y1="30" x2={ROD_TIP.x} y2={ROD_TIP.y} />
          <circle cx="60" cy="30" r="1.7" fill="rgba(255,255,255,0.72)" stroke="none" />
        </motion.g>
      </svg>
    </span>
  );
}
