/** Decorative foreground accents per tapestry variant — clean, not cluttered */
export default function TapestryOrnaments({ theme }) {
  return (
    <div className="tapestry-ornaments pointer-events-none fixed inset-0 z-[8] overflow-hidden" aria-hidden>
      <div className="ornament-rail ornament-rail-left hidden xl:block" />
      <div className="ornament-rail ornament-rail-right hidden xl:block" />

      {theme === 'loom' && (
        <>
          <div className="absolute left-[3%] top-[32%] h-px w-24 bg-gradient-to-r from-[rgba(var(--paint-gold-rgb),0.35)] to-transparent" />
          <div className="absolute right-[5%] top-[58%] h-px w-32 bg-gradient-to-l from-[rgba(var(--accent-rgb),0.25)] to-transparent" />
        </>
      )}

      {theme === 'noir' && (
        <>
          <div className="absolute inset-x-[8%] top-[30%] h-px bg-white/[0.04]" />
          <div className="absolute inset-x-[12%] top-[62%] h-px bg-white/[0.03]" />
        </>
      )}

      {theme === 'gilded' && (
        <>
          <svg className="absolute left-[4%] top-[18%] h-32 w-32 opacity-20" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(201,162,39,0.5)" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="32" fill="none" stroke="rgba(201,162,39,0.3)" strokeWidth="0.5" strokeDasharray="2 4" />
          </svg>
          <svg className="absolute right-[6%] top-[42%] h-24 w-24 opacity-15" viewBox="0 0 100 100">
            <polygon points="50,5 95,75 5,75" fill="none" stroke="rgba(201,162,39,0.4)" strokeWidth="0.75" />
          </svg>
        </>
      )}

      {theme === 'aurora' && (
        <div className="absolute left-1/2 top-[22%] h-64 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(var(--accent-rgb),0.07),transparent_70%)] blur-3xl" />
      )}

      {theme === 'pulse' && (
        <div className="pulse-scanline absolute inset-x-0 top-0 h-full opacity-[0.04]" />
      )}
    </div>
  );
}
