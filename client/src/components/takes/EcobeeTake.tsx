import { deployments } from '../../content/deployments'
import { Tag } from '../ui'
import { Block, Stats, TakeHead } from './parts'

const now = deployments[0]

export function EcobeeTake() {
  return (
    <>
      <TakeHead
        kicker={
          <span className="flex items-center gap-2">
            <span className="text-rec-ink">Current internship</span> · {now.period} · Toronto
          </span>
        }
        title={
          <>
            Forward Deployed Engineer <span className="serif-accent font-normal text-[1.06em] text-muted">at ecobee</span>
          </>
        }
      >
        During my internship, I work with finance, accounting and sales teams to build AI tools for reporting, reconciliation and other day-to-day workflows.
      </TakeHead>

      <Stats
        items={[
          { value: '30+', label: 'tools shipped' },
          { value: '15+', label: 'agents in use' },
          { value: '25+', label: 'reusable AI skills' },
          { value: '2+ h', label: 'saved per user, every day' },
        ]}
      />

      <div className="mt-10 grid gap-7 sm:grid-cols-3 sm:gap-8">
        <Block label="01 Problem">{now.problem}</Block>
        <Block label="02 Shipped">{now.shipped}</Block>
        <Block label="03 Result" strong>
          {now.result}
        </Block>
      </div>

      <div className="mt-8 flex flex-wrap gap-1.5">
        {now.stack.map((s) => (
          <Tag key={s}>{s}</Tag>
        ))}
      </div>
    </>
  )
}
