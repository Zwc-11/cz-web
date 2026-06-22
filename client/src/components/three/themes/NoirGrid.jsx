import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Grid } from '@react-three/drei';

export default function NoirGrid() {
  const grid = useRef();

  useFrame(({ clock }) => {
    if (grid.current) grid.current.position.z = (clock.elapsedTime * 0.4) % 2;
  });

  return (
    <group position={[0, -2.5, 0]} rotation={[-Math.PI / 2.8, 0, 0]}>
      <Grid
        ref={grid}
        infiniteGrid
        cellSize={0.6}
        cellThickness={0.4}
        cellColor="#ffffff"
        sectionSize={3}
        sectionThickness={0.8}
        sectionColor="#444444"
        fadeDistance={28}
        fadeStrength={1.2}
      />
    </group>
  );
}
