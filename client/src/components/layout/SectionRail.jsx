import { useScrollSpy } from '../../hooks/useScrollSpy';

const SECTIONS = [
  { id: 'hero', index: '00', label: 'Intro' },
  { id: 'proof', index: '01', label: 'Proof' },
  { id: 'work', index: '02', label: 'Work' },
  { id: 'experience', index: '03', label: 'Path' },
  { id: 'identity', index: '04', label: 'Self' },
  { id: 'contact', index: '05', label: 'Contact' },
];

export default function SectionRail() {
  const active = useScrollSpy(SECTIONS.map((s) => s.id));

  return (
    <aside className="section-rail hidden xl:block" aria-label="Section navigation">
      <nav className="section-rail-nav">
        {SECTIONS.map((section) => {
          const isActive = active === section.id;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`section-rail-link ${isActive ? 'section-rail-link--active' : ''}`}
            >
              <span className="section-rail-index">{section.index}</span>
              <span className="section-rail-label">{section.label}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
