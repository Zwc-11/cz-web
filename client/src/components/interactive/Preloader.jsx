import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * A short, slick intro shown on first load: a CZ monogram over a filling
 * progress line, then the whole panel slides up to reveal the site.
 * Skipped entirely for reduced-motion.
 */
export default function Preloader() {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => setDone(true), 1700);
    return () => clearTimeout(t);
  }, [reduced]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="preloader"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="preloader-inner">
            <motion.span
              className="preloader-mark"
              initial={{ opacity: 0, letterSpacing: '0.6em' }}
              animate={{ opacity: 1, letterSpacing: '0.18em' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              CZ
            </motion.span>
            <div className="preloader-bar">
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <motion.span
              className="preloader-tag"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Caesar Zhou
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
