import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getProfile, getProjects } from '../api/client';
import { profile as fallbackProfileBase } from '../../../server/data/profile.js';
import { experience as fallbackExperience } from '../../../server/data/experience.js';
import { skills as fallbackSkills } from '../../../server/data/skills.js';
import { hackathons as fallbackHackathons } from '../../../server/data/hackathons.js';
import { education as fallbackEducation } from '../../../server/data/education.js';
import { awards as fallbackAwards } from '../../../server/data/awards.js';
import { projects as fallbackProjects } from '../../../server/data/projects.js';

const DataContext = createContext(null);
const fallbackProfile = {
  ...fallbackProfileBase,
  experience: fallbackExperience,
  skills: fallbackSkills,
  hackathons: fallbackHackathons,
  education: fallbackEducation,
  awards: fallbackAwards,
};

/**
 * Fetches profile + projects once at app boot and shares them with every page
 * so route changes don't re-fetch. If the API is unavailable, the app renders
 * the same committed data modules instead of leaving sections empty.
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
      .catch((err) => {
        if (!alive) return;
        console.warn('[data fallback]', err);
        setProfile(fallbackProfile);
        setProjects(fallbackProjects);
        setError('Showing committed portfolio data because the API is unavailable.');
      });
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
