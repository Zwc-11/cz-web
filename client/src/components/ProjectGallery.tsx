import * as Dialog from '@radix-ui/react-dialog'
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { useEffect, useState, type PointerEvent } from 'react'
import { projectMedia, type ProjectImage } from '../content/projectMedia'
import { IconArrowUpRight, IconClose } from './icons'
import '../styles/project-gallery.css'

function DepthThumbnail({ photo, name, count, wide, open }: { photo: ProjectImage; name: string; count: number; wide: boolean; open: boolean }) {
  const reducedMotion = useReducedMotion()
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const reflection = useMotionValue(0)
  const spring = { stiffness: 180, damping: 24, mass: 0.7 }
  const x = useSpring(pointerX, spring)
  const y = useSpring(pointerY, spring)
  const light = useSpring(reflection, spring)
  const rotateX = useTransform(y, [-1, 1], [5, -5])
  const rotateY = useTransform(x, [-1, 1], [-7, 7])
  const imageX = useTransform(x, [-1, 1], [3, -3])
  const imageY = useTransform(y, [-1, 1], [2, -2])
  const imageScale = useTransform(light, [0, 1], [1, 1.065])
  const lightX = useTransform(x, value => `${50 + value * 45}%`)
  const lightY = useTransform(y, value => `${50 + value * 45}%`)
  const sheen = useMotionTemplate`radial-gradient(ellipse at ${lightX} ${lightY}, rgb(255 255 255 / .2), transparent 68%)`

  const reset = () => { pointerX.set(0); pointerY.set(0); reflection.set(0) }
  useEffect(() => { if (open || reducedMotion) reset() }, [open, reducedMotion])

  const followPointer = (event: PointerEvent<HTMLButtonElement>) => {
    if (reducedMotion || event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const rect = event.currentTarget.getBoundingClientRect()
    // Normalised coordinates keep the movement equally restrained at every size.
    pointerX.set(Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1)))
    pointerY.set(Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1)))
    reflection.set(1)
  }

  return <Dialog.Trigger asChild><motion.button type="button"
    className={`project-media-button project-depth-button${wide ? ' project-media-wide' : ''}`}
    aria-label={`View ${name} image gallery, ${count} ${count === 1 ? 'image' : 'images'}`}
    style={{ rotateX: reducedMotion ? 0 : rotateX, rotateY: reducedMotion ? 0 : rotateY, transformPerspective: 900 }}
    onPointerEnter={followPointer} onPointerMove={followPointer} onPointerLeave={reset}
    onPointerCancel={reset}
    onFocus={() => { if (!reducedMotion) reflection.set(0.5) }} onBlur={reset}>
    <motion.img src={photo.thumb ?? photo.src} alt={photo.alt} loading="lazy" decoding="async"
      style={{ objectFit: photo.fit ?? 'cover', x: photo.fit === 'contain' || reducedMotion ? 0 : imageX, y: photo.fit === 'contain' || reducedMotion ? 0 : imageY, scale: photo.fit === 'contain' || reducedMotion ? 1 : imageScale }} />
    <motion.span className="project-depth-sheen" aria-hidden="true" style={{ backgroundImage: sheen, opacity: reducedMotion ? 0 : light }} />
    <span className="project-media-label" aria-hidden="true">{count === 1 ? 'View image' : `${count} images`} <span>↗</span></span>
  </motion.button></Dialog.Trigger>
}

export function ProjectGallery({ id, name, wide = false }: { id: string; name: string; wide?: boolean }) {
  const photos = projectMedia[id] ?? []
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [open, setOpen] = useState(false)
  const reducedMotion = useReducedMotion()
  if (!photos.length) return null
  const photo = photos[index]
  const move = (next: number) => { setDirection(next); setIndex(i => (i + next + photos.length) % photos.length) }

  return <Dialog.Root open={open} onOpenChange={value => { setOpen(value); if (value) setIndex(0) }}>
    <DepthThumbnail photo={photos[0]} name={name} count={photos.length} wide={wide} open={open} />
    <Dialog.Portal>
      <Dialog.Overlay className="gallery-overlay gallery-depth-overlay" />
      <Dialog.Content data-project-gallery className="gallery-dialog gallery-depth-dialog" onKeyDown={event => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault(); event.stopPropagation(); move(event.key === 'ArrowRight' ? 1 : -1)
        }
      }}>
        <header className="gallery-header"><Dialog.Title className="text-[17px] font-semibold text-fg">{name} <span className="text-[12px] font-normal text-faint">/ Gallery</span></Dialog.Title><Dialog.Close className="gallery-close" aria-label="Close image gallery"><IconClose size={18} /></Dialog.Close></header>
        <figure className="gallery-figure"><motion.img key={photo.src} src={photo.src} alt={photo.alt} decoding="async"
          initial={reducedMotion ? false : { opacity: 0, x: direction * 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }} /><figcaption>
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
