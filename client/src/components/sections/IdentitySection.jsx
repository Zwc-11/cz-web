import { motion } from 'framer-motion';
import GridSection from '../art/GridSection';

export default function IdentitySection({ about, skills, variant = 'split', index = '04' }) {
  return (
    <GridSection
      id="identity"
      index={index}
      title="Self"
      subtitle="Builder first, demo second"
      variant={variant}
    >
      <div className="module-grid lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="ui-panel p-6 sm:p-8 lg:col-span-2"
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/35">About</p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/65">{about.main}</p>
          <div className="mt-6 border-t border-white/[0.06] pt-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent)]">
              Robotics
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">{about.robotics}</p>
          </div>
        </motion.div>

        {skills.map((group, gi) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: gi * 0.05 }}
            className="ui-panel p-5"
          >
            <h3 className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">
              {group.title}
            </h3>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {group.items.map((skill) => (
                <span key={skill} className="chip">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </GridSection>
  );
}
