import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * FishSchool — a small shoal of tiny gold fish gliding through the water.
 *
 * Meaningful by design: the number of fish equals the number of projects in
 * the portfolio (passed in as `count`). Each project is a little gold fish.
 *
 * Realism comes from a custom shader: the body is tessellated along its length
 * and a travelling sine wave undulates it (tail whips hardest, head barely
 * moves) so each fish genuinely swims rather than slides. The fragment shader
 * paints a gold back→belly gradient, a lateral sheen line, a gill hint and an
 * eye, so even at a few pixels it reads as a fish.
 */

const SEG = 36;
const BOUND_X = 11;
const SPAN_Y = 9;
const Z_NEAR = 2.4;
const Z_FAR = -1.6;

// Side-view half-height profile: rounded nose → belly → slim tail base → fan
// caudal fin. u runs 0 (nose) → 1 (tail tip).
function halfHeight(u) {
  if (u <= 0.8) {
    const b = u / 0.8;
    return 0.025 + 0.17 * Math.sin(Math.PI * Math.pow(b, 0.85));
  }
  const v = (u - 0.8) / 0.2;
  // dip then spread → a forked-ish caudal fin
  return 0.02 + 0.26 * v * v + 0.04 * v;
}

function makeFishGeometry() {
  const positions = [];
  const aLen = [];
  const indices = [];
  for (let i = 0; i <= SEG; i += 1) {
    const u = i / SEG;
    const x = 0.5 - u; // nose at +0.5, tail tip at -0.5
    const h = halfHeight(u);
    positions.push(x, h, 0); // top
    aLen.push(u);
    positions.push(x, -h, 0); // bottom
    aLen.push(u);
  }
  for (let i = 0; i < SEG; i += 1) {
    const t0 = i * 2;
    const b0 = i * 2 + 1;
    const t1 = (i + 1) * 2;
    const b1 = (i + 1) * 2 + 1;
    indices.push(t0, b0, t1, b0, b1, t1);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('aLen', new THREE.Float32BufferAttribute(aLen, 1));
  geo.setIndex(indices);
  return geo;
}

const vertex = `
  attribute float aLen;
  uniform float uTime;
  uniform float uSpeed;
  uniform float uPhase;
  uniform float uAmp;
  uniform float uWaveK;
  varying float vLen;
  varying float vY;
  void main() {
    vLen = aLen;
    vY = position.y;
    vec3 p = position;
    // travelling body wave — amplitude grows toward the tail
    float wave = sin(aLen * uWaveK - uTime * uSpeed + uPhase);
    p.y += wave * uAmp * pow(aLen, 1.5);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragment = `
  precision mediump float;
  uniform vec3 uBack;
  uniform vec3 uBelly;
  uniform float uOpacity;
  varying float vLen;
  varying float vY;
  void main() {
    // back (top) richer gold, belly (bottom) pale gold
    float belly = smoothstep(-0.22, 0.22, vY);
    vec3 col = mix(uBelly, uBack, belly);
    // bright lateral line / sheen
    float sheen = pow(max(0.0, 1.0 - abs(vY) * 7.0), 6.0);
    col += vec3(1.0, 0.94, 0.66) * sheen * 0.4;
    // gill arc just behind the head
    float gill = smoothstep(0.025, 0.0, abs(vLen - 0.27));
    col = mix(col, col * 0.74, gill * 0.5);
    // eye
    float eye = smoothstep(0.045, 0.0, distance(vec2(vLen, vY), vec2(0.13, 0.05)));
    col = mix(col, vec3(0.05, 0.035, 0.02), eye);
    gl_FragColor = vec4(col, uOpacity);
  }
`;

function Fish({ data, geometry, back, belly }) {
  const meshRef = useRef();
  const matRef = useRef();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: data.swimSpeed },
      uPhase: { value: data.phase },
      uAmp: { value: data.amp },
      uWaveK: { value: data.waveK },
      uBack: { value: new THREE.Color(back) },
      uBelly: { value: new THREE.Color(belly) },
      uOpacity: { value: 0.96 },
    }),
    [data, back, belly]
  );

  useFrame(({ clock }, delta) => {
    const mesh = meshRef.current;
    const mat = matRef.current;
    if (!mesh) return;
    const t = clock.elapsedTime;
    const d = Math.min(delta, 0.05);
    if (mat) mat.uniforms.uTime.value = t;

    data.x += data.dir * data.speed * d;
    if (data.dir > 0 && data.x > BOUND_X) {
      data.x = -BOUND_X;
      data.baseY = (Math.random() - 0.5) * SPAN_Y;
    } else if (data.dir < 0 && data.x < -BOUND_X) {
      data.x = BOUND_X;
      data.baseY = (Math.random() - 0.5) * SPAN_Y;
    }

    const y = data.baseY + Math.sin(t * data.bobSpeed + data.phase) * data.bobAmp;
    mesh.position.set(data.x, y, data.z);
    // gentle pitch toward swim direction of the bob
    mesh.rotation.z = Math.cos(t * data.bobSpeed + data.phase) * 0.12;
    mesh.scale.set(data.scale * data.dir, data.scale, data.scale);
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[data.x, data.baseY, data.z]}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

function makeFish(count) {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    const dir = Math.random() < 0.5 ? 1 : -1;
    list.push({
      x: (Math.random() - 0.5) * BOUND_X * 2,
      baseY: (Math.random() - 0.5) * SPAN_Y,
      z: Z_FAR + Math.random() * (Z_NEAR - Z_FAR),
      dir,
      speed: 0.5 + Math.random() * 0.7,
      scale: 0.26 + Math.random() * 0.22,
      bobAmp: 0.1 + Math.random() * 0.22,
      bobSpeed: 0.5 + Math.random() * 0.7,
      swimSpeed: 7 + Math.random() * 4, // tail-beat rate
      amp: 0.07 + Math.random() * 0.04,
      waveK: 5.5 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
    });
  }
  return list;
}

export default function FishSchool({ count = 0, back = '#d99a16', belly = '#ffe9a8' }) {
  const geometry = useMemo(() => makeFishGeometry(), []);
  const fish = useMemo(() => makeFish(count), [count]);

  if (!count) return null;

  return (
    <group>
      {fish.map((data, i) => (
        <Fish key={i} data={data} geometry={geometry} back={back} belly={belly} />
      ))}
    </group>
  );
}
