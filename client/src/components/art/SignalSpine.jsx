import { useScrollSpy } from '../../hooks/useScrollSpy';

const CHAPTERS = [
  { id: 'hero', num: '00', label: 'Signal' },
  { id: 'proof', num: '01', label: 'Proof' },
  { id: 'work', num: '02', label: 'Work' },
  { id: 'experience', num: '03', label: 'Path' },
  { id: 'identity', num: '04', label: 'Self' },
  { id: 'contact', num: '05', label: 'Contact' },
];

export default function SignalSpine() {
  const active = useScrollSpy(CHAPTERS.map((c) => c.id));

  return (
    <aside
      className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
      aria-label="Section navigation"
    >
      <div className="relative flex flex-col items-center gap-6">
        <div className="absolute bottom-0 top-0 w-px bg-white/10" aria-hidden />
        <div
          className="absolute w-px bg-[var(--accent)] transition-all duration-500 ease-out"
          style={{
            top: `${CHAPTERS.findIndex((c) => c.id === active) * 56}px`,
            height: '40px',
            boxShadow: '0 0 12px var(--accent-glow)',
          }}
          aria-hidden
        />

        {CHAPTERS.map((ch) => {
          const isActive = active === ch.id;
          return (
            <a
              key={ch.id}
              href={`#${ch.id}`}
              className="group relative flex items-center gap-3"
              aria-current={isActive ? 'true' : undefined}
            >
              <span
                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border font-mono text-[10px] transition-all duration-300 ${
                  isActive
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] shadow-[0_0_20px_var(--accent-glow)]'
                    : 'border-white/10 bg-black/40 text-white/35 group-hover:border-white/25 group-hover:text-white/60'
                }`}
              >
                {ch.num}
              </span>
              <span
                className={`absolute left-12 whitespace-nowrap font-mono text-[10px] uppercase tracking-wider transition-all duration-300 ${
                  isActive ? 'text-[var(--accent)] opacity-100' : 'text-white/30 opacity-0 group-hover:opacity-100'
                }`}
              >
                {ch.label}
              </span>
            </a>
          );
        })}
      </div>
    </aside>
  );
}
