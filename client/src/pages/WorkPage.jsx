import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import PageTransition from '../components/routing/PageTransition';
import ProjectCard from '../components/cards/ProjectCard';
import Hackathons from '../components/sections/Hackathons';
import Footer from '../components/layout/Footer';
import { useData } from '../context/DataContext';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function WorkPage({ projects }) {
  const reduced = useReducedMotion();
  const { profile } = useData();
  const hackathons = profile?.hackathons || [];

  return (
    <PageTransition id="work" className="work-page">
      {/* ── Masthead ── */}
      <header className="work-masthead">
        <div className="section-shell">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="section-label"
          >
            Selected work · {String(projects.length).padStart(2, '0')} systems
          </motion.p>

          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="work-masthead-title"
          >
            Systems with distinct failure modes
            <br />
            and evaluation discipline.
          </motion.h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="work-masthead-lede"
          >
            Agent harness, toxic-flow detection, leakage-safe reranking. Each one started as a reliability or
            data problem and turned into something measurable. Open a card to read the full case study.
          </motion.p>
        </div>
      </header>

      {/* ── Project index ── */}
      <section id="projects" className="work-gallery">
        <div className="section-shell">
          <div className="work-grid-uniform">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                detailTo={`/work/${project.id}`}
                variant="module"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Hackathons ── */}
      <div className="work-hack">
        <Hackathons hackathons={hackathons} variant="editorial" index="04" />
      </div>

      {/* ── Closing CTA ── */}
      <section className="work-outro">
        <div className="section-shell flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="work-outro-text">
            Want the story behind a build, or something new made reliable?
          </p>
          <Link to="/contact" className="btn-primary min-h-[48px] px-6">
            Start a conversation <ArrowUpRight size={16} className="ml-1.5" />
          </Link>
        </div>
      </section>

      <Footer contact={profile.contact} />
    </PageTransition>
  );
}
