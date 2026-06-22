import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const RINGS = 5;
const PER_RING = 18;

export default function PulseHex({ accent = '#22d3ee' }) {
  const group = useRef();
  const meshRefs = useRef([]);

  const nodes = useMemo(() => {
    const list = [];
    for (let r = 0; r < RINGS; r += 1) {
      const radius = 1.2 + r * 0.9;
      for (let i = 0; i < PER_RING; i += 1) {
        const a = (i / PER_RING) * Math.PI * 2 + r * 0.2;
        list.push({
          x: Math.cos(a) * radius,
          y: Math.sin(a) * radius * 0.55,
          z: (Math.random() - 0.5) * 1.5,
          phase: i * 0.4 + r,
        });
      }
    }
    return list;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const n = nodes[i];
      const pulse = 0.04 + Math.sin(t * 2 + n.phase) * 0.025;
      mesh.scale.setScalar(pulse / 0.04);
      mesh.material.opacity = 0.35 + Math.sin(t * 1.5 + n.phase) * 0.25;
    });
    if (group.current) group.current.rotation.z = t * 0.03;
  });

  return (
    <group ref={group}>
      {nodes.map((n, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          position={[n.x, n.y, n.z]}
        >
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color={accent} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}
