import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import AccentCore from '../core/AccentCore';
import MagneticButton from '../interactive/MagneticButton';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero({ profile, core = 'loom' }) {
  const reduced = useReducedMotion();
  const { name, headline, subheadline, contact } = profile;

  return (
    <section id="hero" className="hero-section">
      <div className="section-shell hero-grid">
        <div className="hero-copy">
          <motion.p
            custom={0}
            initial={reduced ? false : 'hidden'}
            animate="visible"
            variants={fadeUp}
            className="hero-eyebrow"
          >
            <span className="hero-eyebrow-dot" aria-hidden />
            {name}
          </motion.p>
          <motion.h1
            custom={1}
            initial={reduced ? false : 'hidden'}
            animate="visible"
            variants={fadeUp}
            className="hero-headline"
          >
            <span className={reduced ? '' : 'hero-headline-shimmer'}>{headline}</span>
          </motion.h1>
          <motion.p
            custom={2}
            initial={reduced ? false : 'hidden'}
            animate="visible"
            variants={fadeUp}
            className="hero-lede"
          >
            {subheadline}
          </motion.p>
          <motion.div
            custom={3}
            initial={reduced ? false : 'hidden'}
            animate="visible"
            variants={fadeUp}
            className="hero-actions"
          >
            <MagneticButton>
              <a href="#work" className="btn-primary min-h-[48px] px-6">
                View Projects
              </a>
            </MagneticButton>
            <MagneticButton strength={0.3}>
              <a href={contact.github} target="_blank" rel="noopener noreferrer" className="btn-ghost min-h-[48px]">
                <Github size={16} /> GitHub
              </a>
            </MagneticButton>
            <MagneticButton strength={0.3}>
              <a href="#contact" className="btn-ghost min-h-[48px]">
                Contact
              </a>
            </MagneticButton>
          </motion.div>
          <motion.div
            custom={4}
            initial={reduced ? false : 'hidden'}
            animate="visible"
            variants={fadeUp}
            className="hero-social"
          >
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href={`mailto:${contact.email}`} aria-label="Email">
              <Mail size={18} />
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="hero-visual"
        >
          <AccentCore variant={core} />
        </motion.div>
      </div>

      {!reduced && (
        <a href="#proof" className="hero-scroll section-shell">
          <ArrowDown size={14} className="hero-scroll-arrow" />
          Scroll
        </a>
      )}
    </section>
  );
}
