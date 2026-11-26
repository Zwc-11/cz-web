import { useMemo } from 'react'
import * as THREE from 'three'
import { Line } from '@react-three/drei'
import { M } from './materials'
import { refs } from './refs'

type V3 = [number, number, number]

// Seamless cyclorama: floor sweeping up into a back wall.
function coveGeometry() {
  const prof: [number, number][] = []
  const z0 = -3.4
  const R = 2.8
  for (let z = 10; z > z0; z -= 0.5) prof.push([z, 0])
  for (let i = 0; i <= 24; i++) {
    const t = (i / 24) * (Math.PI / 2)
    prof.push([z0 - R * Math.sin(t), R - R * Math.cos(t)])
  }
  for (let y = R + 0.5; y <= 12; y += 0.5) prof.push([z0 - R, y])
  const xs = [-16, 16]
  const pos: number[] = []
  prof.forEach(([z, y]) => xs.forEach((x) => pos.push(x, y, z)))
  const idx: number[] = []
  for (let i = 0; i < prof.length - 1; i++) {
    const a = i * 2
    const b = a + 1
    const c = a + 2
    const d = a + 3
    idx.push(a, b, c, b, d, c)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setIndex(idx)
  g.computeVertexNormals()
  return g
}

// One-foot grid, faded with distance, shown when the stage turns into the simulator.
function gridMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uOpacity: { value: 0 }, uColor: { value: new THREE.Color('#1b1c1f') }, uAccent: { value: new THREE.Color('#ef6a1a') } },
    vertexShader: /* glsl */ `
      varying vec3 vW;
      void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: /* glsl */ `
      uniform float uOpacity; uniform vec3 uColor; uniform vec3 uAccent;
      varying vec3 vW;
      float line(vec2 p, float s, float w){ vec2 g = abs(fract(p / s - 0.5) - 0.5) / fwidth(p / s); return 1.0 - min(min(g.x, g.y) / w, 1.0); }
      void main(){
        vec2 p = vW.xz;
        float minor = line(p, 0.3048, 1.0) * 0.35;
        float major = line(p, 1.524, 1.4) * 0.6;
        float axis = (1.0 - min(abs(p.x) / fwidth(p.x) / 1.6, 1.0));
        float d = length(p - vec2(0.0, 1.0));
        float fade = 1.0 - smoothstep(3.0, 9.0, d);
        float a = max(minor, major) * fade * uOpacity;
        vec3 col = mix(uColor, uAccent, axis * 0.0);
        gl_FragColor = vec4(col, a * 0.55);
      }`,
  })
}

function Stand({ at, h, legs = 0.36 }: { at: V3; h: number; legs?: number }) {
  return (
    <group position={at}>
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2 + 0.4
        const top = new THREE.Vector3(0, 0.34, 0)
        const foot = new THREE.Vector3(Math.sin(a) * legs, 0.01, Math.cos(a) * legs)
        const dir = foot.clone().sub(top)
        const len = dir.length()
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize())
        const mid = top.clone().add(foot).multiplyScalar(0.5)
        return (
          <mesh key={i} material={M.standMetal} position={mid} quaternion={q} castShadow>
            <cylinderGeometry args={[0.009, 0.009, len, 8]} />
          </mesh>
        )
      })}
      <mesh material={M.standMetal} position={[0, h / 2, 0]} castShadow>
        <cylinderGeometry args={[0.013, 0.016, h, 10]} />
      </mesh>
      <mesh material={M.standChrome} position={[0, h * 0.55, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.04, 10]} />
      </mesh>
    </group>
  )
}

function Softbox() {
  const at: V3 = [1.6, 0, -1.45]
  const h = 1.86
  return (
    <group>
      <Stand at={at} h={h} />
      <group
        position={[at[0], h + 0.06, at[2]]}
        ref={(g) => {
          if (g) g.lookAt(0, 1.45, 0)
        }}
      >
        <mesh material={M.softboxShell} rotation={[Math.PI / 2, Math.PI / 4, 0]} position={[0, 0, -0.18]} castShadow>
          <cylinderGeometry args={[0.47, 0.16, 0.36, 4, 1, true]} />
        </mesh>
        <mesh material={M.softboxFace} position={[0, 0, 0.002]}>
          <planeGeometry args={[0.66, 0.66]} />
        </mesh>
        <rectAreaLight
          ref={(l: THREE.RectAreaLight | null) => {
            if (l && !refs.dimmable.some((d) => d.light === l)) refs.dimmable.push({ light: l, base: 7 })
          }}
          width={0.66}
          height={0.66}
          intensity={0}
          color="#f3f6ff"
          position={[0, 0, 0.02]}
        />
      </group>
    </group>
  )
}

function Fresnel() {
  const at: V3 = [0.75, 0, -2.4]
  const h = 1.7
  const target = useMemo(() => new THREE.Object3D(), [])
  return (
    <group>
      <Stand at={at} h={h} />
      <primitive object={target} position={[0, 1.5, 0]} />
      <group
        position={[at[0], h + 0.1, at[2]]}
        ref={(g) => {
          if (g) g.lookAt(0, 1.5, 0)
        }}
      >
        <mesh material={M.standMetal} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.12, 0.24, 20]} />
        </mesh>
        <mesh material={M.fresnelLens} position={[0, 0, 0.121]}>
          <circleGeometry args={[0.095, 28]} />
        </mesh>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} material={M.standMetal} position={[Math.sin((i * Math.PI) / 2) * 0.16, Math.cos((i * Math.PI) / 2) * 0.16, 0.16]} rotation={[0, 0, (i * Math.PI) / 2]}>
            <boxGeometry args={[0.2, 0.006, 0.12]} />
          </mesh>
        ))}
      </group>
      <spotLight
        ref={(l: THREE.SpotLight | null) => {
          if (!l) return
          l.target = target
          if (!refs.dimmable.some((d) => d.light === l)) refs.dimmable.push({ light: l, base: 18 })
        }}
        position={[at[0], h + 0.1, at[2]]}
        angle={0.5}
        penumbra={0.8}
        distance={9}
        decay={1.7}
        intensity={0}
        color="#ffbe7a"
      />
    </group>
  )
}

function AppleBoxes() {
  return (
    <group position={[0.85, 0, -1.1]} rotation={[0, -0.35, 0]}>
      <mesh material={M.appleBox} position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.51, 0.2, 0.305]} />
      </mesh>
      <mesh material={M.appleBoxDark} position={[0, 0.1, 0.153]}>
        <planeGeometry args={[0.16, 0.05]} />
      </mesh>
      <mesh material={M.appleBox} position={[0.05, 0.25, -0.02]} rotation={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.51, 0.1, 0.305]} />
      </mesh>
    </group>
  )
}

function Tape() {
  const strip = (p: V3, s: [number, number], m: THREE.Material, r = 0) => (
    <mesh position={p} rotation={[-Math.PI / 2, 0, r]} material={m} receiveShadow>
      <planeGeometry args={s} />
    </mesh>
  )
  const corner = (x: number, z: number, rx: number, rz: number) => (
    <group key={`${x}${z}`}>
      {strip([x + rx * 0.06, 0.0015, z], [0.12, 0.024], M.tapeWhite)}
      {strip([x, 0.0016, z + rz * 0.06], [0.024, 0.12], M.tapeWhite)}
    </group>
  )
  return (
    <group>
      {/* the performer's T-mark */}
      {strip([0, 0.0015, 0.14], [0.34, 0.05], M.tapeOrange)}
      {strip([0, 0.0016, 0.0], [0.05, 0.28], M.tapeOrange)}
      {/* cart home marks */}
      {corner(0.32, 1.92, 1, 1)}
      {corner(-0.32, 1.92, -1, 1)}
      {corner(0.32, 2.68, 1, -1)}
      {corner(-0.32, 2.68, -1, -1)}
    </group>
  )
}

function SimOverlay() {
  const grid = useMemo(() => gridMaterial(), [])
  refs.sim.grid = grid
  const arc = useMemo(() => {
    const pts: V3[] = []
    for (let i = 0; i <= 64; i++) {
      const a = -0.95 + (i / 64) * 1.9
      pts.push([Math.sin(a) * 1.9, 0.012, Math.cos(a) * 1.9])
    }
    return pts
  }, [])
  const approach = useMemo<V3[]>(() => {
    const a = -0.95
    const end: V3 = [Math.sin(a) * 1.9, 0.012, Math.cos(a) * 1.9]
    return [[0, 0.012, 2.3], [-0.6, 0.012, 2.15], end]
  }, [])
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]} material={grid} renderOrder={1}>
        <planeGeometry args={[24, 24]} />
      </mesh>
      <group
        ref={(g) => {
          refs.sim.path = g
          if (g) {
            refs.sim.pathMats = []
            g.traverse((o) => {
              const m = (o as THREE.Mesh).material as THREE.Material | undefined
              if (m) refs.sim.pathMats.push(m)
            })
          }
        }}
      >
        <Line points={arc} color="#ef6a1a" lineWidth={3} transparent opacity={0} depthWrite={false} />
        <Line points={approach} color="#1b1c1f" lineWidth={1.5} dashed dashSize={0.06} gapSize={0.05} transparent opacity={0} depthWrite={false} />
      </group>
    </group>
  )
}

export function StageSet() {
  const cove = useMemo(() => coveGeometry(), [])
  return (
    <group>
      <mesh geometry={cove} material={M.cyc} receiveShadow />
      <Softbox />
      <Fresnel />
      <AppleBoxes />
      <Tape />
      <SimOverlay />
    </group>
  )
}
