/** Event name plus one chip per award. Multiple awards ("A · B") sit side by side. */
export function HackathonRecognition({ event, year, award }: { event: string; year?: string; award?: string }) {
  const awards = award ? award.split(' · ').map(a => a.trim()).filter(Boolean) : []
  return (
    <div className="hackathon-recognition">
      <span className="hackathon-event">{event}{year && !event.includes(year) ? ` · ${year}` : ''}</span>
      {awards.map(a => <span key={a} className="hackathon-award"><span className="hackathon-award-label">Award</span>{a}</span>)}
    </div>
  )
}
