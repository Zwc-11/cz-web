/** Soft diagonal light sheen — strong but clean */
export default function PrismSheen() {
  return (
    <div className="prism-sheen pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden>
      <div className="prism-sheen-beam absolute -left-1/4 top-0 h-full w-1/2 rotate-12 bg-gradient-to-r from-transparent via-[rgba(var(--accent-rgb),0.04)] to-transparent blur-3xl" />
      <div className="prism-sheen-beam-reverse absolute -right-1/4 top-1/4 h-2/3 w-1/3 -rotate-6 bg-gradient-to-l from-transparent via-[rgba(var(--paint-gold-rgb),0.05)] to-transparent blur-3xl" />
    </div>
  );
}
