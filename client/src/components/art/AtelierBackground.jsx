import SfumatoCanvas from './SfumatoCanvas';
import ChiaroscuroLight from './ChiaroscuroLight';
import MasterComposition from './MasterComposition';
import PigmentVeins from './PigmentVeins';

/** Full atelier background stack — Renaissance painting atmosphere */
export default function AtelierBackground() {
  return (
    <div className="atelier-stack pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="canvas-weave absolute inset-0" />
      <div className="umber-glaze absolute inset-0" />
      <SfumatoCanvas />
      <ChiaroscuroLight />
      <MasterComposition />
      <PigmentVeins />
      <div className="gold-dust absolute inset-0" />
    </div>
  );
}
