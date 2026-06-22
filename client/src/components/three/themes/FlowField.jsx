import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * FlowField — a full-screen, domain-warped fractal-noise nebula that drifts
 * slowly and brightens toward the pointer. This is the site's signature
 * "personal" backdrop: organic and painterly rather than technical.
 */
const vertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = `
  precision highp float;
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uAspect;
  uniform vec3  uDeep;
  uniform vec3  uMid;
  uniform vec3  uHot;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p = m * p;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv * vec2(uAspect, 1.0) * 3.0;
    float t = uTime * 0.038;

    // Two stages of domain warping for that fluid, marbled flow.
    vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
    vec2 r = vec2(
      fbm(p + 3.5 * q + vec2(1.7, 9.2) + t * 1.4),
      fbm(p + 3.5 * q + vec2(8.3, 2.8) - t * 1.1)
    );
    float f = fbm(p + 3.5 * r);

    // Pointer glow — a faint bloom that follows the cursor.
    vec2 m2 = vec2(uMouse.x * uAspect, uMouse.y);
    vec2 pp = vec2(uv.x * uAspect, uv.y);
    float md = distance(pp, m2);
    float glow = smoothstep(0.85, 0.0, md);
    f += glow * 0.10;

    // Colour ramp: deep base → accent mid → soft highlight peaks.
    vec3 col = mix(uDeep, uMid, clamp(f * f * 1.15, 0.0, 1.0));
    col = mix(col, uHot, clamp(length(r) * length(q) * 0.5 + glow * 0.18, 0.0, 1.0));

    // Keep it dim so it reads as atmosphere behind the content.
    float lum = 0.14 + 0.40 * f;
    col *= lum;

    // Vignette darkens the edges and keeps the centre quiet.
    float vig = smoothstep(1.35, 0.15, distance(uv, vec2(0.5)));
    col *= mix(0.38, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function lighten(hex, amt = 0.55) {
  const c = new THREE.Color(hex);
  return c.lerp(new THREE.Color('#ffffff'), amt);
}

export default function FlowField({ accent = '#22d3ee' }) {
  const matRef = useRef();
  const { viewport, pointer } = useThree();
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uAspect: { value: 1 },
      uDeep: { value: new THREE.Color('#05060d') },
      uMid: { value: new THREE.Color(accent) },
      uHot: { value: lighten(accent, 0.7) },
    }),
    [accent]
  );

  useFrame(({ clock, size }) => {
    const m = matRef.current;
    if (!m) return;
    m.uniforms.uTime.value = clock.elapsedTime;
    m.uniforms.uAspect.value = size.width / size.height;
    // pointer is -1..1; convert to 0..1 and ease toward it
    const tx = pointer.x * 0.5 + 0.5;
    const ty = pointer.y * 0.5 + 0.5;
    mouse.current.x += (tx - mouse.current.x) * 0.05;
    mouse.current.y += (ty - mouse.current.y) * 0.05;
    m.uniforms.uMouse.value.copy(mouse.current);
  });

  // Fill the frustum at z = -5 generously so it always covers the viewport.
  return (
    <mesh position={[0, 0, -5]} scale={[viewport.width * 3.2, viewport.height * 3.2, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        depthWrite={false}
      />
    </mesh>
  );
}
