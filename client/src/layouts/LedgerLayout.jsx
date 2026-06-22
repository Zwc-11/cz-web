import Footer from '../components/layout/Footer';
import Hero from '../components/hero/Hero';
import ProofStrip from '../components/sections/ProofStrip';
import SelectedWork from '../components/sections/SelectedWork';
import ExperienceTimeline from '../components/sections/ExperienceTimeline';
import IdentitySection from '../components/sections/IdentitySection';
import ContactSection from '../components/sections/ContactSection';
import AccentCore from '../components/core/AccentCore';

export default function LedgerLayout({ profile, projects }) {
  return (
    <div className="site-canvas site-canvas--ledger relative z-10 pb-36">
      <main className="section-shell py-10">
        <div className="ledger-grid gap-px border border-white/[0.08] bg-white/[0.06]">
          <div className="ledger-cell lg:col-span-8 lg:row-span-2">
            <Hero profile={profile} variant="minimal" core="hex" />
          </div>
          <div className="ledger-cell flex items-center justify-center p-6 lg:col-span-4">
            <AccentCore variant="hex" />
          </div>
          <div className="ledger-cell lg:col-span-12">
            <ProofStrip items={profile.proofStrip} variant="flat" />
          </div>
          <div className="ledger-cell lg:col-span-7">
            <SelectedWork projects={projects} variant="stack" />
          </div>
          <div className="ledger-cell lg:col-span-5">
            <ExperienceTimeline experience={profile.experience} variant="flat" />
          </div>
          <div className="ledger-cell lg:col-span-6">
            <IdentitySection about={profile.about} skills={profile.skills} variant="flat" />
          </div>
          <div className="ledger-cell lg:col-span-6">
            <ContactSection contact={profile.contact} variant="flat" />
          </div>
        </div>
      </main>
      <Footer contact={profile.contact} />
    </div>
  );
}
