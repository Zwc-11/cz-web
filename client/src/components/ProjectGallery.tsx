import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { projectMedia } from '../content/projectMedia'
import { IconArrowUpRight, IconClose } from './icons'

export function ProjectGallery({ id, name, wide = false }: { id: string; name: string; wide?: boolean }) {
  const photos = projectMedia[id] ?? []
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)
  if (!photos.length) return null
  const photo = photos[index]
  const move = (direction: number) => setIndex(i => (i + direction + photos.length) % photos.length)

  return <Dialog.Root open={open} onOpenChange={value => { setOpen(value); if (value) setIndex(0) }}>
    <Dialog.Trigger asChild>
      <button type="button" className={`project-media-button${wide ? ' project-media-wide' : ''}`} aria-label={`View ${name} image gallery, ${photos.length} ${photos.length === 1 ? 'image' : 'images'}`}>
        <img src={photos[0].thumb ?? photos[0].src} alt={photos[0].alt} loading="lazy" decoding="async" style={{objectFit:photos[0].fit ?? 'cover'}} />
        <span className="project-media-label" aria-hidden="true">{photos.length === 1 ? 'View image' : `${photos.length} images`} <span>↗</span></span>
      </button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="gallery-overlay" />
      <Dialog.Content data-project-gallery className="gallery-dialog" onKeyDown={event => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault(); event.stopPropagation(); move(event.key === 'ArrowRight' ? 1 : -1)
        }
      }}>
        <header className="gallery-header"><Dialog.Title className="text-[17px] font-semibold text-fg">{name} <span className="text-[12px] font-normal text-faint">/ Gallery</span></Dialog.Title><Dialog.Close className="gallery-close" aria-label="Close image gallery"><IconClose size={18} /></Dialog.Close></header>
        <figure className="gallery-figure"><img key={photo.src} src={photo.src} alt={photo.alt} decoding="async" /><figcaption>
          <Dialog.Description className="text-[13px] leading-relaxed text-muted">{photo.caption}</Dialog.Description>
          <a href={photo.source} target="_blank" rel="noreferrer noopener" className="portfolio-link">{photo.sourceLabel}<IconArrowUpRight size={13}/></a>
        </figcaption></figure>
        {photos.length > 1 && <div className="gallery-controls">
          <button type="button" onClick={() => move(-1)} aria-label="Previous image">←</button>
          <p aria-live="polite" className="text-[12px] text-faint">{index + 1} / {photos.length}</p>
          <button type="button" onClick={() => move(1)} aria-label="Next image">→</button>
        </div>}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
}
