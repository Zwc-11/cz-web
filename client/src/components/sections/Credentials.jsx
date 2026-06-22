import { motion } from 'framer-motion';
import { GraduationCap, Trophy } from 'lucide-react';
import GridSection from '../art/GridSection';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function Credentials({ education = [], awards = [], variant = 'editorial', index = '02' }) {
  const reduced = useReducedMotion();
  if (!education.length && !awards.length) return null;

  const reveal = (i) => ({
    initial: reduced ? false : { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <GridSection
      id="education"
      index={index}
      title="Education & Honors"
      subtitle="Where the foundations come from"
      variant={variant}
    >
      <div className="cred-grid">
        {/* Education */}
        <div className="cred-col">
          <p className="cred-col-label">
            <GraduationCap size={14} className="text-[var(--accent)]" /> Education
          </p>
          <div className="mt-4 space-y-3">
            {education.map((e, i) => (
              <motion.div key={e.id} {...reveal(i)} className="ui-panel p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-base font-medium text-white">{e.school}</h3>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-white/40">
                    {e.period}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--accent)]">{e.credential}</p>
                {e.note && <p className="mt-2 text-[13px] leading-relaxed text-white/50">{e.note}</p>}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Honors & awards */}
        <div className="cred-col">
          <p className="cred-col-label">
            <Trophy size={14} className="text-[var(--accent)]" /> Honors & Awards
          </p>
          <div className="mt-4 space-y-3">
            {awards.map((a, i) => (
              <motion.div key={a.id} {...reveal(i)} className="ui-panel p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-sm font-medium leading-snug text-white">{a.title}</h3>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-white/40">
                    {a.date}
                  </span>
                </div>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/40">{a.issuer}</p>
                {a.note && <p className="mt-2 text-[13px] leading-relaxed text-white/50">{a.note}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </GridSection>
  );
}
