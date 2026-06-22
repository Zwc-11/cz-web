import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectCard from '../cards/ProjectCard';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Horizontal, snap-scrolling rail of project cards with smooth prev/next
 * controls. Scales to any number of projects: the arrows disable themselves
 * at each end and stay out of the way when everything already fits.
 */
export default function ProjectCarousel({ projects }) {
  const reduced = useReducedMotion();
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanPrev(scrollLeft > 8);
    setCanNext(scrollLeft + clientWidth < scrollWidth - 8);
  }, []);

  useEffect(() => {
    update();
    const el = trackRef.current;
    if (!el) return undefined;
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [update]);

  const scrollByCards = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    const item = el.querySelector('[data-carousel-item]');
    const gap = 20; // matches the gap-5 track spacing
    const amount = item ? item.offsetWidth + gap : el.clientWidth * 0.85;
    el.scrollBy({ left: direction * amount, behavior: reduced ? 'auto' : 'smooth' });
  };

  const hasControls = canPrev || canNext;

  return (
    <div className="work-carousel">
      <div className="work-carousel-head">
        <p className="work-carousel-hint">
          {projects.length} {projects.length === 1 ? 'project' : 'projects'}
          {hasControls && ' · swipe or use the arrows'}
        </p>
        <div className="work-carousel-controls">
          <button
            type="button"
            className="work-carousel-btn"
            onClick={() => scrollByCards(-1)}
            disabled={!canPrev}
            aria-label="Previous projects"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="work-carousel-btn"
            onClick={() => scrollByCards(1)}
            disabled={!canNext}
            aria-label="Next projects"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="work-carousel-track" ref={trackRef}>
        {projects.map((project, i) => (
          <div key={project.id} data-carousel-item className="work-carousel-item">
            <ProjectCard
              project={project}
              index={i}
              detailTo={`/work/${project.id}`}
              variant="module"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
