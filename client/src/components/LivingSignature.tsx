import { useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { createSignatureRenderer, type SignatureForm, type SignatureRenderer } from '../lib/signatureRenderer'
import './LivingSignature.css'

const forms: SignatureForm[] = ['orbit', 'weave', 'bloom']

function staticCurves(form: SignatureForm) {
  return Array.from({ length: 20 }, (_, band) => {
    const phi = band / 19 * Math.PI * 2
    const points = Array.from({ length: 97 }, (_, step) => {
      const t = step / 96 * Math.PI * 2
      const r = form === 'bloom' ? .58 + .58 * Math.abs(Math.cos(3 * t)) ** 1.4 : 1.03 + .28 * Math.cos(3 * t)
      const lat = (band / 19 - .5) * 2.8
      const x = form === 'weave' ? Math.cos(lat) * Math.cos(t) : (r + .17 * Math.cos(phi)) * Math.cos((form === 'orbit' ? 2 : 1) * t)
      const y = form === 'weave' ? Math.sin(lat) + .15 * Math.sin(t) : (r + .17 * Math.cos(phi)) * Math.sin((form === 'orbit' ? 2 : 1) * t) * .7 + .16 * Math.sin(phi)
      return `${step ? 'L' : 'M'}${(200 + x * 76).toFixed(2)},${(110 + y * 70).toFixed(2)}`
    })
    return { path: points.join(' '), wood: band < 10 }
  })
}

export function LivingSignature() {
  const [form, setForm] = useState<SignatureForm>('orbit')
  const [paused, setPaused] = useState(false)
  const [ready, setReady] = useState(false)
  const [contextVersion, setContextVersion] = useState(0)
  const reduce = !!useReducedMotion()
  const canvas = useRef<HTMLCanvasElement>(null)
  const renderer = useRef<SignatureRenderer | null>(null)
  const drag = useRef<{ id: number; x: number; y: number } | null>(null)
  const tap = useRef<{ id: number; x: number; y: number } | null>(null)
  const curves = useMemo(() => staticCurves(form), [form])

  useEffect(() => {
    const element = canvas.current
    if (!element) return
    const scene = createSignatureRenderer(element, reduce, () => { setReady(false); drag.current = null; tap.current = null })
    const restore = () => setContextVersion(value => value + 1)
    element.addEventListener('webglcontextrestored', restore)
    renderer.current = scene
    scene?.form(form)
    scene?.pause(paused)
    setReady(!!scene)
    return () => {
      element.removeEventListener('webglcontextrestored', restore)
      scene?.destroy(); renderer.current = null; drag.current = null; tap.current = null
    }
    // Form and pause changes update uniforms without replacing the canvas context.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, contextVersion])
  useEffect(() => renderer.current?.form(form), [form])
  useEffect(() => renderer.current?.pause(paused), [paused])

  return <section className="living-signature" aria-label="Wood and fire interactive sculpture" data-renderer={ready ? 'webgl' : 'static'}>
    <div className="signature-toolbar">
      <span className="signature-caption"><span style={{ color: 'var(--wood)' }}>木</span><span style={{ color: 'var(--fire)' }}>火</span><span>In motion</span></span>
      <div className="signature-forms" role="group" aria-label="Sculpture form">
        {forms.map(value => <button key={value} type="button" aria-pressed={form === value} onClick={() => setForm(value)}>{value[0].toUpperCase() + value.slice(1)}</button>)}
      </div>
    </div>
    <div className="signature-stage" role={ready && !reduce ? 'group' : 'img'} tabIndex={ready && !reduce ? 0 : undefined}
      aria-label={ready && !reduce ? 'Interactive sculpture. Drag to rotate, press Enter for a ripple, or use arrow keys to rotate.' : `Wood and fire sculpture in ${form} form.`}
      onPointerDown={event => {
        if (!ready || reduce || (event.pointerType === 'mouse' && event.button !== 0)) return
        const rect = event.currentTarget.getBoundingClientRect()
        renderer.current?.pointer((event.clientX - rect.left) / rect.width * 2 - 1, 1 - (event.clientY - rect.top) / rect.height * 2)
        if (event.pointerType === 'mouse') {
          renderer.current?.ripple()
          drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY }
          event.currentTarget.setPointerCapture(event.pointerId)
        } else tap.current = { id: event.pointerId, x: event.clientX, y: event.clientY }
      }} onPointerMove={event => {
        if (tap.current?.id === event.pointerId && Math.hypot(event.clientX - tap.current.x, event.clientY - tap.current.y) > 10) tap.current = null
        if (event.pointerType !== 'mouse' || !ready || reduce) return
        const rect = event.currentTarget.getBoundingClientRect()
        renderer.current?.pointer((event.clientX - rect.left) / rect.width * 2 - 1, 1 - (event.clientY - rect.top) / rect.height * 2)
        if (drag.current?.id === event.pointerId) {
          renderer.current?.rotate((event.clientX - drag.current.x) * .008, (event.clientY - drag.current.y) * .008)
          drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY }
        }
      }} onPointerUp={event => {
        if (tap.current?.id === event.pointerId && ready && !reduce) renderer.current?.ripple()
        drag.current = null; tap.current = null
      }} onPointerCancel={() => { drag.current = null; tap.current = null }} onLostPointerCapture={() => { drag.current = null }}
      onKeyDown={event => {
        if (!ready || reduce) return
        const direction: Record<string, [number, number]> = { ArrowLeft: [-.18, 0], ArrowRight: [.18, 0], ArrowUp: [0, -.18], ArrowDown: [0, .18] }
        if (direction[event.key]) { event.preventDefault(); renderer.current?.rotate(...direction[event.key]) }
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); renderer.current?.ripple() }
      }}>
      <svg className="signature-static" viewBox="0 0 400 220" fill="none" aria-hidden="true">{curves.map((curve, i) => <path key={i} d={curve.path} stroke={curve.wood ? 'var(--wood)' : 'var(--fire)'} strokeWidth=".7" opacity=".45" />)}</svg>
      <canvas ref={canvas} className="signature-canvas" aria-hidden="true" />
      <span className="signature-coordinate signature-coordinate-left" aria-hidden="true">GROWTH</span>
      <span className="signature-coordinate signature-coordinate-right" aria-hidden="true">WARMTH</span>
    </div>
    <div className="signature-bottom">
      <p>{reduce ? 'Motion reduced · choose a form to explore.' : ready ? <><span className="signature-mouse-hint">Drag to turn · </span>Tap for a ripple</> : 'A study in wood & fire.'}</p>
      <div className="signature-actions">
        <button type="button" onClick={() => setPaused(value => !value)} disabled={reduce || !ready} aria-pressed={paused || reduce} aria-label={reduce ? 'Sculpture motion disabled' : paused ? 'Resume sculpture motion' : 'Pause sculpture motion'}>{reduce ? 'Motion off' : paused ? 'Resume' : 'Pause'}</button>
        <button type="button" onClick={() => { setForm('orbit'); renderer.current?.reset() }}>Reset</button>
      </div>
    </div>
  </section>
}
