import { motion } from 'framer-motion';

const SIZE_CLASSES = {
  0: 'text-sm px-3 py-1.5',
  1: 'text-xs px-2.5 py-1',
  2: 'text-[11px] px-2 py-1',
};

export default function SkillCloud({ skills }) {
  return (
    <section id="skills" className="relative z-10 py-16 sm:py-24">
      <div className="section-shell">
        <p className="section-label">Skills</p>
        <h2 className="section-title">Tooling across the stack</h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group, gi) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: gi * 0.06, duration: 0.45 }}
              className="glass rounded-xl p-5"
            >
              <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--accent)]">
                {group.title}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((skill, si) => (
                  <span
                    key={skill}
                    className={`rounded-full border border-white/10 bg-white/[0.03] font-mono text-white/50 ${SIZE_CLASSES[si % 3]}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
