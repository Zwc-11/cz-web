import * as THREE from 'three'
import { M } from './materials'
import { refs } from './refs'

// A faceless performer standing on the mark. Joints are groups the frame loop
// swings for the walk cycle; the root turns to face the phone.

function Limb({ len, r, m }: { len: number; r: number; m: THREE.Material }) {
  return (
    <mesh position={[0, -len / 2, 0]} material={m} castShadow>
      <capsuleGeometry args={[r, len - r * 2, 6, 14]} />
    </mesh>
  )
}

export function Subject() {
  const s = refs.subject
  const HIP = 0.93
  return (
    <group ref={(g) => {
            s.root = g
          }}>
      <group ref={(g) => {
            s.hips = g
          }} position={[0, HIP, 0]}>
        {/* pelvis */}
        <mesh material={M.cloth} castShadow position={[0, 0.02, 0]}>
          <capsuleGeometry args={[0.13, 0.08, 6, 14]} />
        </mesh>
        {/* legs */}
        {([-1, 1] as const).map((side) => (
          <group key={side} ref={(g) => (side < 0 ? (s.legL = g) : (s.legR = g))} position={[side * 0.085, -0.02, 0]}>
            <Limb len={0.46} r={0.06} m={M.cloth} />
            <group ref={(g) => (side < 0 ? (s.kneeL = g) : (s.kneeR = g))} position={[0, -0.44, 0]}>
              <Limb len={0.44} r={0.05} m={M.cloth} />
              <mesh position={[0, -0.45, 0.04]} material={M.shoe} castShadow>
                <boxGeometry args={[0.09, 0.05, 0.22]} />
              </mesh>
            </group>
          </group>
        ))}
        {/* torso, arms, head */}
        <group ref={(g) => {
            s.torso = g
          }} position={[0, 0.08, 0]}>
          <mesh position={[0, 0.24, 0]} material={M.clothLight} castShadow>
            <capsuleGeometry args={[0.16, 0.26, 8, 16]} />
          </mesh>
          {([-1, 1] as const).map((side) => (
            <group key={side} ref={(g) => (side < 0 ? (s.armL = g) : (s.armR = g))} position={[side * 0.205, 0.41, 0]} rotation={[0, 0, side * 0.08]}>
              <Limb len={0.32} r={0.047} m={M.clothLight} />
              <group position={[0, -0.31, 0]} rotation={[-0.15, 0, 0]}>
                <Limb len={0.3} r={0.04} m={M.skin} />
              </group>
            </group>
          ))}
          <mesh position={[0, 0.48, 0]} material={M.skin} castShadow>
            <cylinderGeometry args={[0.045, 0.05, 0.1, 12]} />
          </mesh>
          <group ref={(g) => {
            s.head = g
          }} position={[0, 0.6, 0]}>
            <mesh material={M.skin} castShadow scale={[0.92, 1.12, 1]}>
              <sphereGeometry args={[0.105, 28, 20]} />
            </mesh>
            <mesh material={M.cloth} position={[0, 0.045, -0.012]} scale={[0.98, 0.82, 1.02]}>
              <sphereGeometry args={[0.105, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  )
}
