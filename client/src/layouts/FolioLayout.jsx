import Footer from '../components/layout/Footer';
import Hero from '../components/hero/Hero';
import ProofStrip from '../components/sections/ProofStrip';
import SelectedWork from '../components/sections/SelectedWork';
import ExperienceTimeline from '../components/sections/ExperienceTimeline';
import IdentitySection from '../components/sections/IdentitySection';
import ContactSection from '../components/sections/ContactSection';
import ThoughtGlyphs from '../components/creative/ThoughtGlyphs';

function FolioPage({ index, children }) {
  return (
    <article className="folio-page flex min-h-[calc(100vh-8rem)] w-[min(92vw,90rem)] shrink-0 snap-center flex-col border border-white/[0.08] bg-black/30">
      <header className="flex items-center gap-3 border-b border-white/[0.06] px-6 py-4">
        <span className="geo-index scale-90">{index}</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/35">Folio {index}</span>
        <ThoughtGlyphs className="ml-auto h-8 w-8 opacity-40" />
      </header>
      <div className="flex-1 overflow-y-auto p-6 sm:p-10">{children}</div>
    </article>
  );
}

export default function FolioLayout({ profile, projects }) {
  return (
    <div className="site-canvas site-canvas--folio relative z-10 pb-36">
      <p className="section-shell py-4 font-mono text-[10px] uppercase tracking-widest text-white/35">
        Sideways folio — scroll horizontally · 人体工学 width inside each page
      </p>
      <div className="folio-track flex snap-x snap-mandatory gap-5 overflow-x-auto px-[max(1.5rem,calc((100vw-90rem)/2))] pb-6">
        <FolioPage index="00"><Hero profile={profile} variant="folio" core="dial" /></FolioPage>
        <FolioPage index="01"><ProofStrip items={profile.proofStrip} variant="flat" /></FolioPage>
        <FolioPage index="02"><SelectedWork projects={projects} variant="stack" /></FolioPage>
        <FolioPage index="03"><ExperienceTimeline experience={profile.experience} variant="flat" /></FolioPage>
        <FolioPage index="04"><IdentitySection about={profile.about} skills={profile.skills} variant="flat" /></FolioPage>
        <FolioPage index="05"><ContactSection contact={profile.contact} variant="flat" /></FolioPage>
      </div>
      <Footer contact={profile.contact} />
    </div>
  );
}
