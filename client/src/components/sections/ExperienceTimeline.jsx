import { motion } from 'framer-motion';
import GridSection from '../art/GridSection';

export default function ExperienceTimeline({ experience, variant = 'split', index = '03' }) {
  return (
    <GridSection
      id="experience"
      index={index}
      title="Path"
      subtitle="Where signals became software"
      variant={variant}
    >
      <div className="relative border-l border-white/10 pl-6 sm:pl-8">
        <div className="space-y-px bg-white/[0.06]">
          {experience.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
              className="relative bg-surface"
            >
              <span
                className="absolute -left-[calc(1.5rem+5px)] top-6 h-2.5 w-2.5 border border-[var(--accent)] bg-base sm:-left-[calc(2rem+5px)]"
                aria-hidden
              />

              <div className="ui-panel border-0 border-b border-white/[0.06] p-5 sm:p-6">
                <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-white/30">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-base font-medium text-white">{item.role}</h3>
                    </div>
                    <p className="mt-1 text-sm text-[var(--accent)]">{item.company}</p>
                    {item.type && (
                      <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">{item.type}</p>
                    )}
                    <p className="text-[11px] text-white/35">{item.location}</p>
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-white/35 sm:text-right">
                    {item.period}
                  </p>
                </div>

                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2 text-sm leading-relaxed text-white/55">
                      <span className="mt-2 h-px w-3 shrink-0 bg-white/20" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </GridSection>
  );
}
