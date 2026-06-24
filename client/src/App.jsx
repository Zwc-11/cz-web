import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AccentProvider } from './context/AccentContext';
import { LayoutProvider } from './context/LayoutContext';
import { DataProvider, useData } from './context/DataContext';
import NavBar from './components/layout/NavBar';
import LayoutSwitcher from './components/layout/LayoutSwitcher';
import ScrollProgress from './components/interactive/ScrollProgress';
import Spotlight from './components/interactive/Spotlight';
import Preloader from './components/interactive/Preloader';
import CustomCursor from './components/interactive/CustomCursor';
import ErrorBoundary from './components/interactive/ErrorBoundary';
import PageDots from './components/interactive/PageDots';
import ThemeTransition from './components/interactive/ThemeTransition';
import ScrollToTop from './components/routing/ScrollToTop';
import HomePage from './pages/HomePage';
import WorkPage from './pages/WorkPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

const ThreeBackground = lazy(() => import('./components/three/ThreeBackground'));

function LoadingShell() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="font-mono text-sm text-white/40">Loading…</div>
    </div>
  );
}

function RoutedPages() {
  const location = useLocation();
  const { profile, projects, error } = useData();

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="max-w-sm text-sm text-white/60">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="border border-white/20 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/70 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!profile || !projects) return <LoadingShell />;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage profile={profile} />} />
        <Route path="/work" element={<WorkPage projects={projects} />} />
        <Route path="/work/:id" element={<ProjectDetailPage projects={projects} />} />
        <Route path="/about" element={<AboutPage profile={profile} />} />
        <Route path="/contact" element={<ContactPage contact={profile.contact} />} />
        <Route path="*" element={<HomePage profile={profile} />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  useEffect(() => {
    document.documentElement.setAttribute('data-accent', 'cyan');
  }, []);

  return (
    <AccentProvider>
      <LayoutProvider>
        <DataProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Preloader />
            <CustomCursor />
            <div className="relative min-h-screen pb-20">
              <ErrorBoundary
                label="ThreeBackground"
                fallback={<div className="three-bg three-bg--static fixed inset-0 z-0 bg-black" aria-hidden />}
              >
                <Suspense fallback={<div className="three-bg three-bg--static fixed inset-0 z-0 bg-black" aria-hidden />}>
                  <ThreeBackground />
                </Suspense>
              </ErrorBoundary>
              <Spotlight />
              <ScrollProgress />
              <ThemeTransition />
              <NavBar />
              <RoutedPages />
              <PageDots />
              <LayoutSwitcher />
            </div>
          </BrowserRouter>
        </DataProvider>
      </LayoutProvider>
    </AccentProvider>
  );
}
