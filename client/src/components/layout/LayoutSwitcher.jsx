import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Layers, X } from 'lucide-react';
import { useLayout } from '../../context/LayoutContext';
import { LAYOUT_ORDER, LAYOUTS } from '../../layouts/constants';

export default function LayoutSwitcher() {
  const { layout, setLayout, meta } = useLayout();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Slide the dock out of the way while scrolling down (so it never covers the
  // text being read on narrow screens); bring it back when scrolling up or near
  // the top. Disabled when the panel is open or reduced motion is requested.
  useEffect(() => {
    if (prefersReduced) return undefined;
    let lastY = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      if (y < 80) setHidden(false);
      else if (y > lastY + 6) setHidden(true);
      else if (y < lastY - 6) setHidden(false);
      lastY = y;
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [prefersReduced]);

  const concealed = hidden && !open;

  return (
    <motion.div
      ref={ref}
      className="layout-switcher fixed bottom-4 left-4 z-[60] sm:bottom-5 sm:left-5"
      animate={prefersReduced ? undefined : { y: concealed ? 88 : 0, opacity: concealed ? 0 : 1 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      style={{ pointerEvents: concealed ? 'none' : 'auto' }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="layout-switcher-panel absolute bottom-full left-0 mb-2 w-[min(86vw,20rem)] border border-white/[0.1] bg-black/90 p-3 backdrop-blur-xl"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Atmosphere</p>
                <p className="mt-0.5 text-sm text-white/85">
                  {meta.label}
                  <span className="ml-2 text-white/35">· {meta.tagline}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close atmosphere switcher"
                className="grid h-7 w-7 shrink-0 place-items-center text-white/40 transition-colors hover:text-white/80"
              >
                <X size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {LAYOUT_ORDER.map((id) => {
                const active = layout === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setLayout(id)}
                    className={`min-h-[40px] border px-3 py-2 text-left font-mono text-[10px] uppercase tracking-wider transition-colors ${
                      active
                        ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                        : 'border-white/10 text-white/45 hover:border-white/25 hover:text-white/75'
                    }`}
                    aria-pressed={active}
                  >
                    {LAYOUTS[id].label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Change atmosphere"
        className="group flex items-center gap-2 border border-white/[0.12] bg-black/90 py-2 pl-3 pr-3.5 backdrop-blur-xl transition-colors hover:border-[var(--accent)]/60"
      >
        <Layers size={14} className="text-[var(--accent)]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 transition-colors group-hover:text-white/80">
          {meta.label}
        </span>
      </button>
    </motion.div>
  );
}
