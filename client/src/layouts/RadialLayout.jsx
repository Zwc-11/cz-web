import { useState } from 'react';
import Footer from '../components/layout/Footer';
import AccentCore from '../components/core/AccentCore';
import ProofStrip from '../components/sections/ProofStrip';
import SelectedWork from '../components/sections/SelectedWork';
import ExperienceTimeline from '../components/sections/ExperienceTimeline';
import IdentitySection from '../components/sections/IdentitySection';
import ContactSection from '../components/sections/ContactSection';
import Hero from '../components/hero/Hero';

const ORBITS = [
  { id: 'hero', href: '#hero', label: 'Intro', angle: -90 },
  { id: 'proof', href: '#proof', label: 'Proof', angle: -30 },
  { id: 'work', href: '#work', label: 'Work', angle: 30 },
  { id: 'experience', href: '#experience', label: 'Path', angle: 90 },
  { id: 'identity', href: '#identity', label: 'Self', angle: 150 },
  { id: 'contact', href: '#contact', label: 'Contact', angle: 210 },
];

export default function RadialLayout({ profile, projects }) {
  const [active, setActive] = useState('hero');
  const radius = 140;

  return (
    <div className="site-canvas site-canvas--radial relative z-10 pb-36">
      <div className="section-shell py-8">
        <div className="relative mx-auto flex min-h-[420px] max-w-3xl items-center justify-center">
          <AccentCore variant="dial" />

          <nav className="radial-orbit pointer-events-none absolute inset-0" aria-label="Radial sections">
            {ORBITS.map((o) => {
              const rad = (o.angle * Math.PI) / 180;
              const x = 50 + (radius / 3.2) * Math.cos(rad);
              const y = 50 + (radius / 3.2) * Math.sin(rad);
              const isActive = active === o.id;
              return (
                <a
                  key={o.id}
                  href={o.href}
                  onClick={() => setActive(o.id)}
                  className={`radial-node pointer-events-auto absolute min-h-[44px] min-w-[44px] -translate-x-1/2 -translate-y-1/2 border px-3 py-2 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                      : 'border-white/15 bg-black/60 text-white/45 hover:border-white/30'
                  }`}
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  {o.label}
                </a>
              );
            })}
          </nav>
        </div>

        <Hero profile={profile} variant="radial" core="dial" />
      </div>

      <main className="section-shell space-y-16 pb-12">
        <ProofStrip items={profile.proofStrip} variant="flat" />
        <SelectedWork projects={projects} variant="stack" />
        <ExperienceTimeline experience={profile.experience} variant="flat" />
        <IdentitySection about={profile.about} skills={profile.skills} variant="flat" />
        <ContactSection contact={profile.contact} variant="flat" />
      </main>
      <Footer contact={profile.contact} />
    </div>
  );
}
