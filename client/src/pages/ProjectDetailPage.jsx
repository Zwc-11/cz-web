import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from 'lucide-react';
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

/** Extended narrative per project, the case-study spine. */
const CASE_STUDIES = {
  murmur: {
    role: 'Solo build · open source',
    challenge:
      'Coding agents are non-deterministic. The same task can pass once and fail the next five times, and there was no clean way to measure or trust that behaviour.',
    approach:
      'I built a harness that fans a single task out into many independent attempts, traces each run end to end, and records artifacts so any failure can be replayed exactly. Ranking surfaces the attempts worth keeping.',
    outcome:
      'pass@1 and pass@k reliability reports that run right inside GitHub Actions, backed by 29 test modules and 30-attempt fan-out runs. Reliability finally became something you can put a number on.',
  },
  marketimmune: {
    role: 'Full-stack ML platform',
    challenge:
      'On-chain perpetual markets are full of adverse selection. Some order flow is "toxic" and quietly bleeds market makers, but it hides inside ordinary-looking trades.',
    approach:
      'I streamed Hyperliquid market data, engineered markout-based labels, and trained a CatBoost risk model with strict leakage-safe evaluation and MLflow tracking across the whole pipeline.',
    outcome:
      '0.769 PR-AUC and 0.758 ROC-AUC out of sample, which worked out to a 15 bps markout lift. That is a real edge on flow nobody else was filtering.',
  },
  chaoswing: {
    role: 'Retrieval & ranking research',
    challenge:
      'Ranking prediction-market questions by relevance is surprisingly easy to fake, and even easier to accidentally leak future information into the evaluation.',
    approach:
      'Top-100 candidate retrieval feeds a cross-encoder reranker over 0-3 graded relevance labels, with temporal lead-lag signals and a strict time-based split that refuses to peek ahead.',
    outcome:
      'Scored with NDCG@5, MRR, and Recall@100 under a leakage-safe protocol, so the numbers reflect real ranking quality rather than hindsight.',
  },
  'quant-portfolio': {
    role: 'Waterloo CFM final · team build',
    challenge:
      'The competition only releases the ticker set after the contest, so you cannot hand-pick winners in advance. You need a repeatable way to choose and size a portfolio that holds up over a tracked week.',
    approach:
      'I pulled market data and ran Monte Carlo simulations over CAPM expected returns and Modern Portfolio Theory risk, scoring each stock on volatility and risk-adjusted return, then equally weighting the survivors to diversify.',
    outcome:
      'The program outputs the selected stocks and exact share counts — accounting for currency conversion and trading costs — as a ready-to-submit CSV for the TA-tracked simulated portfolio.',
  },
};

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

export default function ProjectDetailPage({ projects }) {
  const { id } = useParams();
  const reduced = useReducedMotion();
  const { profile } = useData();

  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return <NotFound />;

  const project = projects[index];
  const Visual = VISUALS[project.visual] || MurmurTraceVisual;
  const study = CASE_STUDIES[project.id] || {};
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
            {study.role || project.subtitle}
          </p>
          <h1 className="detail-title">
            <span className={reduced ? '' : 'hero-headline-shimmer'}>{project.name}</span>
          </h1>
          <p className="detail-subtitle">{project.subtitle}</p>
        </motion.div>
      </header>

      {/* ── Hero visual ── */}
      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="detail-visual-wrap section-shell"
      >
        <div className="detail-visual">
          {project.image ? (
            <img
              src={project.image}
              alt={`${project.name}, ${project.subtitle}`}
              className="absolute inset-0 h-full w-full object-contain p-8 sm:p-12"
            />
          ) : (
            <div className="absolute inset-0 [&_canvas]:!h-full [&_canvas]:!w-full [&_svg]:!h-full [&_svg]:!w-full">
              <Visual />
            </div>
          )}
          <div className="detail-visual-fade" />
        </div>
      </motion.div>

      {/* ── Body: narrative + meta ── */}
      <section className="detail-body section-shell">
        <div className="detail-grid">
          <div className="detail-narrative">
            <motion.p {...reveal(0)} className="detail-lead">
              {project.description}
            </motion.p>

            {study.challenge && (
              <motion.div {...reveal(0.05)} className="detail-block">
                <span className="detail-block-label">The problem</span>
                <p>{study.challenge}</p>
              </motion.div>
            )}
            {study.approach && (
              <motion.div {...reveal(0.1)} className="detail-block">
                <span className="detail-block-label">The approach</span>
                <p>{study.approach}</p>
              </motion.div>
            )}
            {study.outcome && (
              <motion.div {...reveal(0.15)} className="detail-block">
                <span className="detail-block-label">The outcome</span>
                <p>{study.outcome}</p>
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

            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full min-h-[48px]"
            >
              <Github size={16} className="mr-2" /> View on GitHub
            </a>
          </motion.aside>
        </div>
      </section>

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
