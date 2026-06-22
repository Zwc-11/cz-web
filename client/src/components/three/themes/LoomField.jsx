import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 160;
const CONNECT = 1.35;

export default function LoomField({ color = '#22d3ee' }) {
  const linesRef = useRef();
  const pointsRef = useRef();
  const positions = useMemo(() => {
    const p = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i += 1) {
      p[i * 3] = (Math.random() - 0.5) * 18;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return p;
  }, []);

  const linePositions = useMemo(() => new Float32Array(COUNT * COUNT * 3), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 0.15;
    const pts = pointsRef.current?.geometry?.attributes?.position;
    if (!pts) return;

    for (let i = 0; i < COUNT; i += 1) {
      const ix = i * 3;
      pts.array[ix + 1] = positions[ix + 1] + Math.sin(t + i * 0.08) * 0.12;
    }
    pts.needsUpdate = true;

    let li = 0;
    for (let i = 0; i < COUNT; i += 1) {
      for (let j = i + 1; j < COUNT; j += 1) {
        const dx = pts.array[i * 3] - pts.array[j * 3];
        const dy = pts.array[i * 3 + 1] - pts.array[j * 3 + 1];
        const dz = pts.array[i * 3 + 2] - pts.array[j * 3 + 2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < CONNECT) {
          linePositions[li++] = pts.array[i * 3];
          linePositions[li++] = pts.array[i * 3 + 1];
          linePositions[li++] = pts.array[i * 3 + 2];
          linePositions[li++] = pts.array[j * 3];
          linePositions[li++] = pts.array[j * 3 + 1];
          linePositions[li++] = pts.array[j * 3 + 2];
        }
      }
    }

    const geo = linesRef.current?.geometry;
    if (geo) {
      geo.setDrawRange(0, li / 3);
      geo.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={COUNT} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color={color} size={0.04} transparent opacity={0.85} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={linePositions.length / 3} array={linePositions} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.12} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </group>
  );
}
