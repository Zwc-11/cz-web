import { useLayoutEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'
import { Rig } from './Rig'
import { Subject } from './Subject'
import { StageSet } from './Set'
import { Director } from './Director'
import { refs } from './refs'
import { rt } from '../store'

RectAreaLightUniformsLib.init()

function Lights() {
  const reg = (base: number) => (l: THREE.Light | null) => {
    if (l && !refs.dimmable.some((d) => d.light === l)) refs.dimmable.push({ light: l, base })
  }
  return (
    <>
      <hemisphereLight ref={reg(0.75)} args={['#f3f5f8', '#86847f', 0]} />
      <directionalLight
        ref={reg(2.1)}
        position={[3.4, 6.8, 4.4]}
        intensity={0}
        color="#fffaf3"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-bias={-0.0004}
        shadow-normalBias={0.025}
      />
      <directionalLight ref={reg(0.45)} position={[-5, 3, 2]} intensity={0} color="#dfe8ff" />
    </>
  )
}

// A small procedural studio for reflections: grey room, a top softbox, two side
// panels and a ring, prefiltered once. No HDR file to download.
function StudioEnv() {
  const { gl, scene } = useThree()
  useLayoutEffect(() => {
    const pm = new THREE.PMREMGenerator(gl)
    const env = new THREE.Scene()
    env.background = new THREE.Color('#3b3c40')
    const panel = (w: number, h: number, p: [number, number, number], r: [number, number, number], k: number, c = '#ffffff') => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k), side: THREE.DoubleSide }),
      )
      m.position.set(...p)
      m.rotation.set(...r)
      env.add(m)
    }
    panel(6, 2, [0, 4, 3], [Math.PI / 2, 0, 0], 2.2)
    panel(3, 2, [-4, 1.8, 0], [0, Math.PI / 2, 0], 1.2)
    panel(2, 2, [4, 1.6, -1], [0, -Math.PI / 2, 0], 1.6, '#ffd9b0')
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.12, 8, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffffff').multiplyScalar(3) }))
    ring.position.set(0, 1.6, -4)
    env.add(ring)
    const target = pm.fromScene(env, 0.03)
    scene.environment = target.texture
    return () => {
      target.dispose()
      pm.dispose()
    }
  }, [gl, scene])
  return null
}

export function Stage() {
  return (
    <Canvas
      className="stage-canvas"
      shadows="percentage"
      dpr={[1, rt.mobile ? 1.5 : 1.75]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: 34, near: 0.05, far: 80, position: [2, 1, 5.5] }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
        scene.background = new THREE.Color(0, 0, 0)
        scene.fog = new THREE.Fog(0x000000, 11, 30)
        rt.sceneReady = true
      }}
      aria-hidden
    >
      <Lights />
      <StudioEnv />
      <StageSet />
      <Rig />
      <Subject />
      <Director />
    </Canvas>
  )
}
