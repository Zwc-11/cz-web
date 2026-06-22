import Footer from '../components/layout/Footer';
import Hero from '../components/hero/Hero';
import ProofStrip from '../components/sections/ProofStrip';
import SelectedWork from '../components/sections/SelectedWork';
import ExperienceTimeline from '../components/sections/ExperienceTimeline';
import IdentitySection from '../components/sections/IdentitySection';
import ContactSection from '../components/sections/ContactSection';
import AccentCore from '../components/core/AccentCore';

function Band({ children, tone = 'a', id }) {
  return (
    <section id={id} className={`corridor-band corridor-band--${tone} py-14 sm:py-20`}>
      <div className="section-shell">{children}</div>
    </section>
  );
}

export default function CorridorLayout({ profile, projects }) {
  return (
    <div className="site-canvas site-canvas--corridor relative z-10 pb-36">
      <Hero profile={profile} variant="corridor" core="topo" />
      <Band id="proof" tone="b">
        <ProofStrip items={profile.proofStrip} variant="flat" />
      </Band>
      <Band id="work" tone="a">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
          <SelectedWork projects={projects} variant="stack" />
          <div className="hidden lg:block">
            <AccentCore variant="topo" />
          </div>
        </div>
      </Band>
      <Band id="experience" tone="b">
        <ExperienceTimeline experience={profile.experience} variant="flat" />
      </Band>
      <Band id="identity" tone="a">
        <IdentitySection about={profile.about} skills={profile.skills} variant="flat" />
      </Band>
      <Band id="contact" tone="b">
        <ContactSection contact={profile.contact} variant="flat" />
      </Band>
      <Footer contact={profile.contact} />
    </div>
  );
}
