import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Torus, Icosahedron } from '@react-three/drei';

export default function GildedWire({ accent = '#22d3ee', gold = '#c9a227' }) {
  const ring = useRef();

  useFrame(({ clock }) => {
    if (ring.current) ring.current.rotation.z = clock.elapsedTime * 0.08;
  });

  return (
    <group>
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
        <Icosahedron args={[2.2, 1]} position={[0, 0.2, 0]}>
          <meshBasicMaterial color={gold} wireframe transparent opacity={0.35} />
        </Icosahedron>
      </Float>
      <Torus ref={ring} args={[3.4, 0.015, 16, 120]} rotation={[Math.PI / 2.2, 0, 0]}>
        <meshBasicMaterial color={gold} transparent opacity={0.5} />
      </Torus>
      <Torus args={[4.2, 0.008, 8, 80]} rotation={[Math.PI / 3, 0.4, 0]}>
        <meshBasicMaterial color={accent} transparent opacity={0.25} />
      </Torus>
      <pointLight color={gold} intensity={2} distance={12} position={[2, 2, 3]} />
    </group>
  );
}
