import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail, Trophy } from 'lucide-react';
import PageTransition from '../components/routing/PageTransition';
import AccentCore from '../components/core/AccentCore';
import MagneticButton from '../components/interactive/MagneticButton';
import ScrambleText from '../components/interactive/ScrambleText';
import MetricsStrip from '../components/sections/MetricsStrip';
import TechMarquee from '../components/sections/TechMarquee';
import Footer from '../components/layout/Footer';
import { useLayout } from '../context/LayoutContext';
import { useReducedMotion } from '../hooks/useReducedMotion';

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function HomePage({ profile }) {
  const reduced = useReducedMotion();
  const { meta } = useLayout();
  const { name, headline, subheadline, contact, about, experience } = profile;
  const current = experience?.[0];

  const animate = (i) => ({
    custom: i,
    initial: reduced ? false : 'hidden',
    animate: 'visible',
    variants: fadeUp,
  });

  return (
    <PageTransition id="home" className="home-page">
      {/* ── Portrait hero ── */}
      <section id="intro" className="home-hero">
        {!reduced && <div className="home-hero-glow" aria-hidden />}
        <div className="section-shell home-hero-grid">
          <div className="home-hero-copy">
            <motion.p {...animate(0)} className="hero-eyebrow">
              <span className="hero-eyebrow-dot" aria-hidden />
              Applied AI Engineer · Waterloo CFM
              <span className="hero-wave" role="img" aria-label="waving hand">👋</span>
            </motion.p>

            <motion.h1 {...animate(1)} className="home-hero-name">
              <ScrambleText
                text={name}
                className={reduced ? '' : 'hero-headline-shimmer'}
                duration={1100}
                startDelay={reduced ? 0 : 1700}
              />
            </motion.h1>

            <motion.p {...animate(2)} className="home-hero-role">
              I build AI systems that meet the real world.
            </motion.p>

            <motion.p {...animate(3)} className="home-hero-lede">
              {subheadline}
            </motion.p>

            <motion.div {...animate(4)} className="home-hero-actions">
              <MagneticButton>
                <Link to="/work" className="btn-primary min-h-[48px] px-6">
                  Explore Work <ArrowUpRight size={16} className="ml-1.5" />
                </Link>
              </MagneticButton>
              <MagneticButton strength={0.3}>
                <Link to="/about" className="btn-ghost min-h-[48px]">
                  About me
                </Link>
              </MagneticButton>
            </motion.div>

            <motion.div {...animate(5)} className="home-hero-social">
              <a href={contact.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github size={18} />
              </a>
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              {contact.devpost && (
                <a href={contact.devpost} target="_blank" rel="noopener noreferrer" aria-label="Devpost">
                  <Trophy size={18} />
                </a>
              )}
              <a href={`mailto:${contact.email}`} aria-label="Email">
                <Mail size={18} />
              </a>
            </motion.div>

            {current && (
              <motion.div {...animate(6)} className="home-currently">
                <span className="home-currently-status">
                  <span className="home-currently-dot" aria-hidden />
                  Currently
                </span>
                <span className="home-currently-text">
                  {current.role.replace(', Contract', '')} @ {current.company}
                </span>
                <span className="home-currently-tag">{headline}</span>
              </motion.div>
            )}
          </div>

          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="home-hero-visual"
          >
            <AccentCore variant={meta.core} />
          </motion.div>
        </div>

        {!reduced && (
          <a href="#about" className="home-scroll">
            <ArrowDown size={14} className="hero-scroll-arrow" />
            <span>About me</span>
          </a>
        )}
      </section>

      {/* ── About me ── */}
      <section id="about" className="home-about">
        <div className="section-shell home-about-grid">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="home-about-head"
          >
            <span className="section-label">Who I am</span>
            <h2 className="home-about-kicker">
              Builder first,<br />demo second.
            </h2>
          </motion.div>

          <div className="home-about-body">
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="home-about-lead"
            >
              {about.main}
            </motion.p>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="home-about-note"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--accent)]">
                Robotics origin
              </span>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{about.robotics}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Impact metrics ── */}
      <MetricsStrip />
      <TechMarquee />

      {/* ── Quiet teaser to work ── */}
      <section className="home-teaser">
        <div className="section-shell flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="section-label">Selected systems</p>
            <h2 className="home-teaser-title">See what I've shipped.</h2>
          </div>
          <MagneticButton>
            <Link to="/work" className="btn-primary min-h-[48px] px-6">
              View all projects <ArrowUpRight size={16} className="ml-1.5" />
            </Link>
          </MagneticButton>
        </div>
      </section>

      <Footer contact={contact} />
    </PageTransition>
  );
}
