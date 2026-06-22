import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Trophy } from 'lucide-react';
import PageTransition from '../components/routing/PageTransition';
import ContactSection from '../components/sections/ContactSection';
import Footer from '../components/layout/Footer';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function ContactPage({ contact }) {
  const reduced = useReducedMotion();

  return (
    <PageTransition id="contact-page" className="contact-page">
      {/* ── Big invitation ── */}
      <header className="contact-hero">
        <div className="section-shell contact-hero-grid">
          <div>
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="section-label"
            >
              Contact
            </motion.p>
            <motion.h1
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="contact-title"
            >
              <span className={reduced ? '' : 'hero-headline-shimmer'}>Let's build something</span>
              <br />
              reliable, useful, and a little impossible.
            </motion.h1>
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="contact-lede"
            >
              Whether it's an agentic workflow, a data product, or a reliability problem that keeps breaking,
              tell me what you're working on.
            </motion.p>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="contact-quick"
            >
              <a href={`mailto:${contact.email}`} className="contact-quick-link">
                <Mail size={16} /> {contact.email}
              </a>
              <a href={contact.github} target="_blank" rel="noopener noreferrer" className="contact-quick-link">
                <Github size={16} /> GitHub
              </a>
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="contact-quick-link">
                <Linkedin size={16} /> LinkedIn
              </a>
              {contact.devpost && (
                <a href={contact.devpost} target="_blank" rel="noopener noreferrer" className="contact-quick-link">
                  <Trophy size={16} /> Devpost
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </header>

      <ContactSection contact={contact} variant="editorial" index="01" />

      <Footer contact={contact} />
    </PageTransition>
  );
}
