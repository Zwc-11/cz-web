import Footer from '../components/layout/Footer';
import Hero from '../components/hero/Hero';
import ProofStrip from '../components/sections/ProofStrip';
import SelectedWork from '../components/sections/SelectedWork';
import ExperienceTimeline from '../components/sections/ExperienceTimeline';
import IdentitySection from '../components/sections/IdentitySection';
import ContactSection from '../components/sections/ContactSection';
import SignalPrism from '../components/hero/SignalPrism';
import MarginCipher from '../components/creative/MarginCipher';

export default function PrismRailLayout({ profile, projects }) {
  return (
    <div className="site-canvas site-canvas--prism relative z-10 pb-28 lg:grid lg:grid-cols-[1fr_minmax(340px,420px)]">
      <main className="min-w-0 border-r border-white/[0.06]">
        <Hero profile={profile} variant="prism" />
        <MarginCipher />
        <ProofStrip items={profile.proofStrip} />
        <SelectedWork projects={projects} variant="wide" />
        <ExperienceTimeline experience={profile.experience} />
        <IdentitySection about={profile.about} skills={profile.skills} />
        <ContactSection contact={profile.contact} />
        <Footer contact={profile.contact} />
      </main>

      <aside className="prism-rail hidden lg:block">
        <div className="sticky top-0 flex h-[calc(100vh-5rem)] flex-col items-center justify-center gap-6 border-l border-white/[0.04] px-6">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30 [writing-mode:vertical-rl]">
            signal core · click to shift chroma
          </p>
          <SignalPrism />
          <div className="w-full border-t border-white/[0.06] pt-4 font-mono text-[9px] leading-relaxed text-white/25">
            <p>ACCENT cycles on prism click</p>
            <p className="mt-1 text-[var(--accent)]">cyan → amber → violet</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
