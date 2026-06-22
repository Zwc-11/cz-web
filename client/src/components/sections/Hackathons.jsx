import { motion } from 'framer-motion';
import { Award, ExternalLink, Github, Play, Rocket, Users } from 'lucide-react';
import GridSection from '../art/GridSection';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function Hackathons({ hackathons, variant = 'editorial', index = '04' }) {
  const reduced = useReducedMotion();
  if (!hackathons?.length) return null;

  return (
    <GridSection
      id="hackathons"
      index={index}
      title="Hackathons"
      subtitle="Built fast, under pressure, with a team"
      variant={variant}
      aside={
        <p className="text-sm leading-relaxed text-white/45">
          Weekend builds where hardware, vision, and software all have to work at once. Where the robotics
          instinct really shows.
        </p>
      }
    >
      <div className="hack-grid">
        {hackathons.map((h, i) => (
          <motion.article
            key={h.id}
            initial={reduced ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="ui-panel ui-panel-hover hack-card"
          >
            <div className="hack-card-media">
              {h.image ? (
                <img src={h.image} alt={`${h.name}, ${h.tagline}`} loading="lazy" />
              ) : (
                <div className="hack-card-media-placeholder">
                  <span>{h.event}</span>
                </div>
              )}
              <div className="hack-card-media-fade" />
              <span className="hack-card-event">{h.event}</span>
              {h.award && (
                <span className="hack-card-award">
                  <Award size={12} /> {h.award}
                </span>
              )}
            </div>

            <div className="hack-card-body">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-medium text-white">{h.name}</h3>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/40">
                    {h.tagline}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">
                  {h.date}
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-white/55">{h.description}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {h.tech.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>

              {h.team?.length > 0 && (
                <p className="mt-4 flex items-center gap-2 text-[11px] text-white/35">
                  <Users size={12} /> {h.team.join(' · ')}
                </p>
              )}

              {(h.devpost || h.github || h.dorahacks || h.youtube) && (
                <div className="mt-5 flex flex-wrap gap-2 border-t border-white/[0.06] pt-4">
                  {h.devpost && (
                    <a href={h.devpost} target="_blank" rel="noopener noreferrer" className="btn-ghost min-h-[40px] text-xs">
                      <ExternalLink size={14} /> Devpost
                    </a>
                  )}
                  {h.dorahacks && (
                    <a href={h.dorahacks} target="_blank" rel="noopener noreferrer" className="btn-ghost min-h-[40px] text-xs">
                      <Rocket size={14} /> DoraHacks
                    </a>
                  )}
                  {h.github && (
                    <a href={h.github} target="_blank" rel="noopener noreferrer" className="btn-ghost min-h-[40px] text-xs">
                      <Github size={14} /> Code
                    </a>
                  )}
                  {h.youtube && (
                    <a href={h.youtube} target="_blank" rel="noopener noreferrer" className="btn-ghost min-h-[40px] text-xs">
                      <Play size={14} /> Demo
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </GridSection>
  );
}
