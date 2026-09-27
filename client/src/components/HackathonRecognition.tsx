export function HackathonRecognition({ event, year, award }: { event: string; year?: string; award?: string }) {
  return (
    <div className="hackathon-recognition">
      <span className="hackathon-event">{event}{year && !event.includes(year) ? ` · ${year}` : ''}</span>
      {award && <span className="hackathon-award"><span className="hackathon-award-label">Award</span>{award}</span>}
    </div>
  )
}
