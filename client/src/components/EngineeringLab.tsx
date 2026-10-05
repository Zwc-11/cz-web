import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { useReducedMotion } from 'motion/react'
import type { DemoId } from './EngineeringLauncher'
import { replayWorkflow, requestTasks, resolveRecords, runRequestPool, sampleRecords, type ReplayFault, type RequestEvent, type RequestResult, type WorkflowState } from '../lib/engineering'

const demoTabs: { id: DemoId; label: string }[] = [{ id: 'replay', label: 'Replay & debug' }, { id: 'data', label: 'Time & data' }, { id: 'requests', label: 'Parallel requests' }]
const projectLinks: Record<DemoId, { name: string; href: string }> = {
  replay: { name: 'AgentReplay', href: 'https://github.com/Zwc-11/agentreplay' },
  data: { name: 'Hindsight', href: 'https://github.com/Zwc-11/Hindsight' },
  requests: { name: 'Portfolio source', href: 'https://github.com/Zwc-11/cz-web/blob/master/client/src/lib/engineering.ts' },
}
const source = 'https://github.com/Zwc-11/cz-web/blob/master/client/src/lib/engineering.ts'
const formatTime = (time: number) => time < 1000 ? `${time} ms` : `${(time / 1000).toFixed(2)} s`

function DemoHeading({ number, title, children }: { number: string; title: string; children: string }) {
  return <div className="lab-demo-heading"><span className="lab-demo-number" aria-hidden="true">{number}</span><div><h3>{title}</h3><p>{children}</p></div></div>
}

function WorkflowPreview({ state, title, differences }: { state: WorkflowState; title: string; differences?: (keyof WorkflowState)[] }) {
  return <div className="lab-workflow-preview">
    <div className="lab-preview-bar"><span aria-hidden="true">● ● ●</span><span>{title}</span><span>{state.page}</span></div>
    <div className="lab-preview-form">
      {(['company', 'email', 'plan'] as const).map(key => <div key={key} className="lab-preview-field" data-different={differences?.includes(key)}><span>{key === 'company' ? 'Company' : key === 'email' ? 'Email' : 'Plan'}</span><span>{state[key] || '—'}</span></div>)}
      <div className="lab-preview-submit" data-different={differences?.includes('submitted')} data-complete={state.submitted}>{state.submitted ? '✓ Application received' : 'Awaiting submission'}</div>
    </div>
  </div>
}

function ReplayDemo() {
  const reduce = useReducedMotion()
  const [fault, setFault] = useState<ReplayFault>('missing-field')
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const frames = replayWorkflow(fault)
  const frame = frames[Math.min(step, frames.length - 1)]
  const atEnd = step === frames.length - 1
  useEffect(() => {
    if (!playing) return
    if (reduce) { setStep(frames.length - 1); setPlaying(false); return }
    if (atEnd) { setPlaying(false); return }
    const timer = window.setTimeout(() => setStep(current => current + 1), 540)
    return () => window.clearTimeout(timer)
  }, [playing, step, atEnd, reduce, frames.length])

  function scenario(next: ReplayFault) { setFault(next); setStep(0); setPlaying(false) }
  return <>
    <DemoHeading number="01" title="Find the first thing that broke.">Replay the same actions against a changed form. Compare the state after every step.</DemoHeading>
    <div className="lab-controls lab-scenarios" role="group" aria-label="Choose a replay scenario">
      {([{ id: 'none', label: 'Matching form' }, { id: 'missing-field', label: 'Rename email field' }, { id: 'broken-submit', label: 'Break submit' }] as const).map(item => <button type="button" key={item.id} aria-pressed={fault === item.id} onClick={() => scenario(item.id)}>{item.label}</button>)}
    </div>
    <div className="lab-workflows"><WorkflowPreview state={frame.expected} title="Recorded state" /><WorkflowPreview state={frame.actual} title="Replayed state" differences={frame.differences} /></div>
    <div className="lab-playback">
      <button className="lab-primary" type="button" onClick={() => { if (playing) setPlaying(false); else { if (atEnd) setStep(0); setPlaying(true) } }}>{playing ? 'Pause replay' : atEnd ? 'Replay again' : 'Run replay'}<span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span></button>
      <button type="button" disabled={atEnd} onClick={() => { setPlaying(false); setStep(current => Math.min(current + 1, frames.length - 1)) }}>Step forward →</button>
      <button type="button" onClick={() => { setPlaying(false); setStep(0) }}>Reset</button><span className="lab-step-count">Step {step} / {frames.length - 1}</span>
    </div>
    <ol className="lab-replay-trace" aria-label="Replay trace">
      {frames.slice(1).map((item, index) => <li key={item.label}><button type="button" onClick={() => { setPlaying(false); setStep(index + 1) }} aria-current={step === index + 1 ? 'step' : undefined} data-visited={step > index} data-failed={step > index && item.differences.length > 0}><span>{String(index + 1).padStart(2, '0')}</span><span>{item.label}</span><span>{step <= index ? 'Pending' : item.differences.length ? 'Diverged' : 'Matched'}</span></button></li>)}
    </ol>
    <div className="lab-verdict" data-tone={frame.differences.length ? 'fire' : 'wood'} role="status" aria-live="polite" aria-atomic="true"><strong>{frame.differences.length ? `First divergence: ${frame.differences.join(', ')}` : atEnd ? 'All five steps match.' : 'Inspect each step, or run the replay.'}</strong><p>{frame.error ?? (atEnd ? 'The replay reached the exact recorded confirmation state.' : 'The trace is generated from state transitions. Click any step to inspect it.')}</p></div>
    <details className="lab-explanation"><summary>How it works</summary><p>Each recorded action creates a new state. The replay applies that action and compares every field with the recording. It stops at the first difference, so a later error cannot hide the original cause.</p><pre><code>{`const differences = Object.keys(expected)\n  .filter(key => expected[key] !== actual[key]);\n\nif (differences.length) stopReplay();`}</code></pre></details>
  </>
}

function DataDemo() {
  const [day, setDay] = useState(5)
  const [guard, setGuard] = useState(true)
  const safe = resolveRecords(sampleRecords, day)
  const latest = resolveRecords(sampleRecords, day, false)
  const selected = guard ? safe : latest
  const leaks = selected.filter(record => record.available > day || record.observed > day)
  const withheld = sampleRecords.filter(record => record.available > day || record.observed > day)
  return <>
    <DemoHeading number="02" title="Can you know that yet?">A record can describe yesterday and still arrive tomorrow. Move the clock to see what was actually available.</DemoHeading>
    <div className="lab-clock-controls"><label htmlFor="lab-day">Decision time <strong>Day {day}</strong></label><input id="lab-day" type="range" min="1" max="9" step="1" value={day} onChange={event => setDay(Number(event.target.value))} aria-valuetext={`Day ${day}`} /><button type="button" className="lab-guard" aria-pressed={guard} onClick={() => setGuard(current => !current)}><span aria-hidden="true">{guard ? '✓' : '!'}</span> Time check {guard ? 'on' : 'off'}</button></div>
    <div className="lab-data-timeline" role="img" aria-label={`Record publication timeline. Decision time is day ${day}. ${withheld.length} records were not available yet.`}>
      <div className="lab-timeline-axis"><span>Published</span><div>{Array.from({ length: 9 }, (_, index) => <span key={index}>{index + 1}</span>)}</div></div>
      {sampleRecords.map(record => <div key={record.id} className="lab-data-record" data-future={record.available > day || record.observed > day}><span>{record.metric} <small>{record.metric === 'Index' ? `D${record.observed}` : `v${record.revision}`}</small></span><div><span className="lab-observation-line" style={{ left: `${(record.observed - 1) / 9 * 100 + 5.55}%`, width: `${(record.available - record.observed) / 9 * 100}%` }} /><span className="lab-publication" style={{ left: `${(record.available - 1) / 9 * 100 + 5.55}%` }}>{record.value}</span></div></div>)}
      <div className="lab-time-marker" style={{ '--day': day } as CSSProperties}><span>Now</span></div>
    </div>
    <div className="lab-timeline-legend"><span><i /> Available record</span><span><i /> Future record</span><span>Line: observed → published</span></div>
    <div className="lab-verdict" data-tone={leaks.length ? 'fire' : 'wood'} role="status" aria-live="polite" aria-atomic="true"><strong>{leaks.length ? `${leaks.length} future ${leaks.length === 1 ? 'value leaked' : 'values leaked'} into the result.` : `${selected.length} ${selected.length === 1 ? 'value' : 'values'} available. No future data.`}</strong><p>{leaks.length ? 'Latest does not mean available at the time. Turn the time check on to restore the historical snapshot.' : `${withheld.length} later ${withheld.length === 1 ? 'record is' : 'records are'} withheld. Revisions enter the result only after publication.`}</p></div>
    <div className="lab-data-output" data-guard={guard}><div><span>Metric</span><span>Latest in database{!guard && <small>Using this</small>}</span><span>Known on day {day}{guard && <small>Using this</small>}</span></div>{latest.map(record => { const known = safe.find(row => row.metric === record.metric); return <div key={record.metric}><strong>{record.metric}</strong><span data-leaked={record.available > day || record.observed > day}>{record.value}{(record.available > day || record.observed > day) && <small>future</small>}</span><span>{known?.value ?? 'Not available'}</span></div> })}</div>
    <details className="lab-explanation"><summary>How it works</summary><p>The check uses two timestamps: when the event happened and when the record became available. Both must be at or before the decision time. Among the remaining records, the most recent publication and revision win.</p><pre><code>{`if (record.observed > day || record.available > day)\n  continue;\n\n// Select the newest available version per metric.`}</code></pre></details>
  </>
}

type LaneState = { events: RequestEvent[]; result?: RequestResult }
function RequestLane({ title, lane, running, scale }: { title: string; lane: LaneState; running: boolean; scale: number }) {
  return <div className="lab-request-lane"><div className="lab-lane-heading"><strong>{title}</strong><span>{lane.result ? formatTime(lane.result.elapsed) : running ? 'Running…' : lane.events.length ? 'Stopped' : 'Ready'}</span></div>
    <ol>{requestTasks.map(task => {
      const events = lane.events.filter(event => event.id === task.id)
      const latest = events.at(-1)
      const state = latest?.state === 'running' && !running ? 'cancelled' : latest?.state ?? 'queued'
      const start = events.find(event => event.state === 'running')
      const finish = events.find(event => event.state === 'done' || event.state === 'failed')
      return <li key={task.id} data-state={state}><span>{task.label}</span><div className="lab-request-track">{latest?.state === 'cached' ? <span className="lab-cache-hit">cache hit</span> : start ? <span className="lab-request-bar" style={{ left: `${start.time / scale * 90}%`, width: `${Math.max(2, (finish ? finish.time - start.time : task.duration) / scale * 90)}%` }} /> : null}</div><span>{state === 'done' ? '✓' : state === 'failed' ? 'Failed' : state === 'running' ? 'Running' : state === 'cached' ? '✓' : state === 'cancelled' ? 'Stopped' : '—'}</span></li>
    })}</ol><div className="lab-lane-axis"><span>0</span><span>Local time →</span><span>{formatTime(scale)}</span></div>
  </div>
}

function RequestsDemo() {
  const [concurrency, setConcurrency] = useState(3)
  const [executedConcurrency, setExecutedConcurrency] = useState(3)
  const [failure, setFailure] = useState(false)
  const [cacheEnabled, setCacheEnabled] = useState(false)
  const [cached, setCached] = useState<string[]>([])
  const [lanes, setLanes] = useState<LaneState[]>([{ events: [] }, { events: [] }])
  const [running, setRunning] = useState(false)
  const [message, setMessage] = useState('Run both approaches. The bars and times come from the actual local execution.')
  const controller = useRef<AbortController | null>(null)
  const runButton = useRef<HTMLButtonElement | null>(null)
  useEffect(() => () => { controller.current?.abort(); controller.current = null }, [])

  function cancel() {
    controller.current?.abort()
    controller.current = null
    setRunning(false)
    setMessage('Run cancelled. The remaining requests were stopped.')
  }

  async function run() {
    controller.current?.abort()
    const current = new AbortController()
    controller.current = current
    setLanes([{ events: [] }, { events: [] }])
    setRunning(true)
    setExecutedConcurrency(concurrency)
    setMessage('Comparing both approaches with the same local endpoints…')
    const cache = cacheEnabled ? new Set(cached) : undefined
    try {
      const results = await Promise.all([1, concurrency].map((workers, index) => runRequestPool(requestTasks, {
        concurrency: workers, signal: current.signal, cache, fail: failure ? 'inventory' : undefined,
        onEvent: event => {
          if (controller.current !== current || current.signal.aborted) return
          setLanes(previous => previous.map((lane, position) => position === index ? { ...lane, events: [...lane.events, event] } : lane))
        },
      }).then(result => {
        if (controller.current === current && !current.signal.aborted) setLanes(previous => previous.map((lane, position) => position === index ? { ...lane, result } : lane))
        return result
      })))
      if (controller.current !== current || current.signal.aborted) return
      setCached(previous => [...new Set([...previous, ...results[1].events.filter(event => event.state === 'done').map(event => event.id)])])
      const savings = results[0].elapsed ? Math.round((1 - results[1].elapsed / results[0].elapsed) * 100) : 0
      const comparison = Math.abs(savings) < 5 ? 'Both approaches took about the same time in this run.' : `${concurrency} at a time finished ${Math.abs(savings)}% ${savings > 0 ? 'sooner' : 'later'} in this run.`
      setMessage(results[1].failures.length ? `Inventory failed. The other five requests still completed. Successful responses can be reused on the next run.` : cache?.size === requestTasks.length ? 'All six responses came from the local cache. No endpoint timers ran.' : `${comparison} ${cacheEnabled ? 'Successful responses are cached for the next run.' : 'Turn on caching and run again to reuse successful responses.'}`)
    } catch (error) {
      if (controller.current === current && !(error instanceof DOMException && error.name === 'AbortError')) setMessage('The run could not complete. Reset and try again.')
    } finally {
      if (controller.current === current) { controller.current = null; setRunning(false) }
    }
  }

  function reset() { cancel(); setLanes([{ events: [] }, { events: [] }]); setCached([]); setMessage('Results and cache cleared. Ready for a fresh comparison.') }
  const failed = lanes.some(lane => lane.result?.failures.length)
  const scale = Math.max(requestTasks.reduce((sum, task) => sum + task.duration, 0), ...lanes.flatMap(lane => lane.events.map(event => event.time + (event.state === 'running' ? requestTasks.find(task => task.id === event.id)!.duration : 0))))
  return <>
    <DemoHeading number="03" title="Six requests. One bottleneck.">Compare one-at-a-time execution with a bounded parallel pool. Then add a failure or reuse the cache.</DemoHeading>
    <div className="lab-request-controls"><label htmlFor="lab-concurrency">Parallel limit <strong>{concurrency}</strong><input id="lab-concurrency" type="range" min="1" max="6" value={concurrency} disabled={running} onChange={event => setConcurrency(Number(event.target.value))} /></label><label className="lab-check"><input type="checkbox" checked={failure} disabled={running} onChange={event => setFailure(event.target.checked)} />Fail inventory</label><label className="lab-check"><input type="checkbox" checked={cacheEnabled} disabled={running} onChange={event => setCacheEnabled(event.target.checked)} />Use cache <span>{cached.length}/6</span></label></div>
    <div className="lab-request-lanes"><RequestLane title="Sequential · 1 at a time" lane={lanes[0]} running={running} scale={scale} /><RequestLane title={`Parallel · ${lanes[1].events.length ? executedConcurrency : concurrency} at a time`} lane={lanes[1]} running={running} scale={scale} /></div>
    <div className="lab-playback"><button ref={runButton} type="button" className="lab-primary" aria-disabled={running || undefined} onClick={() => { if (!running) void run() }}>Run comparison <span aria-hidden="true">▶</span></button>{running && <button type="button" onClick={() => { cancel(); runButton.current?.focus({ preventScroll: true }) }}>Cancel run</button>}<button type="button" onClick={reset}>Reset & clear cache</button></div>
    <div className="lab-verdict" data-tone={failed ? 'fire' : 'wood'} role="status" aria-live="polite" aria-atomic="true"><strong>{running ? 'Requests in flight.' : message.startsWith('Run cancelled.') ? 'Run cancelled.' : failed ? 'One failure. Five usable results.' : lanes[1].result ? 'Execution complete.' : 'Ready to compare.'}</strong><p>{message}</p></div>
    <p className="lab-small-note">Synthetic endpoints use 210–410 ms local timers. These are browser measurements, not production benchmarks. A cache hit takes priority over the failure switch.</p>
    <details className="lab-explanation"><summary>How it works</summary><p>A fixed number of workers takes tasks from one shared queue. Each worker checks the cache before starting. A failed response does not stop unrelated tasks. Cancelling the run aborts all active timers.</p><pre><code>{`await Promise.all(\n  Array.from({ length: concurrency }, worker)\n);\n\n// Each worker takes the next queued request.\n// Cached requests skip execution.`}</code></pre></details>
  </>
}

export default function EngineeringLab({ demo, onDemo }: { demo: DemoId; onDemo: (id: DemoId) => void }) {
  const [copyStatus, setCopyStatus] = useState('')
  const refs = useRef<Partial<Record<DemoId, HTMLButtonElement | null>>>({})
  function tabKey(event: KeyboardEvent<HTMLButtonElement>) {
    const index = demoTabs.findIndex(tab => tab.id === demo)
    const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    const target = direction ? demoTabs[(index + direction + demoTabs.length) % demoTabs.length] : event.key === 'Home' ? demoTabs[0] : event.key === 'End' ? demoTabs.at(-1)! : null
    if (!target) return
    event.preventDefault()
    onDemo(target.id)
    refs.current[target.id]?.focus()
  }
  async function copyLink() {
    try { await navigator.clipboard.writeText(window.location.href); setCopyStatus('Link copied') }
    catch { setCopyStatus('Copy the link from your address bar') }
  }
  useEffect(() => setCopyStatus(''), [demo])
  return <>
    <div className="lab-tabs" role="tablist" aria-label="Engineering experiments">{demoTabs.map(tab => <button type="button" key={tab.id} role="tab" id={`lab-tab-${tab.id}`} aria-selected={demo === tab.id} aria-controls={`lab-panel-${tab.id}`} tabIndex={demo === tab.id ? 0 : -1} ref={el => { refs.current[tab.id] = el }} onKeyDown={tabKey} onClick={() => onDemo(tab.id)}>{tab.label}</button>)}</div>
    {demoTabs.map(tab => <div key={tab.id} className="lab-panel" role="tabpanel" id={`lab-panel-${tab.id}`} aria-labelledby={`lab-tab-${tab.id}`} tabIndex={0} hidden={demo !== tab.id}>
      {demo === tab.id && (tab.id === 'replay' ? <ReplayDemo /> : tab.id === 'data' ? <DataDemo /> : <RequestsDemo />)}
    </div>)}
    <div className="lab-footer"><p>Browser demos inspired by my work. Sample data; no project backend connected.</p><div><a href={projectLinks[demo].href} target="_blank" rel="noreferrer noopener">{projectLinks[demo].name} ↗</a>{demo !== 'requests' && <a href={source} target="_blank" rel="noreferrer noopener">Demo source ↗</a>}<button type="button" onClick={() => void copyLink()}>Copy demo link</button></div><span role="status" className="lab-copy-status">{copyStatus}</span></div>
  </>
}
