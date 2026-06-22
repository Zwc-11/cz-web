import SfumatoCanvas from './SfumatoCanvas';
import ChiaroscuroLight from './ChiaroscuroLight';
import MasterComposition from './MasterComposition';
import PigmentVeins from './PigmentVeins';
import AuroraVeil from './tapestry/AuroraVeil';
import LightPillars from './tapestry/LightPillars';
import StarHaze from './tapestry/StarHaze';
import HorizonGlow from './tapestry/HorizonGlow';
import OrbitalField from './tapestry/OrbitalField';
import FloatingGlyphs from './tapestry/FloatingGlyphs';
import PrismSheen from './tapestry/PrismSheen';

/** Rich layered tapestry atmosphere — clean, variant-aware */
export default function TapestryBackground() {
  return (
    <div className="tapestry-bg pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="tapestry-base absolute inset-0" />
      <div className="canvas-weave absolute inset-0 opacity-30" />
      <div className="fine-lattice absolute inset-0" />
      <OrbitalField />
      <AuroraVeil />
      <PrismSheen />
      <SfumatoCanvas />
      <LightPillars />
      <FloatingGlyphs />
      <HorizonGlow />
      <ChiaroscuroLight />
      <MasterComposition />
      <PigmentVeins />
      <StarHaze />
      <div className="gold-dust absolute inset-0" />
      <div className="tapestry-vignette absolute inset-0" />
    </div>
  );
}
