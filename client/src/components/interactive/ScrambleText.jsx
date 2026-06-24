import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const SWAP_MS = 48; // throttle glyph churn so it reads as a decode, not noise
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

const scrambleOf = (text) =>
  Array.from(text)
    .map((c) => (c === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
    .join('');

/**
 * Resolves to `text` with a smooth, staggered decode. Each character settles
 * in turn (left → right) on an eased schedule, while unsettled characters churn
 * through glyphs on a throttled timer so the motion reads as a clean decode
 * rather than random jitter. Starts from a scrambled placeholder — never blank —
 * so it can begin underneath the intro preloader and emerge already in motion.
 * Renders final text immediately for reduced-motion.
 */
export default function ScrambleText({ text, className = '', duration = 950, startDelay = 0 }) {
  const reduced = useReducedMotion();
  const [out, setOut] = useState(() => (reduced ? text : scrambleOf(text)));
  const raf = useRef(0);
  const timer = useRef(0);

  useEffect(() => {
    if (reduced) {
      setOut(text);
      return undefined;
    }

    const chars = Array.from(text);
    const n = chars.length || 1;
    // Window over which each character locks in, eased so it accelerates then settles.
    const lockSpan = duration * 0.82;
    const tail = duration * 0.12; // brief flicker before each char locks
    let glyphs = chars.map(() => GLYPHS[(Math.random() * GLYPHS.length) | 0]);
    let start = 0;
    let lastSwap = 0;

    const step = (now) => {
      if (!start) start = now;
      const elapsed = now - start;

      if (now - lastSwap >= SWAP_MS) {
        lastSwap = now;
        glyphs = glyphs.map((g, i) => (chars[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0]));
      }

      let settled = 0;
      let s = '';
      for (let i = 0; i < n; i += 1) {
        const ch = chars[i];
        if (ch === ' ') {
          s += ' ';
          settled += 1;
          continue;
        }
        // Eased per-character lock time, staggered across the word.
        const lockAt = easeInOut((i + 1) / n) * lockSpan;
        if (elapsed >= lockAt + tail) {
          s += ch;
          settled += 1;
        } else if (elapsed >= lockAt) {
          s += Math.random() > 0.45 ? ch : glyphs[i]; // settle flicker
        } else {
          s += glyphs[i];
        }
      }
      setOut(s);

      if (settled < n) raf.current = requestAnimationFrame(step);
      else setOut(text);
    };

    timer.current = setTimeout(() => {
      raf.current = requestAnimationFrame(step);
    }, startDelay);

    return () => {
      clearTimeout(timer.current);
      cancelAnimationFrame(raf.current);
    };
  }, [text, duration, startDelay, reduced]);

  return <span className={className}>{out || '\u00A0'}</span>;
}
