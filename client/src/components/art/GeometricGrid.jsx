/** Faint modular grid beneath the painting layers */
export default function GeometricGrid() {
  return (
    <div className="geo-grid pointer-events-none fixed inset-0 z-[7] opacity-30 mix-blend-overlay" aria-hidden>
      <div className="geo-grid-minor absolute inset-0" />
      <div className="geo-grid-major absolute inset-0" />
    </div>
  );
}
