import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Stars } from '@react-three/drei';

const auroraVertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const auroraFragment = `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec2 vUv;
  void main() {
    float wave = sin(vUv.x * 6.0 + uTime * 0.4) * 0.5 + 0.5;
    wave *= sin(vUv.y * 3.0 - uTime * 0.25) * 0.5 + 0.5;
    vec3 col = mix(uColorA, uColorB, wave);
    float alpha = smoothstep(0.0, 0.6, wave) * 0.35 * (1.0 - abs(vUv.y - 0.35) * 1.2);
    gl_FragColor = vec4(col, alpha);
  }
`;

export default function AuroraField({ accent = '#22d3ee', gold = '#c9a227' }) {
  const matRef = useRef();

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <group position={[0, 1.5, -4]} rotation={[-0.35, 0, 0]}>
      <mesh scale={[22, 8, 1]}>
        <planeGeometry args={[1, 1, 1, 1]} />
        <shaderMaterial
          ref={matRef}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{
            uTime: { value: 0 },
            uColorA: { value: new THREE.Color(accent) },
            uColorB: { value: new THREE.Color(gold) },
          }}
          vertexShader={auroraVertex}
          fragmentShader={auroraFragment}
        />
      </mesh>
      <Stars radius={80} depth={40} count={2500} factor={3} saturation={0} fade speed={0.4} />
    </group>
  );
}
