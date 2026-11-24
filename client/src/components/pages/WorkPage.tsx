import { education } from '../../content/onepage'
import { experience } from '../../content/experience'
import { Logo, PageTitle, Section, useCaseLink } from '../parts'

export function WorkPage() {
  const caseLink = useCaseLink()
  return <>
    <PageTitle>Work</PageTitle>
    <ol className="op-rows" aria-label="Experience">
      {experience.map(r => <li key={r.id} id={`experience-${r.id}`} className="op-row">
        <Logo src={r.logo} mark={r.mark} />
        <div className="op-row-main">
          <h2 className="op-row-title">{r.org}</h2>
          <p className="op-row-sub">{r.role}</p>
          <p className="op-row-text">{r.highlight}</p>
        </div>
        <span className="op-date">{r.period}</span>
      </li>)}
    </ol>

    <Section id="education" title="Education">
      <ol className="op-rows">
        <li className="op-row">
          <Logo src={education.logo} />
          <div className="op-row-main">
            <h3 className="op-row-title">{education.school}</h3>
            <p className="op-row-sub">{education.program}</p>
          </div>
          <span className="op-date">{education.period}</span>
        </li>
        <li>
          <a className="op-row op-row-link" {...caseLink(education.award.projectId)}>
            <Logo />
            <span className="op-row-main">
              <span className="op-row-title op-award">{education.award.title}</span>
            </span>
            <span className="op-date">{education.award.date}</span>
          </a>
        </li>
      </ol>
    </Section>
  </>
}
