export default function HorizonGlow() {
  return (
    <div
      className="horizon-glow pointer-events-none absolute inset-x-0 top-[38vh] h-px"
      aria-hidden
    >
      <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-30" />
      <div className="absolute inset-x-[10%] top-0 h-24 bg-gradient-to-b from-[rgba(var(--accent-rgb),0.06)] to-transparent blur-2xl" />
    </div>
  );
}
