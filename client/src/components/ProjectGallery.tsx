import * as Dialog from '@radix-ui/react-dialog'
import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { projectMedia } from '../content/projectMedia'
import { IconArrowUpRight, IconClose } from './icons'
import '../styles/project-gallery.css'

/** A cover image that opens every project image full size, with captions and sources. */
export function ProjectGallery({ id, name }: { id: string; name: string }) {
  const photos = projectMedia[id] ?? []
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const reducedMotion = useReducedMotion()
  if (!photos.length) return null
  const cover = photos[0]
  const photo = photos[index]
  const move = (step: number) => { setDirection(step); setIndex(i => (i + step + photos.length) % photos.length) }

  return <Dialog.Root onOpenChange={open => { if (open) setIndex(0) }}>
    <Dialog.Trigger className="gallery-cover" aria-label={`Open ${name} images (${photos.length})`}>
      <img src={cover.thumb ?? cover.src} alt={cover.alt} loading="lazy" decoding="async" style={{ objectFit: cover.fit ?? 'cover', objectPosition: '50% 30%' }} />
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="gallery-overlay" />
      <Dialog.Content data-project-gallery className="gallery-dialog" onKeyDown={event => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault(); event.stopPropagation(); move(event.key === 'ArrowRight' ? 1 : -1)
        }
      }}>
        <header className="gallery-header">
          <Dialog.Title className="gallery-title">{name}</Dialog.Title>
          <Dialog.Close className="gallery-close" aria-label="Close"><IconClose size={18} /></Dialog.Close>
        </header>
        <figure className="gallery-figure">
          <motion.img key={photo.src} src={photo.src} alt={photo.alt} decoding="async"
            initial={reducedMotion ? false : { opacity: 0, x: direction * 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }} />
          <figcaption>
            <Dialog.Description>{photo.caption}</Dialog.Description>
            <a href={photo.source} target="_blank" rel="noreferrer noopener" className="portfolio-link">{photo.sourceLabel}<IconArrowUpRight size={13} /></a>
          </figcaption>
        </figure>
        {photos.length > 1 && <div className="gallery-controls">
          <button type="button" onClick={() => move(-1)} aria-label="Previous image">←</button>
          <p aria-live="polite">{index + 1} / {photos.length}</p>
          <button type="button" onClick={() => move(1)} aria-label="Next image">→</button>
        </div>}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
}
