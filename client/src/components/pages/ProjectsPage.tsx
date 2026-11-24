import { caseStudies } from '../../content/caseStudies'
import { projectCards } from '../../content/onepage'
import { IconTrophy } from '../icons'
import { CoverArt, PageTitle, Section, useCaseLink } from '../parts'

const featured = projectCards.filter(p => p.featured)
const more = projectCards.filter(p => !p.featured)

export function ProjectsPage() {
  const caseLink = useCaseLink()
  return <>
    <PageTitle>Projects</PageTitle>
    <ul className="op-grid">
      {featured.map(p => <li key={p.id}>
        <a className="op-card" {...caseLink(p.id)}>
          <CoverArt cover={p.cover} name={p.name} />
          {p.award && <span className="op-badge"><IconTrophy size={12} />{p.award}</span>}
          <span className="op-card-body">
            <span className="op-card-title">{p.name}</span>
            <span className="op-card-text">{caseStudies[p.id].overview}</span>
          </span>
        </a>
      </li>)}
    </ul>

    {more.length > 0 && <Section id="more" title="More">
      <ol className="op-rows">
        {more.map(p => <li key={p.id}>
          <a className="op-row op-row-link op-row-plain" {...caseLink(p.id)}>
            <span className="op-row-main">
              <span className="op-row-title">{p.name}{p.award && <span className="op-row-award"> · <span className="op-award">{p.award}</span></span>}</span>
              <span className="op-row-sub">{caseStudies[p.id].overview}</span>
            </span>
            <span className="op-date">{p.date}</span>
          </a>
        </li>)}
      </ol>
    </Section>}
  </>
}
