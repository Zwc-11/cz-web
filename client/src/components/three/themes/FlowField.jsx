import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * FlowField — a full-screen, domain-warped fractal-noise body of water that
 * drifts and shimmers with caustic-like highlights. It brightens toward the
 * pointer, and — the interactive part — every CLICK anywhere on the page drops
 * a pebble in the water: an expanding ring ripples outward from the click,
 * distorting and lighting the surface before it fades. This is the site's
 * signature "personal" backdrop: organic, flowing, and alive to touch.
 */

const MAX_RIPPLES = 10;

const vertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = `
  precision highp float;
  #define MAX_RIPPLES ${MAX_RIPPLES}
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uAspect;
  uniform vec3  uDeep;
  uniform vec3  uMid;
  uniform vec3  uHot;
  uniform vec3  uRipples[MAX_RIPPLES]; // xy = centre (uv), z = start time
  varying vec2 vUv;

  const float RIPPLE_LIFE = 2.0;
  const float RIPPLE_SPEED = 0.28;

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
    vec2 pp = vec2(uv.x * uAspect, uv.y);

    // --- click ripples: accumulate radial distortion + glow from each ring ---
    vec2 ripDisp = vec2(0.0);
    float ripGlow = 0.0;
    for (int i = 0; i < MAX_RIPPLES; i++) {
      vec3 r = uRipples[i];
      float age = uTime - r.z;
      if (age < 0.0 || age > RIPPLE_LIFE) continue;
      vec2 c = vec2(r.x * uAspect, r.y);
      vec2 dir = pp - c;
      float d = length(dir);
      float radius = age * RIPPLE_SPEED;
      // a couple of trailing crests for a more water-like wake
      float wave = sin((d - radius) * 52.0);
      float ring = smoothstep(0.09, 0.0, abs(d - radius)) * (0.5 + 0.5 * wave);
      float fade = 1.0 - age / RIPPLE_LIFE;
      fade *= fade;
      ripGlow += max(ring, 0.0) * fade;
      ripDisp += normalize(dir + 1e-5) * ring * fade * 0.09;
    }

    vec2 p = (uv + ripDisp) * vec2(uAspect, 1.0) * 3.0;
    float t = uTime * 0.038;

    // Two stages of domain warping for that fluid, marbled flow.
    vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
    vec2 rr = vec2(
      fbm(p + 3.5 * q + vec2(1.7, 9.2) + t * 1.4),
      fbm(p + 3.5 * q + vec2(8.3, 2.8) - t * 1.1)
    );
    float f = fbm(p + 3.5 * rr);

    // Caustic shimmer — thin bright filaments that ride the flow like sunlight
    // refracting through moving water.
    float caustic = pow(abs(sin(f * 9.0 + t * 4.0)), 6.0);
    caustic += pow(abs(sin(length(q) * 7.0 - t * 3.0)), 8.0) * 0.6;

    // Pointer glow — a faint bloom that follows the cursor.
    vec2 m2 = vec2(uMouse.x * uAspect, uMouse.y);
    float md = distance(pp, m2);
    float glow = smoothstep(0.85, 0.0, md);
    f += glow * 0.10;

    // Colour ramp: deep base → accent mid → soft highlight peaks.
    vec3 col = mix(uDeep, uMid, clamp(f * f * 1.15, 0.0, 1.0));
    col = mix(col, uHot, clamp(length(rr) * length(q) * 0.5 + glow * 0.18, 0.0, 1.0));

    // Fold caustics + ripple energy into the accent highlight.
    col += uHot * caustic * 0.16;
    col = mix(col, uHot, clamp(ripGlow * 0.9, 0.0, 1.0));

    // Keep it dim so it reads as atmosphere behind the content.
    float lum = 0.14 + 0.40 * f + ripGlow * 0.25;
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
  const timeRef = useRef(0);

  // Ripple ring buffer — each is a Vector3(uvX, uvY, startTime).
  const ripples = useMemo(
    () => Array.from({ length: MAX_RIPPLES }, () => new THREE.Vector3(0, 0, -100)),
    []
  );
  const rippleIndex = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uAspect: { value: 1 },
      uDeep: { value: new THREE.Color('#04070f') },
      uMid: { value: new THREE.Color(accent) },
      uHot: { value: lighten(accent, 0.7) },
      uRipples: { value: ripples },
    }),
    [accent, ripples]
  );

  // Drop a ripple wherever the user clicks/taps anywhere on the page.
  useEffect(() => {
    const spawn = (clientX, clientY) => {
      const x = clientX / window.innerWidth;
      const y = 1 - clientY / window.innerHeight; // flip to UV space
      const slot = ripples[rippleIndex.current % MAX_RIPPLES];
      slot.set(x, y, timeRef.current);
      rippleIndex.current += 1;
    };
    const onPointer = (e) => spawn(e.clientX, e.clientY);
    window.addEventListener('pointerdown', onPointer);
    return () => window.removeEventListener('pointerdown', onPointer);
  }, [ripples]);

  useFrame(({ clock, size }) => {
    const m = matRef.current;
    if (!m) return;
    timeRef.current = clock.elapsedTime;
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
