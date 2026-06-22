import { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import MurmurTraceVisual from '../visuals/MurmurTraceVisual';
import MarketFlowVisual from '../visuals/MarketFlowVisual';
import ChaosGraphVisual from '../visuals/ChaosGraphVisual';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const VISUALS = {
  trace: MurmurTraceVisual,
  flow: MarketFlowVisual,
  graph: ChaosGraphVisual,
};

export default function ProjectCard({ project, index, variant = 'module', className = '', detailTo }) {
  const Visual = VISUALS[project.visual] || MurmurTraceVisual;
  const featured = variant === 'featured';
  const reduced = useReducedMotion();
  const ref = useRef(null);

  const repoPath =
    project.link && project.link.includes('github.com/')
      ? project.link.split('github.com/')[1].replace(/\/$/, '')
      : null;

  // Pointer-tracked tilt + glow position
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const sRotateX = useSpring(rotateX, { stiffness: 180, damping: 18 });
  const sRotateY = useSpring(rotateY, { stiffness: 180, damping: 18 });

  const glowBg = useMotionTemplate`radial-gradient(420px circle at ${glowX}% ${glowY}%, rgba(var(--accent-rgb), 0.16), transparent 60%)`;

  const handleMove = (e) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 9);
    rotateX.set((0.5 - py) * 9);
    glowX.set(px * 100);
    glowY.set(py * 100);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glowX.set(50);
    glowY.set(50);
  };

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`project-card-shell ${className}`}
      style={{ perspective: 1000 }}
    >
      <motion.article
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={reduced ? undefined : { rotateX: sRotateX, rotateY: sRotateY, transformStyle: 'preserve-3d' }}
        className="ui-panel ui-panel-hover project-card flex h-full flex-col"
      >
        {/* Pointer-following accent glow */}
        {!reduced && (
          <motion.div
            className="project-card-glow pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300"
            style={{ background: glowBg }}
            aria-hidden
          />
        )}

        <div className={`relative overflow-hidden border-b border-white/[0.06] ${project.image ? 'project-card-ghmedia' : 'bg-black/50'} ${featured ? 'aspect-[21/10]' : 'aspect-[16/10]'}`}>
          {project.image ? (
            <div className="gh-chrome">
              <div className="gh-chrome-bar">
                <span className="gh-dot gh-dot--r" aria-hidden />
                <span className="gh-dot gh-dot--y" aria-hidden />
                <span className="gh-dot gh-dot--g" aria-hidden />
                <span className="gh-url">github.com/{repoPath || 'Zwc-11'}</span>
                <span className="gh-num">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className="gh-chrome-body">
                <img
                  src={project.image}
                  alt={`${project.name}, ${project.subtitle}`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-contain p-4 sm:p-5"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="absolute inset-0 [&_canvas]:!h-full [&_canvas]:!w-full [&_svg]:!h-full [&_svg]:!w-full">
                <Visual />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
              <span className="absolute left-3 top-3 geo-index scale-90 bg-base/80 text-[var(--accent)]">
                {String(index + 1).padStart(2, '0')}
              </span>
            </>
          )}
        </div>

        <div className="relative z-20 flex flex-1 flex-col p-5">
          <div className="min-w-0">
            <h3 className="text-lg font-medium text-white">{project.name}</h3>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/40">
              {project.subtitle}
            </p>
          </div>

          <p className="mt-3 flex-1 text-sm leading-relaxed text-white/55">{project.description}</p>

          <ul className="mt-4 space-y-1.5 border-t border-white/[0.06] pt-4">
            {project.highlights.slice(0, 4).map((h) => (
              <li key={h} className="flex items-center gap-2 text-[11px] text-white/50">
                <span className="h-1.5 w-1.5 shrink-0 bg-[var(--accent)]" />
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tech.slice(0, 5).map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>

          {detailTo && (
            <span className="project-card-cta mt-5 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">
              Read case study <ArrowUpRight size={13} />
            </span>
          )}
        </div>

        {/* Centered hover-reveal: opens the GitHub repo (sits above the stretched link) */}
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="project-card-extlink"
            aria-label={`Open ${project.name} on GitHub`}
          >
            <ExternalLink size={14} />
            <span>View repo</span>
          </a>
        )}

        {/* Stretched link makes the whole card open the case study */}
        {detailTo && (
          <Link
            to={detailTo}
            className="absolute inset-0 z-30"
            aria-label={`View ${project.name} case study`}
          />
        )}
      </motion.article>
    </motion.div>
  );
}
