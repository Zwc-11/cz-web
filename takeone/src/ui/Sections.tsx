import { registerSection, scrollToSection } from '../lib/scroll'
import { rt } from '../store'
import { useDerived, sectionProgress } from '../lib/useProgress'
import { AWARD, LINKS, STACK, STEPS, TEAM } from '../content'
import { GitHubMark } from './Chrome'
import { Console } from './Console'
import { Editor } from './Editor'
import rigFront from '../assets/rig-front.jpg'
import rigRing from '../assets/rig-ring.jpg'
import finals from '../assets/htn-2026-finals-demo.jpg'
import sim from '../assets/sim.jpg'

export function Hero() {
  return (
    <section className="shot shot-tall hero" style={{ ['--h' as string]: '135vh' }} ref={(el) => registerSection(0, el)} id="top" aria-labelledby="hero-title">
      <div className="sticky">
        <div className="copy">
          <h1 id="hero-title" className="display reveal">
            An AI director with a robot camera crew.
          </h1>
          <p className="lede reveal d1">
            Tell TakeOne what the scene needs. It plans the shots, rehearses every move in simulation, then drives a camera and a light to film you.
          </p>
          <div className="hero-actions reveal d2">
            <button className="btn" onClick={() => scrollToSection(3)}>
              Direct a shot
            </button>
            <a className="btn btn--ghost" href={LINKS.github} target="_blank" rel="noreferrer">
              <GitHubMark />
              See my GitHub
            </a>
          </div>
          <div className="hero-meta small reveal d3">
            <span>{AWARD}</span>
            <span>Built by {TEAM}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Talk() {
  return (
    <section className="shot shot-tall" style={{ ['--h' as string]: '230vh' }} ref={(el) => registerSection(1, el)} aria-labelledby="talk-title">
      <div className="sticky">
        <div className="copy">
          <h2 id="talk-title" className="display">
            It talks to you while it works.
          </h2>
          <p className="lede">
            TakeOne holds a spoken conversation with the person on camera. Ask for a shot, push back on the script, take direction on your marks. Each
            decision becomes a typed function call, so what you agreed on is what the robot does.
          </p>
          <p className="talk-note small">
            When the camera rolls, TakeOne goes quiet. A recording latch keeps its voice off your audio track until the cut.
          </p>
        </div>
      </div>
    </section>
  )
}

export function Rehearse() {
  const active = useDerived(() => {
    const p = sectionProgress(2)
    if (p < 0) return -1
    return Math.min(STEPS.length - 1, Math.floor(Math.max(0, p - 0.08) / 0.2))
  })
  return (
    <section className="shot shot-tall" style={{ ['--h' as string]: '260vh' }} ref={(el) => registerSection(2, el)} aria-labelledby="rehearse-title">
      <div className="sticky">
        <div className="copy">
          <h2 id="rehearse-title" className="display">
            Nothing moves until the shot is rehearsed.
          </h2>
          <ol className="steps">
            {STEPS.map((s, i) => (
              <li key={s.title} className="step" data-on={active === -1 || i <= active} data-current={i === Math.max(0, active)}>
                <span className="step-n num">{i + 1}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="cache-stat">
            <strong className="num">2.06 s → 0.04 s</strong>
            <span className="small">
              Compile time, cold and from cache. Previews are keyed on the settings plus a hash of every source file and calibration, so a stale one
              can’t be served.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Direct() {
  return (
    <section className="shot direct" ref={(el) => registerSection(3, el)} id="direct" aria-label="Direct a shot">
      <Console />
    </section>
  )
}

export function Edit() {
  return (
    <section className="shot edit" ref={(el) => registerSection(4, el)} aria-label="Edit">
      <Editor />
    </section>
  )
}

export function RigSection() {
  return (
    <section className="shot" ref={(el) => registerSection(5, el)} aria-labelledby="rig-title">
      <div
        className="shot-tall"
        style={{ ['--h' as string]: '260vh' }}
        ref={(el) => {
          rt.rigEl = el
        }}
      >
        <div className="sticky">
          <div className="copy">
            <h2 id="rig-title" className="display">
              Two arms, a phone and a cart.
            </h2>
            <p className="lede">
              Two SO-ARM101 arms ride a two-post tower on a four-wheel cart. One holds an iPhone, the other a ring light, and the laptop on the deck
              runs the director. Each arm has five joints: the wrist motor came out to make room for the camera and light mounts.
            </p>
            <div className="rules">
              <p>The phone arm always stays in front.</p>
              <p>The light arm is never allowed into the phone’s shot.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="gallery">
        <div className="gallery-head">
          <h3 className="display" style={{ fontSize: 'clamp(34px, 3.6vw, 56px)' }}>
            The real one.
          </h3>
          <p className="small" style={{ maxWidth: '30em', marginTop: 14 }}>
            Built over 36 hours at Hack the North 2026 and demoed on stage at the finals. Physical filming runs with an operator beside the cart; the
            simulator checks every plan first.
          </p>
        </div>
        <figure className="g-sim">
          <img src={sim} alt="The TakeOne Shot Studio: a 3D rehearsal of the rig and two performers on a one-foot grid, with the director's monitor and a three-shot timeline" loading="lazy" />
          <figcaption className="small">Shot Studio, the rehearsal simulator.</figcaption>
        </figure>
        <figure className="g-wide">
          <img src={finals} alt="The TakeOne team on stage at the Hack the North 2026 finals beside the rig, with the ring light lit and an orange iPhone on the camera arm" loading="lazy" />
          <figcaption className="small">On stage at the Hack the North 2026 finals.</figcaption>
        </figure>
        <figure className="g-tall-a">
          <img src={rigRing} alt="The rig from behind: ring light on one arm, camera on the other, laptop and electronics on the cart" loading="lazy" />
          <figcaption className="small">Ring light, camera, laptop.</figcaption>
        </figure>
        <figure className="g-tall-b">
          <img src={rigFront} alt="The rig in a hallway: black wooden cart with two posts and both arms on the top plate" loading="lazy" />
          <figcaption className="small">The cart, between judging rounds.</figcaption>
        </figure>
      </div>
    </section>
  )
}

export function Wrap() {
  return (
    <>
      <section className="shot shot-tall wrap" style={{ ['--h' as string]: '170vh' }} ref={(el) => registerSection(6, el)} aria-labelledby="wrap-title">
        <div className="sticky">
          <div className="copy" style={{ width: 'min(820px, 100%)' }}>
            <h2 id="wrap-title" className="display">
              Built in 36 hours. Still in production.
            </h2>
            <p className="lede">
              TakeOne started at Hack the North 2026 and the team is still building it. The code, the write-up and the rest of my work are a click away.
            </p>
            <div className="hero-actions">
              <a className="btn" href={LINKS.github} target="_blank" rel="noreferrer">
                <GitHubMark />
                github.com/Zwc-11
              </a>
              <a className="btn btn--ghost" href={LINKS.source} target="_blank" rel="noreferrer">
                Source code
              </a>
              <a className="btn btn--ghost" href={LINKS.devpost} target="_blank" rel="noreferrer">
                Devpost
              </a>
              <a className="btn btn--ghost" href={LINKS.site} target="_blank" rel="noreferrer">
                caesarzhou.com
              </a>
            </div>
            <dl className="credits">
              <dt>Built by</dt>
              <dd>{TEAM}</dd>
              <dt>Recognition</dt>
              <dd>{AWARD}</dd>
              <dt>Stack</dt>
              <dd>{STACK.join(', ')}</dd>
            </dl>
          </div>
        </div>
      </section>
      <footer className="footer">
        <span>This page draws the rig live with Three.js. Its motion and timings replay the real system.</span>
        <span>© 2026 Caesar Zhou</span>
      </footer>
    </>
  )
}
