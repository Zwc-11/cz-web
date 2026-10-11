import { experience, recognition } from '../../content/portfolio'
import { profile } from '../../content/profile'
import { OrgMark, Tag } from '../ui'
import { Stats, SubHead, TakeHead } from './parts'

export function BeforeTake() {
  return (
    <>
      <TakeHead kicker="2023 – 2026 · Experience & my story" title="Before ecobee">
        My internships and part-time contract work have taken me from client websites and embedded software to enterprise AI agents.
      </TakeHead>

      <Stats
        items={[
          { value: '89.5%', label: 'strict accuracy on 200+ underwriting questions' },
          { value: '−80%', label: 'evaluation runtime' },
          { value: '70+', label: 'clients acquired with the platform' },
          { value: '+82%', label: 'weekly website traffic' },
        ]}
      />

      <ol className="mt-10 space-y-3">
        {experience.slice(1).map((d) => (
          <li key={d.id} className="rounded-[16px] border border-line p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-3.5">
              <OrgMark mark={d.mark} bg={d.markBg} fg={d.markFg} size={36} />
              <div className="min-w-0 flex-1">
                <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-fg">{d.org}</h3>
                <div className="text-[14px]">{d.role}</div>
                <div className="growth-ink mt-1 text-[12px]">{d.employmentType}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[12px] text-fg">{d.period}</div>
                <div className="text-[12.5px] text-faint">{d.place}</div>
              </div>
            </div>
            <p className="mt-4 text-[15px] leading-[1.65]">{d.shipped}</p>
            <p className="mt-3 border-l-2 border-rec pl-3 text-[15px] leading-[1.6] text-fg">{d.result}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {d.stack.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-6 flex flex-wrap items-baseline justify-between gap-2 rounded-[14px] border border-dashed border-line-2 px-5 py-4 text-[14.5px]">
        <span>
          <span className="text-fg">{profile.education.school}</span>, Computer Science and Finance (CFM), Co-op
        </span>
        <span className="font-mono text-[12px] text-faint">2024 – present</span>
      </p>

      <SubHead>Where it started</SubHead>
      <div className="space-y-4 text-[15px] leading-[1.75]">
        <p>Before AI systems, I spent years around FRC and VEX robots. Debugging meant hardware, software, sensors and timing, often all failing at once. That is where I learned to debug a whole system, which is most of forward deployed work.</p>
        <p>At Georges Vanier Secondary School, I was an FRC robotics CAD team leader, co-founded the VEX IQ Robotics Club and was part of the SAC Innovation Team. I completed the STEM+ program in 2024, then joined Waterloo’s Computing and Financial Management program.</p>
        <p>Today I like the point where AI, data and software meet a real workflow: sitting with the people who do the work, mapping it, shipping the tool, then adding the evals and telemetry that keep it working after the demo.</p>
      </div>

      <SubHead>A few milestones</SubHead>
      <ul className="divide-y divide-line border-y border-line">
        {recognition.map(r => <li key={r.id} className="grid gap-2 py-5 sm:grid-cols-[90px_1fr] sm:gap-5">
          <span className="font-mono text-[11px] text-faint">{r.date}</span>
          <div><h4 className="text-[15px] font-medium text-fg">{r.title}</h4><p className="mt-1 text-[13px]">{r.issuer}</p>{r.id === 'diamond' && <p className="mt-2 text-[14px]">Built FLASH, a social platform connecting online software with offline events for Gen Z.</p>}</div>
        </li>)}
      </ul>

      <SubHead>Tools I reach for</SubHead>
      <div className="space-y-4">{profile.skills.map(s => <div key={s.group} className="grid gap-1 sm:grid-cols-[110px_1fr] sm:gap-5"><h4 className="text-[13px] font-medium text-fg">{s.group}</h4><p className="text-[14px] leading-relaxed">{s.items.join(' · ')}</p></div>)}</div>
    </>
  )
}
