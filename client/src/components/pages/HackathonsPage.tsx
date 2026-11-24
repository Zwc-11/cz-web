import { hackathons } from '../../content/onepage'
import { Logo, PageTitle, useCaseLink } from '../parts'

export function HackathonsPage() {
  const caseLink = useCaseLink()
  return <>
    <PageTitle>Hackathons</PageTitle>
    <ol className="op-rows">
      {hackathons.map(h => <li key={h.id}>
        <a className="op-row op-row-link" {...caseLink(h.projectId)}>
          <Logo src={h.icon} mark={h.mark} />
          <span className="op-row-main">
            <span className="op-row-title">{h.name}</span>
            <span className="op-row-sub">{h.project}{h.award && <> · <span className="op-award">{h.award}</span></>}</span>
          </span>
          <span className="op-date">{h.date}</span>
        </a>
      </li>)}
    </ol>
  </>
}
