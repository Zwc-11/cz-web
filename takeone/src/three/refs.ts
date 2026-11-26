import * as THREE from 'three'

// Scene objects the frame loop drives. Components register into these on mount.

export interface ArmRefs {
  base: THREE.Group | null
  yaw: THREE.Group | null
  a1: THREE.Group | null
  a2: THREE.Group | null
  a3: THREE.Group | null
  tool: THREE.Group | null
}

export const newArm = (): ArmRefs => ({ base: null, yaw: null, a1: null, a2: null, a3: null, tool: null })

export interface ExplodePart {
  obj: THREE.Object3D
  home: THREE.Vector3
  offset: THREE.Vector3
  delay: number
}

export interface SubjectRefs {
  root: THREE.Group | null
  hips: THREE.Group | null
  legL: THREE.Group | null
  legR: THREE.Group | null
  kneeL: THREE.Group | null
  kneeR: THREE.Group | null
  armL: THREE.Group | null
  armR: THREE.Group | null
  torso: THREE.Group | null
  head: THREE.Group | null
}

export const refs = {
  rig: null as THREE.Group | null,
  phoneArm: newArm(),
  lightArm: newArm(),
  phoneCam: null as THREE.PerspectiveCamera | null,
  phoneFrustum: null as THREE.LineSegments | null,
  ringSpot: null as THREE.SpotLight | null,
  ringGlow: null as THREE.Sprite | null,
  explode: [] as ExplodePart[],
  labelAnchors: [] as (THREE.Object3D | null)[],
  subject: {
    root: null, hips: null, legL: null, legR: null, kneeL: null, kneeR: null,
    armL: null, armR: null, torso: null, head: null,
  } as SubjectRefs,
  // lights scaled by rt.lit
  dimmable: [] as { light: THREE.Light; base: number }[],
  emissive: [] as { mat: THREE.MeshStandardMaterial; base: number }[],
  sim: {
    grid: null as THREE.ShaderMaterial | null,
    path: null as THREE.Object3D | null,
    pathMats: [] as THREE.Material[],
  },
  hideInPov: [] as THREE.Object3D[],
}

export function addExplode(obj: THREE.Object3D | null, offset: [number, number, number], delay: number) {
  if (!obj) return
  if (refs.explode.some((p) => p.obj === obj)) return
  refs.explode.push({ obj, home: obj.position.clone(), offset: new THREE.Vector3(...offset), delay })
}
