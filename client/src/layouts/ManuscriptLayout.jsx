import { motion } from 'framer-motion';
import Footer from '../components/layout/Footer';
import Hero from '../components/hero/Hero';
import ProofStrip from '../components/sections/ProofStrip';
import SelectedWork from '../components/sections/SelectedWork';
import ExperienceTimeline from '../components/sections/ExperienceTimeline';
import IdentitySection from '../components/sections/IdentitySection';
import ContactSection from '../components/sections/ContactSection';
import ThoughtGlyphs from '../components/creative/ThoughtGlyphs';

function CodexPage({ index, children, className = '' }) {
  return (
    <section
      className={`codex-page relative flex min-h-[calc(100vh-5rem)] w-[min(94vw,90rem)] shrink-0 snap-center flex-col border border-white/[0.08] bg-black/25 backdrop-blur-sm ${className}`}
    >
      <div className="absolute left-0 top-0 flex h-full w-10 flex-col items-center border-r border-white/[0.06] bg-black/40 py-6">
        <span className="font-mono text-[10px] text-[rgba(201,162,39,0.5)] [writing-mode:vertical-rl] rotate-180">
          folio {index}
        </span>
        <ThoughtGlyphs className="mt-auto h-40 w-8 opacity-60" />
      </div>
      <div className="ml-10 flex flex-1 flex-col overflow-y-auto p-6 sm:p-10">{children}</div>
      <div className="pointer-events-none absolute bottom-0 right-0 h-16 w-16 bg-gradient-to-tl from-[rgba(201,162,39,0.08)] to-transparent" aria-hidden />
    </section>
  );
}

export default function ManuscriptLayout({ profile, projects }) {
  return (
    <div className="site-canvas site-canvas--manuscript relative z-10 pb-28">
      <div className="section-shell py-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
          Drag sideways · codex mode
        </p>
      </div>

      <div className="codex-track flex snap-x snap-mandatory gap-6 overflow-x-auto px-[max(1.25rem,calc((100vw-90rem)/2))] pb-8 pt-2">
        <CodexPage index="00">
          <Hero profile={profile} variant="page" />
        </CodexPage>
        <CodexPage index="01">
          <ProofStrip items={profile.proofStrip} variant="flat" />
        </CodexPage>
        <CodexPage index="02">
          <SelectedWork projects={projects} variant="stack" />
        </CodexPage>
        <CodexPage index="03">
          <ExperienceTimeline experience={profile.experience} variant="flat" />
        </CodexPage>
        <CodexPage index="04">
          <IdentitySection about={profile.about} skills={profile.skills} variant="flat" />
        </CodexPage>
        <CodexPage index="05">
          <ContactSection contact={profile.contact} variant="flat" />
        </CodexPage>
      </div>

      <Footer contact={profile.contact} />
    </div>
  );
}
