// Small, executable examples of the reliability ideas behind the portfolio.
// All records and endpoints here are synthetic; no project backend is called.
export type WorkflowState = {
  page: string
  company: string
  email: string
  plan: string
  submitted: boolean
}
export type ReplayFault = 'none' | 'missing-field' | 'broken-submit'
export type ReplayFrame = {
  label: string
  expected: WorkflowState
  actual: WorkflowState
  differences: (keyof WorkflowState)[]
  error?: string
}
type Command = { label: string; key: keyof WorkflowState; value: string | boolean }
const commands: Command[] = [
  { label: 'Open the form', key: 'page', value: 'Application' },
  { label: 'Fill company', key: 'company', value: 'Acme Studio' },
  { label: 'Fill email', key: 'email', value: 'hello@example.com' },
  { label: 'Choose a plan', key: 'plan', value: 'Team' },
  { label: 'Submit the form', key: 'submitted', value: true },
]
const emptyWorkflow = (): WorkflowState => ({ page: 'Start', company: '', email: '', plan: '', submitted: false })

export function replayWorkflow(fault: ReplayFault): ReplayFrame[] {
  let expected = emptyWorkflow()
  let actual = emptyWorkflow()
  const frames: ReplayFrame[] = [{ label: 'Ready to replay', expected, actual, differences: [] }]
  for (const command of commands) {
    expected = { ...expected, [command.key]: command.value }
    let error: string | undefined
    if (fault === 'missing-field' && command.key === 'email') error = 'The recorded email field no longer exists.'
    else if (fault === 'broken-submit' && command.key === 'submitted') error = 'Submit did not reach the confirmation state.'
    else actual = { ...actual, [command.key]: command.value }
    const differences = (Object.keys(expected) as (keyof WorkflowState)[]).filter(key => expected[key] !== actual[key])
    frames.push({ label: command.label, expected, actual, differences, error })
    // Stop at the first divergence, rather than masking it with later failures.
    if (differences.length) break
  }
  return frames
}

export type DataRecord = { id: string; metric: string; value: number; observed: number; available: number; revision: number }
export const sampleRecords: DataRecord[] = [
  { id: 'revenue-1', metric: 'Revenue', value: 42, observed: 2, available: 3, revision: 1 },
  { id: 'revenue-2', metric: 'Revenue', value: 48, observed: 2, available: 6, revision: 2 },
  { id: 'orders-1', metric: 'Orders', value: 130, observed: 4, available: 5, revision: 1 },
  { id: 'orders-2', metric: 'Orders', value: 145, observed: 4, available: 8, revision: 2 },
  { id: 'index-1', metric: 'Index', value: 102, observed: 5, available: 5, revision: 1 },
  { id: 'index-2', metric: 'Index', value: 108, observed: 7, available: 7, revision: 1 },
]

export function resolveRecords(records: readonly DataRecord[], day: number, enforceTime = true): DataRecord[] {
  const latest = new Map<string, DataRecord>()
  for (const record of records) {
    if (enforceTime && (record.observed > day || record.available > day)) continue
    const previous = latest.get(record.metric)
    if (!previous || record.available > previous.available || (record.available === previous.available && record.revision > previous.revision)) {
      latest.set(record.metric, record)
    }
  }
  return [...latest.values()]
}

export type RequestTask = { id: string; label: string; duration: number }
export const requestTasks: RequestTask[] = [
  { id: 'profile', label: 'Profile', duration: 320 },
  { id: 'catalog', label: 'Catalog', duration: 240 },
  { id: 'inventory', label: 'Inventory', duration: 410 },
  { id: 'prices', label: 'Prices', duration: 290 },
  { id: 'shipping', label: 'Shipping', duration: 260 },
  { id: 'reviews', label: 'Reviews', duration: 210 },
]
export type RequestEvent = { id: string; state: 'running' | 'done' | 'failed' | 'cached'; time: number }
export type RequestResult = { events: RequestEvent[]; elapsed: number; failures: string[] }
type PoolOptions = {
  concurrency: number
  signal?: AbortSignal
  cache?: ReadonlySet<string>
  fail?: string
  onEvent?: (event: RequestEvent) => void
}

export function waitForRequest(duration: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) { reject(new DOMException('Run cancelled', 'AbortError')); return }
    const abort = () => { clearTimeout(timer); reject(new DOMException('Run cancelled', 'AbortError')) }
    const timer = setTimeout(() => { signal?.removeEventListener('abort', abort); resolve() }, duration)
    signal?.addEventListener('abort', abort, { once: true })
  })
}

export async function runRequestPool(tasks: readonly RequestTask[], options: PoolOptions): Promise<RequestResult> {
  if (!Number.isInteger(options.concurrency) || options.concurrency < 1) throw new RangeError('Concurrency must be a positive integer')
  if (options.signal?.aborted) throw new DOMException('Run cancelled', 'AbortError')
  const start = performance.now()
  const events: RequestEvent[] = []
  const failures: string[] = []
  let cursor = 0
  function emit(id: string, state: RequestEvent['state']) {
    const event = { id, state, time: Math.round(performance.now() - start) }
    events.push(event)
    options.onEvent?.(event)
  }
  async function worker() {
    while (cursor < tasks.length) {
      if (options.signal?.aborted) throw new DOMException('Run cancelled', 'AbortError')
      const task = tasks[cursor++]
      if (options.cache?.has(task.id)) { emit(task.id, 'cached'); continue }
      emit(task.id, 'running')
      await waitForRequest(task.duration, options.signal)
      if (options.fail === task.id) { failures.push(task.id); emit(task.id, 'failed') }
      else emit(task.id, 'done')
    }
  }
  await Promise.all(Array.from({ length: Math.min(options.concurrency, tasks.length) }, worker))
  return { events, elapsed: Math.round(performance.now() - start), failures }
}
