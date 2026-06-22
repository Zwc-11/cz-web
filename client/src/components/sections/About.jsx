import { motion } from 'framer-motion';

export default function About({ about }) {
  return (
    <section id="about" className="relative z-10 py-16 sm:py-24">
      <div className="section-shell">
        <p className="section-label">About</p>
        <h2 className="section-title">Builder first, demo second</h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10 grid gap-6 lg:grid-cols-2"
        >
          <div className="glass rounded-2xl p-6 sm:p-8">
            <p className="text-base leading-relaxed text-white/65">{about.main}</p>
          </div>
          <div className="glass rounded-2xl border-[var(--accent-soft)] p-6 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent)]">Robotics</p>
            <p className="mt-4 text-base leading-relaxed text-white/65">{about.robotics}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
