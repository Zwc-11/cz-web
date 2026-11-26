import { useMemo, type ReactNode } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { M, doodleTexture, laptopScreenTexture } from './materials'
import { refs, addExplode, type ArmRefs } from './refs'

type V3 = [number, number, number]

function B({ s, p, m, r, cast = true }: { s: V3; p?: V3; m: THREE.Material | THREE.Material[]; r?: V3; cast?: boolean }) {
  return (
    <mesh position={p} rotation={r} material={m} castShadow={cast} receiveShadow>
      <boxGeometry args={s} />
    </mesh>
  )
}

function Cyl({ rt, rb, h, p, r, m, seg = 24 }: { rt: number; rb?: number; h: number; p?: V3; r?: V3; m: THREE.Material; seg?: number }) {
  return (
    <mesh position={p} rotation={r} material={m} castShadow receiveShadow>
      <cylinderGeometry args={[rt, rb ?? rt, h, seg]} />
    </mesh>
  )
}

export const ARM = { L1: 0.155, L2: 0.145, L3: 0.06, SHOULDER: 0.125 }
export const PLATE_Y = 1.63
export const wheelSpin: THREE.Group[] = []

function Arm({ side, arm, tool, explodeX }: { side: number; arm: ArmRefs; tool: ReactNode; explodeX: number }) {
  const { L1, L2, L3 } = ARM
  return (
    <group
      ref={(g) => {
        arm.base = g
        addExplode(g, [explodeX, 0.46, 0.04], side > 0 ? 0.3 : 0.33)
      }}
      position={[side * 0.2, PLATE_Y + 0.01, -0.06]}
    >
      <B s={[0.078, 0.028, 0.085]} p={[0, 0.014, 0]} m={M.pla} />
      <B s={[0.05, 0.034, 0.056]} p={[0, 0.045, 0]} m={M.servo} />
      <group ref={(g) => {
            arm.yaw = g
          }} position={[0, 0.065, 0]}>
        <Cyl rt={0.032} h={0.018} p={[0, 0.009, 0]} m={M.pla} />
        <B s={[0.046, 0.05, 0.042]} p={[0, 0.042, 0]} m={M.servo} />
        <B s={[0.058, 0.03, 0.012]} p={[0, 0.05, 0.026]} m={M.pla} />
        <group ref={(g) => {
            arm.a1 = g
          }} position={[0, 0.06, 0]}>
          <B s={[0.052, L1, 0.03]} p={[0, L1 / 2, 0]} m={M.pla} />
          <B s={[0.02, L1 * 0.6, 0.032]} p={[0, L1 / 2, 0.002]} m={M.plaDark} />
          <B s={[0.042, 0.046, 0.05]} p={[0, L1, 0]} m={M.servo} />
          <group ref={(g) => {
            arm.a2 = g
          }} position={[0, L1, 0]}>
            <B s={[0.042, L2, 0.028]} p={[0, L2 / 2, 0]} m={M.pla} />
            <B s={[0.04, 0.042, 0.046]} p={[0, L2, 0]} m={M.servo} />
            <group ref={(g) => {
            arm.a3 = g
          }} position={[0, L2, 0]}>
              <B s={[0.036, L3, 0.03]} p={[0, L3 / 2, 0]} m={M.plaDark} />
              <group ref={(g) => {
            arm.tool = g
          }} position={[0, L3 + 0.008, 0]}>
                {tool}
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

function Phone() {
  const frustum = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(new Array(16 * 3).fill(0), 3))
    return g
  }, [])
  return (
    <group
      ref={(g) => {
        addExplode(g, [0, 0.05, 0.12], 0.42)
        refs.labelAnchors[0] = g
      }}
      position={[-0.046, 0.045, 0.012]}
    >
      <B s={[0.03, 0.05, 0.012]} p={[0.046, -0.03, -0.006]} m={M.plaDark} />
      <RoundedBox args={[0.158, 0.078, 0.0085]} radius={0.0038} smoothness={3} material={M.phone} castShadow />
      <RoundedBox args={[0.05, 0.05, 0.003]} radius={0.0012} position={[0.046, 0.008, 0.0055]} material={M.phonePlateau} />
      {[
        [0.036, 0.018],
        [0.036, -0.002],
        [0.056, 0.008],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.0085]} rotation={[Math.PI / 2, 0, 0]} material={M.glass}>
          <cylinderGeometry args={[0.0078, 0.0078, 0.004, 20]} />
        </mesh>
      ))}
      <perspectiveCamera
        ref={(c: THREE.PerspectiveCamera | null) => {
          refs.phoneCam = c
        }}
        position={[0.046, 0.008, 0.012]}
        rotation={[0, Math.PI, 0]}
        fov={40}
        aspect={16 / 9}
        near={0.03}
        far={40}
      >
        <lineSegments
          ref={(l: THREE.LineSegments | null) => {
            refs.phoneFrustum = l
          }}
          geometry={frustum}
        >
          <lineBasicMaterial color="#ef6a1a" transparent opacity={0} depthWrite={false} />
        </lineSegments>
      </perspectiveCamera>
    </group>
  )
}

function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grd.addColorStop(0, 'rgba(255,255,255,0.0)')
  grd.addColorStop(0.55, 'rgba(255,255,255,0.55)')
  grd.addColorStop(0.68, 'rgba(255,250,240,0.25)')
  grd.addColorStop(1, 'rgba(255,245,230,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 128, 128)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function RingLight() {
  const glow = useMemo(() => glowTexture(), [])
  const target = useMemo(() => new THREE.Object3D(), [])
  return (
    <group
      ref={(g) => {
        addExplode(g, [0, 0.05, 0.12], 0.44)
        refs.labelAnchors[1] = g
      }}
    >
      <B s={[0.018, 0.07, 0.018]} p={[0, 0.035, 0]} m={M.plaDark} />
      <group position={[0, 0.07 + 0.115, 0.012]}>
        <mesh material={M.ringBack} castShadow>
          <torusGeometry args={[0.116, 0.017, 12, 56]} />
        </mesh>
        <mesh material={M.ringFace} position={[0, 0, 0.009]}>
          <torusGeometry args={[0.112, 0.0095, 10, 72]} />
        </mesh>
        <primitive object={target} position={[0, 0, 1]} />
        <spotLight
          ref={(l: THREE.SpotLight | null) => {
            if (!l) return
            refs.ringSpot = l
            l.target = target
          }}
          position={[0, 0, 0.03]}
          angle={0.62}
          penumbra={1}
          distance={7}
          decay={1.6}
          intensity={0}
          color="#fff6ec"
        />
        <sprite
          ref={(s: THREE.Sprite | null) => {
            refs.ringGlow = s
            if (s) refs.hideInPov.push(s)
          }}
          scale={[0.42, 0.42, 1]}
          position={[0, 0, 0.02]}
        >
          <spriteMaterial map={glow} transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      </group>
    </group>
  )
}

function Cable({ pts, m }: { pts: V3[]; m: THREE.Material }) {
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)))
    return new THREE.TubeGeometry(curve, 48, 0.0045, 6, false)
  }, [pts])
  return <mesh geometry={geo} material={m} castShadow />
}

function Wheel({ x, z, r, w, idx }: { x: number; z: number; r: number; w: number; idx: number }) {
  return (
    <group
      ref={(g) => {
        if (g) addExplode(g, [Math.sign(x) * 0.24, -0.01, 0], 0.02 + idx * 0.02)
        if (idx === 0) refs.labelAnchors[6] = g
      }}
      position={[x, r, z]}
    >
      <group
        ref={(g) => {
          if (g && !wheelSpin.includes(g)) wheelSpin.push(g)
        }}
      >
        <Cyl rt={r} h={w} r={[0, 0, Math.PI / 2]} m={M.rubber} seg={32} />
        <Cyl rt={r * 0.55} h={w + 0.004} r={[0, 0, Math.PI / 2]} m={M.hub} seg={24} />
        <B s={[w + 0.006, r * 0.9, 0.012]} m={M.servo} cast={false} />
      </group>
    </group>
  )
}

export function Rig() {
  const W = 0.56
  const D = 0.72
  const DECK = 0.66
  const SHELF = 0.13
  const doodle = useMemo(() => doodleTexture(), [])
  const screen = useMemo(() => laptopScreenTexture(), [])
  const plateMats = useMemo(() => {
    const top = new THREE.MeshStandardMaterial({ map: doodle, roughness: 0.75 })
    return [M.wood, M.wood, top, M.wood, M.wood, M.wood]
  }, [doodle])
  const screenMat = useMemo(
    () => new THREE.MeshStandardMaterial({ map: screen, emissiveMap: screen, emissive: '#ffffff', emissiveIntensity: 0.9, roughness: 0.3 }),
    [screen],
  )
  refs.emissive = refs.emissive.filter((e) => e.mat !== screenMat)
  refs.emissive.push({ mat: screenMat, base: 0.9 })

  const legX = W / 2 - 0.0225
  const legZ = D / 2 - 0.0225

  return (
    <group ref={(g) => {
            refs.rig = g
          }} position={[0, 0, 2.3]} rotation={[0, Math.PI, 0]}>
      {/* cart frame: four legs, a tray deck and a lower shelf */}
      {[
        [legX, legZ],
        [-legX, legZ],
        [legX, -legZ],
        [-legX, -legZ],
      ].map(([x, z], i) => (
        <B key={i} s={[0.045, 0.68, 0.045]} p={[x, 0.06 + 0.34, z]} m={M.wood} />
      ))}
      <B s={[W - 0.03, 0.016, D - 0.03]} p={[0, DECK, 0]} m={M.wood} />
      <B s={[W, 0.05, 0.04]} p={[0, DECK + 0.03, legZ + 0.002]} m={M.woodEdge} />
      <B s={[W, 0.05, 0.04]} p={[0, DECK + 0.03, -legZ - 0.002]} m={M.woodEdge} />
      <B s={[0.04, 0.05, D]} p={[legX + 0.002, DECK + 0.03, 0]} m={M.woodEdge} />
      <B s={[0.04, 0.05, D]} p={[-legX - 0.002, DECK + 0.03, 0]} m={M.woodEdge} />
      <B s={[W - 0.03, 0.014, D - 0.03]} p={[0, SHELF, 0]} m={M.wood} />
      <B s={[W, 0.04, 0.035]} p={[0, SHELF + 0.02, legZ]} m={M.woodEdge} />
      <B s={[W, 0.04, 0.035]} p={[0, SHELF + 0.02, -legZ]} m={M.woodEdge} />

      {/* drive wheels forward, casters behind */}
      <Wheel x={W / 2 + 0.04} z={0.2} r={0.09} w={0.055} idx={0} />
      <Wheel x={-W / 2 - 0.04} z={0.2} r={0.09} w={0.055} idx={1} />
      {[legX, -legX].map((x, i) => (
        <group key={i} ref={(g) => addExplode(g, [0, -0.1, 0], 0.06)} position={[x, 0.035, -legZ]}>
          <Cyl rt={0.03} h={0.022} r={[0, 0, Math.PI / 2]} m={M.rubber} />
          <B s={[0.03, 0.04, 0.03]} p={[0, 0.03, 0]} m={M.hub} />
        </group>
      ))}

      {/* electronics bay on the lower shelf */}
      <group
        ref={(g) => {
          addExplode(g, [-0.6, 0.02, 0], 0.1)
          refs.labelAnchors[5] = g
        }}
        position={[0, SHELF + 0.075, -0.04]}
      >
        <mesh material={M.clear}>
          <boxGeometry args={[0.36, 0.13, 0.26]} />
        </mesh>
        <B s={[0.14, 0.008, 0.09]} p={[-0.07, -0.05, 0.02]} m={M.pcbGreen} />
        <B s={[0.07, 0.03, 0.05]} p={[0.08, -0.035, -0.04]} m={M.pcbBlue} />
        <B s={[0.1, 0.008, 0.07]} p={[0.06, -0.05, 0.06]} m={M.pcbGreen} />
        <mesh position={[-0.1, -0.04, 0.05]} material={M.ledGreen}>
          <sphereGeometry args={[0.006, 8, 8]} />
        </mesh>
        <mesh position={[0.02, -0.04, -0.02]} material={M.ledRed}>
          <sphereGeometry args={[0.005, 8, 8]} />
        </mesh>
      </group>

      {/* laptop coordinator, screen facing the operator behind the cart */}
      <group
        ref={(g) => {
          addExplode(g, [0, 0.24, 0.3], 0.15)
          refs.labelAnchors[4] = g
        }}
        position={[0, DECK + 0.016, 0.08]}
      >
        <B s={[0.3, 0.014, 0.21]} p={[0, 0.007, 0]} m={M.laptop} />
        <group position={[0, 0.014, 0.105]} rotation={[0.32, 0, 0]}>
          <B s={[0.3, 0.2, 0.008]} p={[0, 0.1, 0]} m={M.laptop} />
          <mesh position={[0, 0.1, -0.0045]} rotation={[0, Math.PI, 0]} material={screenMat}>
            <planeGeometry args={[0.285, 0.18]} />
          </mesh>
        </group>
      </group>

      {/* two-post tower with its wiring */}
      <group
        ref={(g) => {
          addExplode(g, [0, 0.16, 0], 0.2)
        }}
      >
        <group
          position={[0.23, 1.12, -0.1]}
          ref={(g) => {
            refs.labelAnchors[3] = g
          }}
        />
        {[0.2, -0.2].map((x) => (
          <B key={x} s={[0.055, PLATE_Y - DECK, 0.055]} p={[x, (PLATE_Y + DECK) / 2, -0.1]} m={M.wood} />
        ))}
        <Cable m={M.wireRed} pts={[[0.235, 1.6, -0.08], [0.24, 1.3, -0.07], [0.238, 1.0, -0.075], [0.23, 0.72, -0.06], [0.12, 0.69, -0.02]]} />
        <Cable m={M.wireBlack} pts={[[0.23, 1.6, -0.125], [0.236, 1.25, -0.13], [0.232, 0.9, -0.128], [0.2, 0.7, -0.1], [0.05, 0.69, -0.12]]} />
        <Cable m={M.wireRed} pts={[[-0.235, 1.6, -0.08], [-0.24, 1.2, -0.07], [-0.236, 0.85, -0.075], [-0.2, 0.7, -0.05], [-0.1, 0.69, -0.1]]} />
        <Cable m={M.wireBlack} pts={[[-0.168, 1.6, -0.12], [-0.165, 1.2, -0.13], [-0.168, 0.8, -0.12], [-0.12, 0.7, -0.14]]} />
      </group>

      {/* top plate, speaker, both arms */}
      <group ref={(g) => addExplode(g, [0, 0.31, 0], 0.25)}>
        <B s={[0.64, 0.02, 0.22]} p={[0, PLATE_Y, -0.06]} m={plateMats} />
        <group position={[0, PLATE_Y + 0.03, 0.055]} rotation={[Math.PI / 2, 0, 0]}>
          <Cyl rt={0.03} h={0.026} m={M.speakerGrill} />
          <mesh material={M.speakerRing} position={[0, -0.0135, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.027, 0.0035, 8, 32]} />
          </mesh>
        </group>
      </group>

      <Arm side={1} arm={refs.phoneArm} explodeX={0.16} tool={<Phone />} />
      <Arm side={-1} arm={refs.lightArm} explodeX={-0.16} tool={<RingLight />} />
    </group>
  )
}
