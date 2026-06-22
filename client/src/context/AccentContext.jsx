import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const ACCENTS = ['cyan', 'amber', 'violet'];

const AccentContext = createContext(null);

export function AccentProvider({ children }) {
  const [index, setIndex] = useState(0);
  const accent = ACCENTS[index];

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
  }, [accent]);

  const cycleAccent = useCallback(() => {
    setIndex((i) => (i + 1) % ACCENTS.length);
  }, []);

  const value = useMemo(
    () => ({ accent, cycleAccent }),
    [accent, cycleAccent]
  );

  return (
    <AccentContext.Provider value={value}>
      {children}
    </AccentContext.Provider>
  );
}

export function useAccent() {
  const ctx = useContext(AccentContext);
  if (!ctx) throw new Error('useAccent must be used within AccentProvider');
  return ctx;
}
