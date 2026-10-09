export function TechnologyTags({ items, label, onExplore }: {
  items: readonly string[]; label: string; onExplore?: (technology: string) => void
}) {
  return <ul className="technology-tags" aria-label={label}>
    {items.map(item => <li key={item}>{onExplore
      ? <button type="button" className="technology-tag" onClick={() => onExplore(item)} aria-label={`Find work using ${item}`}>{item}<span aria-hidden="true">↗</span></button>
      : <span className="technology-tag">{item}</span>}
    </li>)}
  </ul>
}
