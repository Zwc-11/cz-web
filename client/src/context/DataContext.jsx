import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getProfile, getProjects } from '../api/client';

const DataContext = createContext(null);

/**
 * Fetches profile + projects once at app boot and shares them with every page
 * so route changes don't re-fetch.
 */
export function DataProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    Promise.all([getProfile(), getProjects()])
      .then(([p, proj]) => {
        if (!alive) return;
        setProfile(p);
        setProjects(proj);
      })
      .catch((err) => alive && setError(err.message));
    return () => {
      alive = false;
    };
  }, []);

  const value = useMemo(() => ({ profile, projects, error }), [profile, projects, error]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
