import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import PageTransition from '../components/routing/PageTransition';
import ExperienceTimeline from '../components/sections/ExperienceTimeline';
import Credentials from '../components/sections/Credentials';
import IdentitySection from '../components/sections/IdentitySection';
import ProofStrip from '../components/sections/ProofStrip';
import Footer from '../components/layout/Footer';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function AboutPage({ profile }) {
  const reduced = useReducedMotion();
  const { name, photo, about, experience, skills, proofStrip, education, awards, contact } = profile;

  return (
    <PageTransition id="about" className="about-page">
      {/* ── Manifesto intro ── */}
      <header className="about-intro">
        <div className="section-shell">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="about-portrait-row"
          >
            {photo && (
              <span className="about-portrait">
                <img src={photo} alt={name} loading="eager" />
              </span>
            )}
            <div>
              <p className="section-label">About</p>
              <h1 className="about-statement">
                I build systems where AI, data, and software meet the real world, and keep working long after the
                demo.
              </h1>
            </div>
          </motion.div>

          <div className="about-intro-grid">
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="about-intro-lead"
            >
              {about.main}
            </motion.p>
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="about-intro-aside"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--accent)]">
                Where it started
              </span>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{about.robotics}</p>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="about-sections">
        <ExperienceTimeline experience={experience} variant="editorial" index="01" />
        <Credentials education={education} awards={awards} variant="editorial" index="02" />
        <IdentitySection about={about} skills={skills} variant="editorial" index="03" />
        <ProofStrip items={proofStrip} variant="editorial" index="04" />
      </div>

      {/* ── CTA ── */}
      <section className="about-outro">
        <div className="section-shell flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="about-outro-text">Curious how any of this was built?</p>
          <div className="flex gap-3">
            <Link to="/work" className="btn-ghost min-h-[48px]">
              See the work
            </Link>
            <Link to="/contact" className="btn-primary min-h-[48px] px-6">
              Get in touch <ArrowUpRight size={16} className="ml-1.5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer contact={contact} />
    </PageTransition>
  );
}
