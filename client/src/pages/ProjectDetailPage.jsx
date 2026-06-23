import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Github,
  Star,
  Scale,
  GitBranch,
  Clock,
  Terminal,
} from 'lucide-react';
import PageTransition from '../components/routing/PageTransition';
import Footer from '../components/layout/Footer';
import MurmurTraceVisual from '../components/visuals/MurmurTraceVisual';
import MarketFlowVisual from '../components/visuals/MarketFlowVisual';
import ChaosGraphVisual from '../components/visuals/ChaosGraphVisual';
import { useData } from '../context/DataContext';
import { useReducedMotion } from '../hooks/useReducedMotion';

const VISUALS = {
  trace: MurmurTraceVisual,
  flow: MarketFlowVisual,
  graph: ChaosGraphVisual,
};

// Stable, readable colors for the language breakdown bar.
const LANG_COLORS = {
  Python: '#3776ab',
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  HTML: '#e34c26',
  CSS: '#563d7c',
  'Jupyter Notebook': '#da5b0b',
  Makefile: '#427819',
  Shell: '#89e051',
};

function langColor(name, i) {
  return LANG_COLORS[name] || `hsl(${(i * 67 + 190) % 360} 70% 60%)`;
}

function NotFound() {
  return (
    <PageTransition id="work-detail" className="detail-page">
      <div className="section-shell flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">404</p>
        <h1 className="mt-3 text-3xl font-medium text-white">Project not found</h1>
        <Link to="/work" className="btn-ghost mt-8 min-h-[48px]">
          <ArrowLeft size={16} /> Back to work
        </Link>
      </div>
    </PageTransition>
  );
}

/** Interactive screenshot gallery — main frame + selectable thumbnails. */
function Gallery({ project, Visual }) {
  const [active, setActive] = useState(0);
  const shots = project.screenshots || [];

  if (shots.length === 0) {
    return (
      <div className="detail-visual">
        <div className="absolute inset-0 [&_canvas]:!h-full [&_canvas]:!w-full [&_svg]:!h-full [&_svg]:!w-full">
          <Visual />
        </div>
        <div className="detail-visual-fade" />
      </div>
    );
  }

  const current = shots[active];
  return (
    <div>
      <figure className="detail-shot">
        <div className="detail-shot-chrome" aria-hidden>
          <span className="gh-dot gh-dot--r" />
          <span className="gh-dot gh-dot--y" />
          <span className="gh-dot gh-dot--g" />
          <span className="detail-shot-url">{project.liveUrl || project.link.replace('https://', '')}</span>
        </div>
        <div className="detail-shot-stage">
          <img key={current.src} src={current.src} alt={current.caption} className="detail-shot-img" />
        </div>
      </figure>
      {current.caption && <p className="detail-shot-caption">{current.caption}</p>}

      {shots.length > 1 && (
        <div className="detail-thumbs">
          {shots.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setActive(i)}
              className={`detail-thumb ${i === active ? 'detail-thumb--active' : ''}`}
              aria-label={`View screenshot ${i + 1}`}
              aria-pressed={i === active}
            >
              <img src={s.src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Real GitHub language breakdown rendered as a stacked bar + legend. */
function LanguageBar({ languages }) {
  if (!languages || languages.length === 0) return null;
  const total = languages.reduce((sum, l) => sum + l.bytes, 0);
  const withPct = languages.map((l, i) => ({
    ...l,
    pct: (l.bytes / total) * 100,
    color: langColor(l.name, i),
  }));

  return (
    <div className="detail-meta-card">
      <span className="detail-block-label">Languages</span>
      <div className="detail-langbar" role="img" aria-label="Language breakdown">
        {withPct.map((l) => (
          <span key={l.name} style={{ width: `${l.pct}%`, background: l.color }} />
        ))}
      </div>
      <ul className="detail-langlegend">
        {withPct.map((l) => (
          <li key={l.name}>
            <span className="detail-langdot" style={{ background: l.color }} />
            {l.name}
            <span className="detail-langpct">{l.pct.toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProjectDetailPage({ projects }) {
  const { id } = useParams();
  const reduced = useReducedMotion();
  const { profile } = useData();

  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return <NotFound />;

  const project = projects[index];
  const Visual = VISUALS[project.visual] || MurmurTraceVisual;
  const meta = project.repoMeta || {};
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  const reveal = (delay = 0) => ({
    initial: reduced ? false : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <PageTransition id="work-detail" className="detail-page">
      <div className="section-shell">
        <Link to="/work" className="detail-back">
          <ArrowLeft size={14} /> All work
        </Link>
      </div>

      {/* ── Title block ── */}
      <header className="detail-header section-shell">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="detail-eyebrow">
            <span className="detail-eyebrow-index">{String(index + 1).padStart(2, '0')}</span>
            {project.role || project.subtitle}
          </p>
          <h1 className="detail-title">
            <span className={reduced ? '' : 'hero-headline-shimmer'}>{project.name}</span>
          </h1>
          <p className="detail-subtitle">{project.subtitle}</p>

          {/* Repo stats strip — real GitHub metadata */}
          <div className="detail-repostrip">
            {meta.stars != null && (
              <span className="detail-repostat"><Star size={13} /> {meta.stars} stars</span>
            )}
            {meta.primaryLanguage && (
              <span className="detail-repostat">
                <span className="detail-langdot" style={{ background: langColor(meta.primaryLanguage, 0) }} />
                {meta.primaryLanguage}
              </span>
            )}
            {meta.license && (
              <span className="detail-repostat"><Scale size={13} /> {meta.license}</span>
            )}
            {meta.branch && (
              <span className="detail-repostat"><GitBranch size={13} /> {meta.branch}</span>
            )}
            {meta.updated && (
              <span className="detail-repostat"><Clock size={13} /> Updated {meta.updated}</span>
            )}
          </div>
        </motion.div>
      </header>

      {/* ── Hero gallery / demo screenshots ── */}
      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="detail-visual-wrap section-shell"
      >
        <Gallery project={project} Visual={Visual} />
      </motion.div>

      {/* ── Metrics strip ── */}
      {project.metrics?.length > 0 && (
        <section className="section-shell">
          <div className="detail-metrics">
            {project.metrics.map((m) => (
              <div key={m.label} className="detail-metric">
                <span className="detail-metric-value">{m.value}</span>
                <span className="detail-metric-label">{m.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Body: narrative + meta ── */}
      <section className="detail-body section-shell">
        <div className="detail-grid">
          <div className="detail-narrative">
            <motion.p {...reveal(0)} className="detail-lead">
              {project.overview || project.description}
            </motion.p>

            {project.challenge && (
              <motion.div {...reveal(0.05)} className="detail-block">
                <span className="detail-block-label">The problem</span>
                <p>{project.challenge}</p>
              </motion.div>
            )}
            {project.approach && (
              <motion.div {...reveal(0.1)} className="detail-block">
                <span className="detail-block-label">The approach</span>
                <p>{project.approach}</p>
              </motion.div>
            )}
            {project.outcome && (
              <motion.div {...reveal(0.15)} className="detail-block">
                <span className="detail-block-label">The outcome</span>
                <p>{project.outcome}</p>
              </motion.div>
            )}
          </div>

          <motion.aside {...reveal(0.1)} className="detail-meta">
            <div className="detail-meta-card">
              <span className="detail-block-label">Highlights</span>
              <ul className="mt-4 space-y-2.5">
                {project.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-sm text-white/65">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-[var(--accent)]" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            <div className="detail-meta-card">
              <span className="detail-block-label">Stack</span>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <LanguageBar languages={project.languages} />

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full min-h-[48px]"
              >
                <ArrowUpRight size={16} className="mr-2" /> Open live demo
              </a>
            )}
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`${project.liveUrl ? 'btn-ghost' : 'btn-primary'} w-full min-h-[48px]`}
            >
              <Github size={16} className="mr-2" /> View source
            </a>
          </motion.aside>
        </div>
      </section>

      {/* ── Under the hood: feature grid ── */}
      {project.features?.length > 0 && (
        <section className="detail-section section-shell">
          <motion.span {...reveal(0)} className="detail-block-label">
            Under the hood
          </motion.span>
          <div className="detail-features">
            {project.features.map((f, i) => (
              <motion.div key={f} {...reveal(0.04 * i)} className="detail-feature">
                <span className="detail-feature-num">{String(i + 1).padStart(2, '0')}</span>
                <p>{f}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── Commands / run it ── */}
      {project.commands?.length > 0 && (
        <section className="detail-section section-shell">
          <motion.span {...reveal(0)} className="detail-block-label">
            Run it
          </motion.span>
          <motion.div {...reveal(0.05)} className="detail-terminal">
            <div className="detail-terminal-bar" aria-hidden>
              <Terminal size={13} />
              <span>shell</span>
            </div>
            <pre className="detail-terminal-body">
              {project.commands.map((c) => (
                <code key={c} className="detail-terminal-line">
                  <span className="detail-terminal-prompt">$</span> {c}
                </code>
              ))}
            </pre>
          </motion.div>
        </section>
      )}

      {/* ── Topics ── */}
      {project.topics?.length > 0 && (
        <section className="detail-section section-shell">
          <span className="detail-block-label">Topics</span>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.topics.map((t) => (
              <span key={t} className="chip">#{t}</span>
            ))}
          </div>
        </section>
      )}

      {/* ── Prev / Next ── */}
      <nav className="detail-nav section-shell">
        <Link to={`/work/${prev.id}`} className="detail-nav-link detail-nav-prev">
          <span className="detail-nav-dir">
            <ArrowLeft size={14} /> Previous
          </span>
          <span className="detail-nav-name">{prev.name}</span>
        </Link>
        <Link to={`/work/${next.id}`} className="detail-nav-link detail-nav-next">
          <span className="detail-nav-dir">
            Next <ArrowRight size={14} />
          </span>
          <span className="detail-nav-name">{next.name}</span>
        </Link>
      </nav>

      <Footer contact={profile.contact} />
    </PageTransition>
  );
}
