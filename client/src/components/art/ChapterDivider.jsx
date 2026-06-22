import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function ChapterDivider({ label }) {
  const reduced = useReducedMotion();

  return (
    <div className="relative py-10 sm:py-14" aria-hidden>
      <div className="section-shell flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-[var(--accent)]" />
        {label && (
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
            {label}
          </span>
        )}
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/10 to-[var(--accent)]" />
      </div>

      <svg
        viewBox="0 0 1200 40"
        className="section-shell mt-4 h-8 w-full opacity-40"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,20 Q150,5 300,20 T600,20 T900,20 T1200,20"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1"
          initial={reduced ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <motion.path
          d="M0,22 Q200,35 400,22 T800,22 T1200,22"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.5"
          initial={reduced ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 0.1, ease: 'easeOut' }}
        />
      </svg>
    </div>
  );
}
