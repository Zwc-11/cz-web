import Footer from '../components/layout/Footer';
import Hero from '../components/hero/Hero';
import ProofStrip from '../components/sections/ProofStrip';
import SelectedWork from '../components/sections/SelectedWork';
import ExperienceTimeline from '../components/sections/ExperienceTimeline';
import IdentitySection from '../components/sections/IdentitySection';
import ContactSection from '../components/sections/ContactSection';

const PLACEMENTS = [
  'collage-panel-a',
  'collage-panel-b',
  'collage-panel-c',
  'collage-panel-d',
  'collage-panel-e',
  'collage-panel-f',
  'collage-panel-g',
];

export default function CollageLayout({ profile, projects }) {
  return (
    <div className="site-canvas site-canvas--collage relative z-10 pb-28">
      <main className="section-shell collage-canvas min-h-[220vh] py-16">
        <div className={`collage-piece ${PLACEMENTS[0]}`}>
          <Hero profile={profile} variant="collage" />
        </div>
        <div className={`collage-piece ${PLACEMENTS[1]}`}>
          <ProofStrip items={profile.proofStrip} variant="flat" />
        </div>
        <div className={`collage-piece ${PLACEMENTS[2]}`}>
          <SelectedWork projects={projects} variant="stack" />
        </div>
        <div className={`collage-piece ${PLACEMENTS[3]}`}>
          <ExperienceTimeline experience={profile.experience} variant="flat" />
        </div>
        <div className={`collage-piece ${PLACEMENTS[4]}`}>
          <IdentitySection about={profile.about} skills={profile.skills} variant="flat" />
        </div>
        <div className={`collage-piece ${PLACEMENTS[5]}`}>
          <ContactSection contact={profile.contact} variant="flat" />
        </div>
      </main>
      <Footer contact={profile.contact} />
    </div>
  );
}
