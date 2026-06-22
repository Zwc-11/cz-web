import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { LAYOUTS, LAYOUT_ORDER, resolveLayoutId } from '../layouts/constants';

const STORAGE_KEY = 'cz-layout-mode';

const LayoutContext = createContext(null);

export function LayoutProvider({ children }) {
  const [layout, setLayoutState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return resolveLayoutId(saved);
    } catch {
      /* ignore */
    }
    return 'tapestry-loom';
  });

  useEffect(() => {
    const meta = LAYOUTS[layout] || LAYOUTS['tapestry-loom'];
    document.documentElement.setAttribute('data-layout', layout);
    document.documentElement.setAttribute('data-tapestry', meta.theme);
    try {
      localStorage.setItem(STORAGE_KEY, layout);
    } catch {
      /* ignore */
    }
  }, [layout]);

  const setLayout = useCallback((id) => {
    const resolved = resolveLayoutId(id);
    if (LAYOUTS[resolved]) setLayoutState(resolved);
  }, []);

  const cycleLayout = useCallback(() => {
    setLayoutState((current) => {
      const i = LAYOUT_ORDER.indexOf(current);
      return LAYOUT_ORDER[(i + 1) % LAYOUT_ORDER.length];
    });
  }, []);

  const value = useMemo(
    () => ({ layout, setLayout, cycleLayout, meta: LAYOUTS[layout] || LAYOUTS['tapestry-loom'] }),
    [layout, setLayout, cycleLayout]
  );

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
}

export function useLayout() {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error('useLayout must be used within LayoutProvider');
  return ctx;
}
