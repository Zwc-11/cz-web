import { motion, useReducedMotion } from 'motion/react'
import { education, featureSlides } from '../../content/onepage'
import { profile } from '../../content/profile'
import { asset } from '../../lib/asset'
import { AnimatedIntro } from '../AnimatedIntro'
import { ElementSignature } from '../ElementSignature'
import { FeatureCarousel } from '../FeatureCarousel'
import { IconArrowUpRight, IconCopy, IconGitHub, IconLinkedIn, IconX } from '../icons'
import { useCaseLink, usePageLink } from '../parts'

const ease = [0.22, 0.8, 0.2, 1] as const
const introStagger = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }
const rise = {
  hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease } },
}

export function HomePage({ onCopy, first }: { onCopy: () => void; first: boolean }) {
  const reduce = useReducedMotion()
  const caseLink = useCaseLink()
  const pageLink = usePageLink()

  // The staggered rise plays on first load; coming back to Home uses the page fade.
  return <motion.section id="top" aria-labelledby="intro-title" className="op-hero" variants={introStagger} initial={reduce || !first ? false : 'hidden'} animate="show">
    <motion.div variants={rise} className="intro-heading"><AnimatedIntro /><ElementSignature /></motion.div>
    <motion.p variants={rise} className="op-lede">I'm a 2B Computer Science &amp; Finance student at the{' '}
      <span className="op-org"><img className="op-org-logo" src={asset(education.logo)} alt="" width={18} height={18} />University of Waterloo</span>.</motion.p>
    <motion.div variants={rise} className="op-recent">
      <h2 className="op-recent-label">Recently</h2>
      <ul className="op-recent-list">
        <li>
          <p>AI Adoption &amp; Deployment Engineering Intern at{' '}
            <a className="op-org op-org-link" {...pageLink('work', 'experience-ecobee')}>
              <img className="op-org-logo op-org-logo-round" src={asset('logos/ecobee.png')} alt="" width={18} height={18} />ecobee</a></p>
          <p className="op-recent-sub"><span aria-hidden="true">↳ </span>Forward-deployed with finance, accounting and sales teams</p>
        </li>
        <li>
          <p>Building <a className="op-org op-org-link" {...caseLink('takeone')}>TakeOne</a>, an OpenAI-supported venture</p>
          <p className="op-recent-sub"><span aria-hidden="true">↳ </span>An AI robot film studio from{' '}
            <span className="op-org-plain"><img className="op-org-logo" src={asset('logos/htn.png')} alt="" width={16} height={16} />Hack the North 2026</span>, top score of 12 finalists</p>
        </li>
        <li>
          <p>Built SproutPass at{' '}
            <a className="op-org op-org-link" {...caseLink('sproutpass')}>
              <img className="op-org-logo" src={asset('logos/lahacks.png')} alt="" width={18} height={18} />LA Hacks 2026</a></p>
          <p className="op-recent-sub"><span aria-hidden="true">↳ </span>Visa Challenge Winner, Photon iMessage Runner-Up</p>
        </li>
      </ul>
      <p className="op-recent-also">I also build robots after hours <span>(and used to coach FRC and VEX teams)</span></p>
    </motion.div>
    <motion.div variants={rise} className="op-links">
      <button type="button" onClick={onCopy} className="portfolio-link" aria-label={`Copy email address: ${profile.email}`}><IconCopy size={14} />Email</button>
      <a href={profile.socials[0].href} target="_blank" rel="noreferrer noopener" className="portfolio-link"><IconGitHub size={15} />GitHub</a>
      <a href={profile.socials[1].href} target="_blank" rel="noreferrer noopener" className="portfolio-link"><IconLinkedIn size={15} />LinkedIn</a>
      <a href={profile.socials[3].href} target="_blank" rel="noreferrer noopener" className="portfolio-link"><IconX size={14} />X</a>
      <a href={profile.socials[2].href} target="_blank" rel="noreferrer noopener" className="portfolio-link">Devpost<IconArrowUpRight size={13} /></a>
    </motion.div>
    <motion.div variants={rise}><FeatureCarousel slides={featureSlides} label="TakeOne at Hack the North 2026" /></motion.div>
  </motion.section>
}
