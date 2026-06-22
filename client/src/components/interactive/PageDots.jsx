import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const LABELS = {
  intro: 'Top',
  about: 'About',
  metrics: 'Impact',
  'work-top': 'Top',
  projects: 'Projects',
  hackathons: 'Hackathons',
  experience: 'Experience',
  education: 'Education',
  identity: 'Skills',
  proof: 'Proof',
  contact: 'Contact',
  'contact-top': 'Top',
  'about-top': 'Top',
  more: 'Explore',
};

/**
 * A vertical dot rail that lists the in-page sections and highlights the one
 * in view. Re-scans on each route change. Hidden on small screens and on
 * pages with fewer than two sections.
 */
export default function PageDots() {
  const location = useLocation();
  const [sections, setSections] = useState([]);
  const [active, setActive] = useState('');
  const obsRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => {
      const els = Array.from(document.querySelectorAll('.route-page section[id]'));
      setSections(
        els.map((el) => ({
          id: el.id,
          label: LABELS[el.id] || el.id.charAt(0).toUpperCase() + el.id.slice(1),
        }))
      );
      if (els.length) setActive(els[0].id);

      if (obsRef.current) obsRef.current.disconnect();
      obsRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setActive(e.target.id);
          });
        },
        { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
      );
      els.forEach((el) => obsRef.current.observe(el));
    }, 350);

    return () => {
      clearTimeout(t);
      if (obsRef.current) obsRef.current.disconnect();
    };
  }, [location.pathname]);

  const go = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  if (sections.length < 2) return null;

  return (
    <nav className="page-dots" aria-label="Section navigation">
      {sections.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => go(s.id)}
          className={`page-dot ${active === s.id ? 'page-dot--active' : ''}`}
          aria-label={s.label}
          aria-current={active === s.id}
        >
          <span className="page-dot-label">{s.label}</span>
        </button>
      ))}
    </nav>
  );
}
