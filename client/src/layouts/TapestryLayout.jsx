import { useLayout } from '../context/LayoutContext';
import SectionRail from '../components/layout/SectionRail';
import Footer from '../components/layout/Footer';
import Hero from '../components/hero/Hero';
import MetricsStrip from '../components/sections/MetricsStrip';
import TechMarquee from '../components/sections/TechMarquee';
import ProofStrip from '../components/sections/ProofStrip';
import SelectedWork from '../components/sections/SelectedWork';
import ExperienceTimeline from '../components/sections/ExperienceTimeline';
import IdentitySection from '../components/sections/IdentitySection';
import ContactSection from '../components/sections/ContactSection';

export default function TapestryLayout({ profile, projects }) {
  const { meta } = useLayout();

  return (
    <div className={`page-frame page-frame--${meta.theme}`}>
      <SectionRail />
      <div className="page-content">
        <main className="editorial-main">
          <Hero profile={profile} core={meta.core} />
          <MetricsStrip />
          <TechMarquee />
          <ProofStrip items={profile.proofStrip} variant="editorial" />
          <SelectedWork projects={projects} variant="editorial" />
          <ExperienceTimeline experience={profile.experience} variant="editorial" />
          <IdentitySection about={profile.about} skills={profile.skills} variant="editorial" />
          <ContactSection contact={profile.contact} variant="editorial" />
        </main>
        <Footer contact={profile.contact} />
      </div>
    </div>
  );
}
