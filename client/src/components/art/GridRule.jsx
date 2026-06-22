/** Section divider — geometric rule with index marker */
export default function GridRule({ index }) {
  return (
    <div className="section-shell py-8 sm:py-10" aria-hidden>
      <div className="flex items-center gap-4">
        {index && (
          <span className="geo-index shrink-0 border-[rgba(201,162,39,0.3)] text-[rgba(201,162,39,0.6)]">{index}</span>
        )}
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-[rgba(201,162,39,0.4)]" />
        <span className="h-2 w-2 shrink-0 rotate-45 bg-[var(--accent)]" />
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/10 to-[rgba(201,162,39,0.4)]" />
      </div>
    </div>
  );
}
