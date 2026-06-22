import { motion } from 'framer-motion';
import CountUp from '../interactive/CountUp';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * A full-width band of headline metrics drawn from real project outcomes.
 * Numbers animate up on scroll-in. Placed between the hero and the proof
 * strip so the page opens with momentum.
 */
const METRICS = [
  {
    value: 89.5,
    decimals: 1,
    suffix: '%',
    label: 'RAG strict accuracy',
    note: 'Gore Mutual benchmark, 200+ questions',
  },
  {
    value: 80,
    decimals: 0,
    suffix: '%',
    label: 'Eval runtime cut',
    note: 'governed internal AI platform',
  },
  {
    value: 18,
    decimals: 0,
    suffix: '+',
    label: 'Knowledge bases',
    note: 'deployed across 10+ business users',
  },
  {
    value: 0.769,
    decimals: 3,
    prefix: '',
    label: 'PR-AUC',
    note: 'MarketImmune toxic-flow model',
  },
];

export default function MetricsStrip() {
  const reduced = useReducedMotion();

  return (
    <section id="metrics" className="metrics-strip">
      <div className="section-shell">
        <div className="metrics-grid">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="metric-cell"
            >
              <p className="metric-value">
                <CountUp
                  value={m.value}
                  decimals={m.decimals}
                  prefix={m.prefix}
                  suffix={m.suffix}
                />
              </p>
              <p className="metric-label">{m.label}</p>
              <p className="metric-note">{m.note}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
