import * as Dialog from '@radix-ui/react-dialog'
import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import './EngineeringLab.css'

const EngineeringLab = lazy(() => import('./EngineeringLab'))
export type DemoId = 'replay' | 'data' | 'requests'
const demos: { id: DemoId; title: string; hint: string; path: string }[] = [
  { id: 'replay', title: 'Replay & debug', hint: 'Find the first failure', path: 'M4 7h12m-3-3 3 3-3 3M20 17H8m3-3-3 3 3 3' },
  { id: 'data', title: 'Catch future data', hint: 'Move through time', path: 'M4 17h16M6 14V9m6 5V5m6 9v-3M4 5l3-2' },
  { id: 'requests', title: 'Parallel requests', hint: 'Make it faster, then break it', path: 'M4 12h4m0 0 4-6h8M8 12h12M8 12l4 6h8' },
]
const readDemo = (): DemoId | null => {
  const value = new URLSearchParams(window.location.search).get('demo')
  return demos.some(demo => demo.id === value) ? value as DemoId : null
}

class LabBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed ? <p className="lab-loading" role="alert">The demo could not load. Close this window and refresh the page to try again.</p> : this.props.children
  }
}

export function EngineeringLauncher() {
  const [demo, setDemo] = useState<DemoId | null>(readDemo)
  const opener = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const sync = () => setDemo(readDemo())
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  function choose(next: DemoId | null) {
    const url = new URL(window.location.href)
    if (next) url.searchParams.set('demo', next)
    else url.searchParams.delete('demo')
    window.history.replaceState(null, '', url)
    setDemo(next)
  }

  return <>
    <section className="engineering-launcher" aria-labelledby="engineering-title">
      <div className="engineering-launcher-heading"><h2 id="engineering-title">Try the engineering</h2><span>Small demos. Real behaviour.</span></div>
      <div className="engineering-launcher-grid">
        {demos.map(item => <button key={item.id} type="button" onClick={event => { opener.current = event.currentTarget; choose(item.id) }} aria-haspopup="dialog">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={item.path} /></svg>
          <span><strong>{item.title}</strong><span>{item.hint}</span></span><span className="engineering-launcher-arrow" aria-hidden="true">↗</span>
        </button>)}
      </div>
    </section>
    <Dialog.Root open={demo !== null} onOpenChange={open => { if (!open) choose(null) }}>
      <Dialog.Portal>
        <Dialog.Overlay className="lab-overlay" />
        <Dialog.Content className="lab-dialog" onCloseAutoFocus={event => { event.preventDefault(); (opener.current ?? document.querySelector<HTMLButtonElement>('.engineering-launcher button'))?.focus({ preventScroll: true }) }}>
          <div className="lab-dialog-heading">
            <div><span className="lab-eyebrow">Interactive engineering</span><Dialog.Title>Under the hood.</Dialog.Title></div>
            <Dialog.Close className="lab-close" aria-label="Close engineering demos"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">Change an input. Break a workflow. See why the result changes.</Dialog.Description>
          {demo && <LabBoundary><Suspense fallback={<p className="lab-loading" role="status">Loading the experiments…</p>}><EngineeringLab demo={demo} onDemo={choose} /></Suspense></LabBoundary>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </>
}
