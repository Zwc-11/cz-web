import Footer from '../components/layout/Footer';
import Hero from '../components/hero/Hero';
import ProofStrip from '../components/sections/ProofStrip';
import SelectedWork from '../components/sections/SelectedWork';
import ExperienceTimeline from '../components/sections/ExperienceTimeline';
import IdentitySection from '../components/sections/IdentitySection';
import ContactSection from '../components/sections/ContactSection';
import MarginCipher from '../components/creative/MarginCipher';
import SignalPrism from '../components/hero/SignalPrism';
import ThoughtGlyphs from '../components/creative/ThoughtGlyphs';

const NAV = [
  { href: '#hero', label: 'Intro' },
  { href: '#proof', label: 'Proof' },
  { href: '#work', label: 'Work' },
  { href: '#experience', label: 'Path' },
  { href: '#identity', label: 'Self' },
  { href: '#contact', label: 'Contact' },
];

export default function SplitLayout({ profile, projects }) {
  return (
    <div className="site-canvas site-canvas--split relative z-10 grid pb-28 lg:grid-cols-[minmax(260px,320px)_1fr]">
      <aside className="observatory-rail hidden border-r border-white/[0.08] bg-black/40 p-6 lg:sticky lg:top-0 lg:flex lg:h-[calc(100vh-5rem)] lg:flex-col">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[rgba(201,162,39,0.55)]">
          Observatory
        </p>
        <div className="mt-6 flex justify-center border border-white/[0.08] bg-black/30 py-8">
          <SignalPrism />
        </div>
        <nav className="mt-8 space-y-1">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="block border border-transparent px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-white/40 hover:border-white/10 hover:text-[var(--accent)]"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="mt-auto space-y-4">
          <ThoughtGlyphs className="mx-auto h-32 w-12 opacity-50" />
          <MarginCipher vertical />
        </div>
      </aside>

      <div>
        <main>
          <Hero profile={profile} variant="split" />
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
