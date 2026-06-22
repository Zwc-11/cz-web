import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLayout } from '../../context/LayoutContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Plays a quick accent light-sweep across the viewport whenever the atmosphere
 * (theme) changes. Skips the first render and reduced-motion.
 */
export default function ThemeTransition() {
  const { layout } = useLayout();
  const reduced = useReducedMotion();
  const first = useRef(true);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setKey((k) => k + 1);
  }, [layout]);

  if (reduced || key === 0) return null;

  return (
    <motion.div
      key={key}
      className="theme-sweep"
      aria-hidden
      initial={{ x: '-100%' }}
      animate={{ x: '100%' }}
      transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
    />
  );
}
