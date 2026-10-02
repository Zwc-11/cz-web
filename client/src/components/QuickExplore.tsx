import * as Dialog from '@radix-ui/react-dialog'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { experience, works } from '../content/portfolio'
import './QuickExplore.css'

export type ExploreSelection = { kind: 'project' | 'experience'; id: string }
export type ExploreRequest = { query: string; revision: number }

type ExploreItem = ExploreSelection & {
  title: string
  detail: string
  period: string
  tags: readonly string[]
  keywords: string
}

const normalize = (value: string) => value.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLowerCase()

const items: ExploreItem[] = [
  ...works.map(project => ({
    kind: 'project' as const,
    id: project.id,
    title: project.name,
    detail: project.event ? [project.event, project.award].filter(Boolean).join(' · ') : project.tagline,
    period: project.year,
    tags: project.tags,
    keywords: normalize([project.name, project.category, project.tagline, project.summary, project.problem, project.approach, project.result, project.event, project.award, project.year, ...project.tags].filter(Boolean).join(' ')),
  })),
  ...experience.map(job => ({
    kind: 'experience' as const,
    id: job.id,
    title: job.org,
    detail: `${job.role} · ${job.employmentType}`,
    period: job.period,
    tags: job.stack,
    keywords: normalize([job.org, job.role, job.employmentType, job.period, job.place, job.shipped, job.result, ...job.stack].join(' ')),
  })),
]

function isTyping(target: EventTarget | null) {
  return target instanceof HTMLElement && (
    target.isContentEditable || !!target.closest('input, textarea, select, [contenteditable="true"], [role="textbox"]')
  )
}

export function QuickExplore({ onSelect, searchRequest }: {
  onSelect: (selection: ExploreSelection) => void
  searchRequest?: ExploreRequest
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const [mac, setMac] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const leavingForItem = useRef(false)
  const returnFocus = useRef<HTMLElement | null>(null)
  const lastRequestRevision = useRef<number | undefined>(undefined)
  const id = useId()
  const requestQuery = searchRequest?.query
  const requestRevision = searchRequest?.revision

  const results = useMemo(() => {
    const terms = normalize(query).trim().split(/\s+/).filter(Boolean)
    const matched = items.filter(item => terms.every(term => item.keywords.includes(term)))
    const relevance = (item: ExploreItem) => {
      const title = normalize(item.title)
      return terms.reduce((score, term) => score + (title.startsWith(term) ? 3 : title.includes(term) ? 2 : 0), 0)
    }
    // Keep the two sections predictable while bringing close title matches to the top.
    return matched.sort((a, b) => a.kind === b.kind ? relevance(b) - relevance(a) : a.kind === 'project' ? -1 : 1)
  }, [query])

  function rememberFocus() {
    const active = document.activeElement
    returnFocus.current = active instanceof HTMLElement && active !== document.body ? active : null
  }

  function changeOpen(next: boolean) {
    if (next) {
      rememberFocus()
      leavingForItem.current = false
      setQuery('')
      setSelected(0)
    }
    setOpen(next)
  }

  function choose(item: ExploreItem) {
    leavingForItem.current = true
    setOpen(false)
    onSelect({ kind: item.kind, id: item.id })
  }

  useEffect(() => {
    if (requestRevision === undefined || requestQuery === undefined || requestRevision === lastRequestRevision.current) return
    lastRequestRevision.current = requestRevision
    if (!open) rememberFocus()
    leavingForItem.current = false
    setQuery(requestQuery)
    setSelected(0)
    setOpen(true)
    // A second technology click can update an already-open dialog.
    inputRef.current?.focus()
  }, [open, requestQuery, requestRevision])

  useEffect(() => {
    setMac(/Mac|iPhone|iPad/.test(navigator.platform))
    const keydown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat || event.isComposing) return
      const command = (event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === 'k'
      const slash = !open && !event.metaKey && !event.ctrlKey && !event.altKey && event.key === '/' && !isTyping(event.target)
      if (!command && !slash) return
      // Let an already-open project or photo dialog keep its keyboard controls.
      if (!open && document.querySelector('[role="dialog"][data-state="open"]')) return
      event.preventDefault()
      if (open) setOpen(false)
      else {
        rememberFocus()
        leavingForItem.current = false
        setQuery('')
        setSelected(0)
        setOpen(true)
      }
    }
    document.addEventListener('keydown', keydown)
    return () => document.removeEventListener('keydown', keydown)
  }, [open])

  useEffect(() => {
    if (open && results.length) document.getElementById(`${id}-option-${selected}`)?.scrollIntoView({ block: 'nearest' })
  }, [id, open, results, selected])

  const projectsCount = results.filter(item => item.kind === 'project').length
  const experienceCount = results.length - projectsCount

  return <Dialog.Root open={open} onOpenChange={changeOpen}>
    <Dialog.Trigger asChild>
      <button type="button" className="explore-trigger" aria-label="Explore projects and experience" aria-keyshortcuts="Control+k Meta+k /">
        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="m12.5 12.5 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span>Explore</span>
        <kbd aria-hidden="true">{mac ? '⌘' : 'Ctrl'} K</kbd>
      </button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="explore-overlay" />
      <Dialog.Content className="explore-dialog"
        onOpenAutoFocus={event => { event.preventDefault(); inputRef.current?.focus() }}
        onCloseAutoFocus={event => {
          if (leavingForItem.current) {
            event.preventDefault()
            return
          }
          const source = returnFocus.current
          if (source?.isConnected && !source.closest('[hidden]')) {
            event.preventDefault()
            source.focus({ preventScroll: true })
          }
        }}>
        <div className="explore-topline">
          <Dialog.Title className="explore-title">Explore my work</Dialog.Title>
          <Dialog.Close className="explore-close" aria-label="Close explore">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </Dialog.Close>
        </div>
        <Dialog.Description className="explore-description">Find a project, company, technology or hackathon.</Dialog.Description>
        <div className="explore-search">
          <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5" /><path d="m12.5 12.5 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          <input ref={inputRef} className="explore-input" placeholder="Try Python, ecobee or Hack the North…"
            aria-label="Search projects and experience" role="combobox" aria-autocomplete="list" aria-expanded="true"
            aria-controls={`${id}-results`} aria-activedescendant={results.length ? `${id}-option-${selected}` : undefined}
            value={query} autoComplete="off" autoCorrect="off" spellCheck={false}
            onChange={event => { setQuery(event.target.value); setSelected(0) }}
            onKeyDown={event => {
              if (event.nativeEvent.isComposing || !results.length) return
              if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault()
                setSelected(current => (current + (event.key === 'ArrowDown' ? 1 : results.length - 1)) % results.length)
              } else if (event.key === 'Enter') {
                event.preventDefault()
                choose(results[selected])
              }
            }} />
          {query && <button type="button" className="explore-clear" aria-label="Clear search" onClick={() => { setQuery(''); setSelected(0); inputRef.current?.focus() }}>Clear</button>}
        </div>
        <p className="explore-count" role="status" aria-live="polite" aria-atomic="true">
          {query.trim() ? `${results.length} ${results.length === 1 ? 'match' : 'matches'}` : `${works.length} projects · ${experience.length} experiences`}
        </p>
        <div className="explore-results" id={`${id}-results`} role="listbox" aria-label="Search results">
          {(['project', 'experience'] as const).map(kind => {
            const count = kind === 'project' ? projectsCount : experienceCount
            if (!count) return null
            return <div role="group" aria-labelledby={`${id}-${kind}`} key={kind}>
              <div className="explore-group-label" id={`${id}-${kind}`}>{kind === 'project' ? 'Projects' : 'Experience'} <span>{count}</span></div>
              {results.map((item, index) => {
                if (item.kind !== kind) return null
                const terms = normalize(query).trim().split(/\s+/).filter(Boolean)
                const matchingTags = item.tags.filter(tag => terms.some(term => normalize(tag).includes(term)))
                const tags = (matchingTags.length ? matchingTags : item.tags).slice(0, 3)
                return <button key={`${item.kind}-${item.id}`} id={`${id}-option-${index}`} type="button" role="option"
                  tabIndex={-1} aria-selected={selected === index} className="explore-result"
                  onPointerEnter={event => { if (event.pointerType === 'mouse') setSelected(index) }}
                  onClick={() => choose(item)}>
                  <span className="explore-result-main">
                    <span className="explore-result-heading"><span className="explore-result-title">{item.title}</span><span className="explore-result-period">{item.period}</span></span>
                    <span className="explore-result-detail">{item.detail}</span>
                    {!!tags.length && <span className="explore-result-tags">{tags.map(tag => <span key={tag}>{tag}</span>)}</span>}
                  </span>
                  <svg className="explore-result-arrow" width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              })}
            </div>
          })}
          {!results.length && <div className="explore-empty"><span>No matches yet.</span><p>Try a broader term, like AI, finance or Python.</p></div>}
        </div>
        <div className="explore-footer"><span><kbd>↑</kbd><kbd>↓</kbd> to explore <kbd>↵</kbd> to open</span><span><kbd>esc</kbd> to close</span></div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
}
