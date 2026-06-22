/** Sparse floating geometric marks — editorial, not noisy */
export default function FloatingGlyphs() {
  const glyphs = [
    { top: '12%', left: '8%', size: 48, rotate: -12 },
    { top: '28%', right: '6%', size: 36, rotate: 8 },
    { top: '52%', left: '4%', size: 28, rotate: 15 },
    { top: '68%', right: '10%', size: 40, rotate: -6 },
    { top: '85%', left: '12%', size: 32, rotate: 4 },
  ];

  return (
    <div className="floating-glyphs pointer-events-none absolute inset-0 z-[3] overflow-hidden" aria-hidden>
      {glyphs.map((g, i) => (
        <svg
          key={i}
          className="glyph-drift absolute opacity-[0.12]"
          style={{
            top: g.top,
            left: g.left,
            right: g.right,
            width: g.size,
            height: g.size,
            transform: `rotate(${g.rotate}deg)`,
            animationDelay: `${i * -3}s`,
          }}
          viewBox="0 0 40 40"
        >
          {i % 3 === 0 ? (
            <rect x="8" y="8" width="24" height="24" fill="none" stroke="rgba(var(--paint-gold-rgb),0.6)" strokeWidth="0.75" />
          ) : i % 3 === 1 ? (
            <polygon points="20,4 36,36 4,36" fill="none" stroke="rgba(var(--accent-rgb),0.5)" strokeWidth="0.75" />
          ) : (
            <circle cx="20" cy="20" r="14" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.5" strokeDasharray="2 4" />
          )}
        </svg>
      ))}
    </div>
  );
}
