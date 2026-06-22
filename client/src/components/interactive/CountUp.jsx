import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Counts up to `value` once it scrolls into view. Supports decimals, prefixes,
 * and suffixes. Falls back to the final value immediately for reduced motion.
 */
export default function CountUp({
  value,
  decimals = 0,
  duration = 1.6,
  prefix = '',
  suffix = '',
}) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }

    const node = ref.current;
    if (!node) return;

    let raf = 0;
    let started = false;

    const run = () => {
      const start = performance.now();
      const animate = (now) => {
        const elapsed = (now - start) / 1000;
        const t = Math.min(elapsed / duration, 1);
        // easeOutExpo for a snappy, premium settle
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        setDisplay(value * eased);
        if (t < 1) raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            run();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration, reduced]);

  const formatted = display.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
