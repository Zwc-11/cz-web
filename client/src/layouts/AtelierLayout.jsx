import GridRule from '../components/art/GridRule';
import GridRail from '../components/art/GridRail';
import Footer from '../components/layout/Footer';
import Hero from '../components/hero/Hero';
import ProofStrip from '../components/sections/ProofStrip';
import SelectedWork from '../components/sections/SelectedWork';
import ExperienceTimeline from '../components/sections/ExperienceTimeline';
import IdentitySection from '../components/sections/IdentitySection';
import ContactSection from '../components/sections/ContactSection';
import MarginCipher from '../components/creative/MarginCipher';

export default function AtelierLayout({ profile, projects }) {
  return (
    <>
      <GridRail />
      <div className="site-canvas site-canvas--atelier relative z-10">
        <main className="pb-28">
          <Hero profile={profile} variant="atelier" />
          <MarginCipher />
          <GridRule index="01" />
          <ProofStrip items={profile.proofStrip} />
          <GridRule index="02" />
          <SelectedWork projects={projects} />
          <GridRule index="03" />
          <ExperienceTimeline experience={profile.experience} />
          <GridRule index="04" />
          <IdentitySection about={profile.about} skills={profile.skills} />
          <GridRule index="05" />
          <ContactSection contact={profile.contact} />
        </main>
        <Footer contact={profile.contact} />
      </div>
    </>
  );
}
