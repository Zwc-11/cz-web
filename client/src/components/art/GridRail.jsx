import { useScrollSpy } from '../../hooks/useScrollSpy';

const SECTIONS = [
  { id: 'hero', index: '00', label: 'Intro' },
  { id: 'proof', index: '01', label: 'Proof' },
  { id: 'work', index: '02', label: 'Work' },
  { id: 'experience', index: '03', label: 'Path' },
  { id: 'identity', index: '04', label: 'Self' },
  { id: 'contact', index: '05', label: 'Contact' },
];

export default function GridRail() {
  const active = useScrollSpy(SECTIONS.map((s) => s.id));

  return (
    <aside
      className="fixed left-0 top-0 z-40 hidden h-screen w-14 border-r border-white/[0.06] bg-black/30 backdrop-blur-md xl:flex xl:flex-col xl:items-center xl:justify-center"
      aria-label="Section navigation"
    >
      <nav className="flex flex-col gap-1 py-8">
        {SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`group relative flex h-11 w-11 items-center justify-center border transition-colors ${
                isActive
                  ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                  : 'border-transparent text-white/30 hover:border-white/10 hover:text-white/60'
              }`}
              aria-current={isActive ? 'true' : undefined}
              title={s.label}
            >
              <span className="font-mono text-[10px]">{s.index}</span>
              <span
                className={`pointer-events-none absolute left-full ml-3 whitespace-nowrap border border-white/10 bg-surface px-2 py-1 font-mono text-[9px] uppercase tracking-wider transition-opacity ${
                  isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                {s.label}
              </span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
