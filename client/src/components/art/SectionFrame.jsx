import { motion } from 'framer-motion';

export default function SectionFrame({ id, chapter, title, subtitle, children, className = '' }) {
  return (
    <section id={id} className={`relative ${className}`}>
      <div className="section-shell relative">
        <span
          className="pointer-events-none absolute -left-2 top-0 select-none font-mono text-[7rem] font-medium leading-none text-white/[0.03] sm:text-[9rem]"
          aria-hidden
        >
          {chapter}
        </span>

        <div className="art-frame relative mb-10 sm:mb-12">
          <span className="frame-corner frame-corner-tl" aria-hidden />
          <span className="frame-corner frame-corner-tr" aria-hidden />
          <span className="frame-corner frame-corner-bl" aria-hidden />
          <span className="frame-corner frame-corner-br" aria-hidden />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="section-label">{chapter} — {title}</p>
            {subtitle && (
              <h2 className="section-title max-w-3xl">{subtitle}</h2>
            )}
          </motion.div>
        </div>

        {children}
      </div>
    </section>
  );
}
