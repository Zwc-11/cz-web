import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&$@/<>*';

/**
 * Resolves to `text` with a decode/scramble animation. Optional `startDelay`
 * lets it begin after the intro preloader lifts. Renders final text for
 * reduced-motion.
 */
export default function ScrambleText({ text, className = '', duration = 1100, startDelay = 0 }) {
  const reduced = useReducedMotion();
  const [out, setOut] = useState(reduced ? text : '');
  const raf = useRef(0);

  useEffect(() => {
    if (reduced) {
      setOut(text);
      return undefined;
    }

    let start = 0;
    let kickoff = 0;

    const step = (now) => {
      if (!start) start = now;
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const revealed = Math.floor(progress * text.length);

      let s = '';
      for (let i = 0; i < text.length; i += 1) {
        if (text[i] === ' ') s += ' ';
        else if (i < revealed) s += text[i];
        else s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOut(s);

      if (progress < 1) raf.current = requestAnimationFrame(step);
      else setOut(text);
    };

    kickoff = setTimeout(() => {
      raf.current = requestAnimationFrame(step);
    }, startDelay);

    return () => {
      clearTimeout(kickoff);
      cancelAnimationFrame(raf.current);
    };
  }, [text, duration, startDelay, reduced]);

  return <span className={className}>{out || '\u00A0'}</span>;
}
