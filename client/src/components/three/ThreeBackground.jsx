import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useData } from '../../context/DataContext';
import TapestryScene from './TapestryScene';

export default function ThreeBackground() {
  const reduced = useReducedMotion();
  const { projects } = useData();
  const projectCount = projects?.length ?? 0;

  if (reduced) {
    return (
      <div className="three-bg three-bg--static fixed inset-0 z-0" aria-hidden>
        <div className="flow-static absolute inset-0" />
        <div className="three-vignette pointer-events-none absolute inset-0" />
      </div>
    );
  }

  return (
    <div className="three-bg fixed inset-0 z-0" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 9], fov: 55 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        style={{ background: '#030303' }}
      >
        <Suspense fallback={null}>
          <TapestryScene projectCount={projectCount} />
        </Suspense>
      </Canvas>
      <div className="three-vignette pointer-events-none absolute inset-0" />
      <div className="three-grain pointer-events-none absolute inset-0" />
    </div>
  );
}
