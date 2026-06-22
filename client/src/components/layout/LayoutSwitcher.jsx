import { AnimatePresence, motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { useLayout } from '../../context/LayoutContext';
import { LAYOUT_ORDER, LAYOUTS } from '../../layouts/constants';

export default function LayoutSwitcher() {
  const { layout, setLayout, meta } = useLayout();

  return (
    <div className="layout-switcher fixed inset-x-0 bottom-0 z-[60] border-t border-white/[0.08] bg-black/88 backdrop-blur-xl">
      <div className="section-shell py-3 sm:py-4">
        <div className="mb-3 flex items-center gap-3">
          <Layers size={15} className="text-[var(--accent)]" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              Atmosphere
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={layout}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-sm text-white/85"
              >
                {meta.label}
                <span className="ml-2 text-white/35">· {meta.tagline}</span>
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <div className="layout-switcher-scroll flex gap-1.5 overflow-x-auto pb-[env(safe-area-inset-bottom)]">
          {LAYOUT_ORDER.map((id) => {
            const active = layout === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setLayout(id)}
                className={`min-h-[44px] shrink-0 border px-4 py-2 font-mono text-[10px] uppercase tracking-wider transition-colors ${
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
      </div>
    </div>
  );
}
