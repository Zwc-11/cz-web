import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const variants = {
  initial: { opacity: 0, y: 18, filter: 'blur(6px)' },
  enter: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -14,
    filter: 'blur(4px)',
    transition: { duration: 0.32, ease: [0.4, 0, 1, 1] },
  },
};

/**
 * Wraps each routed page so it animates in/out under AnimatePresence.
 * `variant` lets each page declare a distinct top-level frame class.
 */
export default function PageTransition({ children, className = '', id }) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <main id={id} className={`route-page ${className}`}>
        {children}
      </main>
    );
  }

  return (
    <motion.main
      id={id}
      className={`route-page ${className}`}
      variants={variants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {children}
    </motion.main>
  );
}
