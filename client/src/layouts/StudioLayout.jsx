import Footer from '../components/layout/Footer';
import Hero from '../components/hero/Hero';
import ProofStrip from '../components/sections/ProofStrip';
import SelectedWork from '../components/sections/SelectedWork';
import ExperienceTimeline from '../components/sections/ExperienceTimeline';
import IdentitySection from '../components/sections/IdentitySection';
import ContactSection from '../components/sections/ContactSection';
import AccentCore from '../components/core/AccentCore';
import MarginCipher from '../components/creative/MarginCipher';
import ComfortControls from '../components/ergonomic/ComfortControls';

const NAV = [
  { href: '#hero', label: 'Intro' },
  { href: '#proof', label: 'Proof' },
  { href: '#work', label: 'Work' },
  { href: '#experience', label: 'Path' },
  { href: '#identity', label: 'Self' },
  { href: '#contact', label: 'Contact' },
];

export default function StudioLayout({ profile, projects }) {
  return (
    <div className="site-canvas site-canvas--studio relative z-10 grid pb-36 lg:grid-cols-[minmax(280px,320px)_1fr]">
      <aside className="studio-rail hidden border-r border-white/[0.08] bg-black/40 p-6 lg:sticky lg:top-0 lg:block lg:h-[calc(100vh-5.5rem)] lg:overflow-y-auto">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[rgba(201,162,39,0.55)]">
          Studio · 人体工学
        </p>
        <div className="mt-6 border border-white/[0.08] p-4">
          <AccentCore variant="constellation" />
        </div>
        <nav className="mt-8 space-y-1" aria-label="Section navigation">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="flex min-h-[44px] items-center border border-transparent px-3 font-mono text-[10px] uppercase tracking-wider text-white/45 hover:border-white/10 hover:text-[var(--accent)]"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="mt-8">
          <ComfortControls />
        </div>
        <div className="mt-8">
          <MarginCipher vertical />
        </div>
      </aside>

      <div>
        <main>
          <Hero profile={profile} variant="studio" core="constellation" />
          <ProofStrip items={profile.proofStrip} />
          <SelectedWork projects={projects} />
          <ExperienceTimeline experience={profile.experience} />
          <IdentitySection about={profile.about} skills={profile.skills} />
          <ContactSection contact={profile.contact} />
        </main>
        <Footer contact={profile.contact} />
      </div>
    </div>
  );
}
