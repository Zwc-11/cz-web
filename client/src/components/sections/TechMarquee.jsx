import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * An infinite, low-key scrolling ribbon of the tooling Caesar works across.
 * Pure CSS animation (duplicated track) so it's cheap and smooth. Pauses on
 * hover; collapses to a static wrap when reduced motion is requested.
 */
const STACK = [
  'PyTorch',
  'LangGraph',
  'CatBoost',
  'MLflow',
  'React',
  'Node.js',
  'FastAPI',
  'Express',
  'Postgres',
  'DuckDB',
  'Databricks',
  'Azure',
  'AWS',
  'Docker',
  'GitHub Actions',
  'C++',
  'WebSocket',
  'RAG eval',
];

export default function TechMarquee() {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className="tech-marquee tech-marquee--static" aria-hidden>
        <div className="section-shell flex flex-wrap justify-center gap-x-6 gap-y-2">
          {STACK.map((item) => (
            <span key={item} className="tech-marquee-item">
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="tech-marquee" aria-hidden>
      <div className="tech-marquee-track">
        {[...STACK, ...STACK].map((item, i) => (
          <span key={`${item}-${i}`} className="tech-marquee-item">
            {item}
            <span className="tech-marquee-dot">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
