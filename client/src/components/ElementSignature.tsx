/** Decorative wood-and-fire seal: a personal visual reference, not a prediction about outcomes. */
export function ElementSignature() {
  return <div className="element-signature" aria-hidden="true">
    <svg className="element-seal" viewBox="0 0 120 108" fill="none">
      <circle cx="60" cy="52" r="39" stroke="var(--line-2)" strokeWidth=".7" />
      <path d="M24 66A39 39 0 0 1 93 30" stroke="var(--fire)" strokeWidth="1.5" />
      <path d="M35 83Q55 66 61 31M50 65Q36 61 36 46Q54 44 55 59M57 50Q73 49 80 34Q63 32 59 44M44 73Q30 77 27 65Q39 58 48 65" stroke="var(--wood)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M61 31Q54 42 57 51" stroke="var(--wood)" strokeWidth="1" />
      <g className="element-sun" style={{ transform: 'translate(3.5px, -1.5px)' }}>
        <circle cx="87" cy="26" r="10" fill="var(--fire)" fillOpacity=".12" />
        <circle cx="87" cy="26" r="4" fill="var(--fire)" />
      </g>
      <text x="47" y="104" textAnchor="middle" fill="var(--wood)" fontSize="11">木</text>
      <text x="60" y="103" textAnchor="middle" fill="var(--faint)" fontSize="9">·</text>
      <text x="73" y="104" textAnchor="middle" fill="var(--fire)" fontSize="11">火</text>
    </svg>
  </div>
}
