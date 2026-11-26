import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { rt, setUi, getUi, bus } from '../store'
import { refs, type ArmRefs } from './refs'
import { shotPose, blendPose, smooth, RIG_SPOT } from './choreography'
import { templateFrame, FACE_Y, ease } from './templates'
import { wheelSpin } from './Rig'
import { COLORS, M } from './materials'

// The frame loop. Everything that moves is decided here, in a fixed order:
// lights -> page camera -> rig and performer -> render (captures, page, monitor).

const HOME = { x: 0, z: 2.3 }
export const cart = { x: HOME.x, z: HOME.z, yaw: Math.PI }
const subj = { x: 0, z: 0, yaw: 0, phase: 0, walk: 0 }
const aimPhone = new THREE.Vector3(0, FACE_Y, 0)
const aimLight = new THREE.Vector3(0, FACE_Y, 0)
let lift = 0
let phoneFov = 40
let captured = false
let seeded = false

const tmp = new THREE.Vector3()
const tmp2 = new THREE.Vector3()
const tmp3 = new THREE.Vector3()
const look = new THREE.Vector3()
const bg = new THREE.Color()
const simCyc = new THREE.Color('#c6c9cd')
const baseCyc = new THREE.Color('#d7d8d4')
const seedCam = new THREE.PerspectiveCamera(40, 16 / 9, 0.03, 40)
let cap2d: CanvasRenderingContext2D | null = null

const TAU = Math.PI * 2
const wrapA = (a: number) => ((((a + Math.PI) % TAU) + TAU) % TAU) - Math.PI
const dampAngle = (cur: number, to: number, l: number, dt: number) => cur + wrapA(to - cur) * (1 - Math.exp(-l * dt))
const lerpAngle = (a: number, b: number, t: number) => a + wrapA(b - a) * t
const damp = THREE.MathUtils.damp
const clamp01 = (x: number) => Math.min(1, Math.max(0, x))

function flick(t: number, a: number, b: number) {
  if (t < a) return 0
  if (t > b) return 1
  const k = (t - a) / (b - a)
  if (k > 0.72) return 1
  const on = Math.sin(t * 61) + Math.sin(t * 23.7) > 0.35
  return on ? 0.85 : 0.08
}

function solveArm(arm: ArmRefs, target: THREE.Vector3, lft: number, straight: number) {
  const { base, yaw, a1, a2, a3 } = arm
  if (!base || !yaw || !a1 || !a2 || !a3) return
  tmp.copy(target)
  base.worldToLocal(tmp)
  const yw = Math.atan2(tmp.x, tmp.z)
  const s1 = 0.1 + 0.45 * lft
  const s2 = 0.55 - 0.65 * lft
  const k = 1 - straight
  yaw.rotation.y = yw * k
  a1.rotation.x = s1 * k
  a2.rotation.x = s2 * k
  a3.rotation.x = 0
  yaw.updateMatrixWorld(true)
  tmp2.setFromMatrixPosition(a3.matrixWorld)
  yaw.worldToLocal(tmp2)
  tmp3.copy(target)
  yaw.worldToLocal(tmp3)
  const dz = Math.hypot(tmp3.z - tmp2.z, tmp3.x - tmp2.x)
  const dy = tmp3.y - tmp2.y
  const eps = Math.atan2(dy, dz)
  a3.rotation.x = (-eps - s1 - s2) * k
  yaw.updateMatrixWorld(true)
}

function capture(gl: THREE.WebGLRenderer, scene: THREE.Scene, cam: THREE.Camera): string {
  const W = 320
  const H = 180
  const dpr = gl.getPixelRatio()
  const canvas = gl.domElement
  gl.setScissorTest(true)
  gl.setViewport(0, 0, W, H)
  gl.setScissor(0, 0, W, H)
  refs.hideInPov.forEach((o) => (o.visible = false))
  if (refs.phoneFrustum) refs.phoneFrustum.visible = false
  gl.render(scene, cam)
  refs.hideInPov.forEach((o) => (o.visible = true))
  if (refs.phoneFrustum) refs.phoneFrustum.visible = true
  gl.setScissorTest(false)
  if (!cap2d) {
    const c = document.createElement('canvas')
    c.width = W
    c.height = H
    cap2d = c.getContext('2d')
  }
  if (!cap2d) return ''
  cap2d.drawImage(canvas, 0, canvas.height - H * dpr, W * dpr, H * dpr, 0, 0, W, H)
  return cap2d.canvas.toDataURL('image/jpeg', 0.82)
}

const SEEDS: { pos: [number, number, number]; look: [number, number, number]; fov: number; template: 'push_in' | 'orbit' | 'track_follow' }[] = [
  { pos: [0.02, 1.62, 1.45], look: [0, 1.55, 0], fov: 38, template: 'push_in' },
  { pos: [1.35, 1.52, 1.3], look: [0, 1.35, 0], fov: 40, template: 'orbit' },
  { pos: [0.5, 1.7, 2.95], look: [0, 1.15, 0], fov: 44, template: 'track_follow' },
]

export function Director() {
  const { gl, scene, camera, size } = useThree()
  const cam = camera as THREE.PerspectiveCamera

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 1 / 20)
    rt.time += dt
    const t = rt.time
    // the intro runs on wall-clock time so a slow first few frames can't stretch it
    const now = performance.now() / 1000
    if (rt.introStart < 0) rt.introStart = now + 0.25
    const it = now - rt.introStart

    // ---------- lights ----------
    const ring = rt.reduced ? 1 : flick(it, 0.25, 0.95)
    const stage = rt.reduced ? 1 : smooth(1.35, 2.35, it) * (it < 1.75 ? flick(it, 1.35, 1.75) * 0.6 + 0.4 : 1)
    const wrapDim = smooth(5.45, 6.0, rt.s)
    const lit = stage * (1 - 0.9 * wrapDim)
    rt.lit = lit
    const ui = getUi()
    if (!ui.introDone && (rt.reduced || it > 2.2)) setUi({ introDone: true })
    setUi({ dark: lit < 0.45 })

    refs.dimmable.forEach((d) => (d.light.intensity = d.base * lit))
    refs.emissive.forEach((e) => (e.mat.emissiveIntensity = e.base * Math.max(ring * 0.5, lit)))
    M.softboxFace.emissiveIntensity = 1.6 * lit
    M.fresnelLens.emissiveIntensity = 2.4 * lit
    M.ringFace.emissiveIntensity = 2.4 * ring
    if (refs.ringSpot) refs.ringSpot.intensity = 5 * ring
    if (refs.ringGlow) (refs.ringGlow.material as THREE.SpriteMaterial).opacity = ring * (0.55 + 0.45 * (1 - lit))
    scene.environmentIntensity = 0.55 * lit + 0.04
    const bgk = Math.pow(lit, 1.25) * 0.97
    bg.copy(COLORS.cyc).multiplyScalar(bgk)
    if (scene.background instanceof THREE.Color) scene.background.copy(bg)
    if (scene.fog) scene.fog.color.copy(bg)
    rt.speaking = Math.max(0, rt.speaking - dt * 1.6)
    M.speakerRing.emissiveIntensity = 0.3 + rt.speaking * (2.5 + Math.sin(t * 30) * 0.8)

    // ---------- page camera ----------
    const mobile = rt.mobile
    let pose = shotPose(rt.shot, rt.f, mobile)
    if (rt.blend > 0) {
      const b = rt.reduced ? (rt.blend > 0.5 ? 1 : 0) : rt.blend
      pose = blendPose(pose, shotPose(rt.shot + 1, 0, mobile), b)
    }
    if (!rt.reduced && it < 2.6) {
      // the intro cranes up from the floor as the lights come on
      const k = 1 - ease(clamp01((it - 0.6) / 2.0))
      pose = { ...pose, pos: [pose.pos[0] - 0.3 * k, pose.pos[1] - 0.65 * k, pose.pos[2] + 0.4 * k] }
    }
    if (rt.explode > 0) {
      // frame the exploded rig: it grows upward, so the camera rises and widens with it
      const k = rt.explode * (rt.shot === 5 ? 1 : 0)
      pose = { ...pose, pos: [pose.pos[0], pose.pos[1] + 0.45 * k, pose.pos[2]], target: [pose.target[0], pose.target[1] + 0.5 * k, pose.target[2]], fov: pose.fov + 6 * k }
    }
    cam.position.set(pose.pos[0], pose.pos[1], pose.pos[2])
    if (!rt.reduced) {
      const px = rt.pointer.x * (rt.shot === 0 ? 0.16 : 0.06)
      const py = rt.pointer.y * (rt.shot === 0 ? 0.1 : 0.04)
      cam.position.x += px + Math.sin(t * 0.21) * 0.025
      cam.position.y += py + Math.sin(t * 0.17) * 0.018
    }
    look.set(pose.target[0], pose.target[1], pose.target[2])
    cam.lookAt(look)
    cam.fov = pose.fov
    cam.aspect = size.width / size.height
    cam.setViewOffset(size.width, size.height, -pose.offset * size.width, -(pose.offsetY ?? 0) * size.height, size.width, size.height)
    cam.updateProjectionMatrix()

    // ---------- rig and performer ----------
    const tk = rt.take
    let cx = HOME.x
    let cz = HOME.z
    let cyaw: number | null = null
    let targetLift = 0
    let fov = 40
    let sx = 0
    let sz = 0
    let walking = false
    let direct = false
    aimPhone.set(0, FACE_Y, 0)

    if (rt.shot === 0) {
      aimPhone.set(rt.pointer.x * 0.9, FACE_Y - 0.12 + rt.pointer.y * 0.45, 0)
    }
    if (rt.shot === 2 || (rt.shot === 1 && rt.blend > 0.4)) {
      const f2 = rt.shot === 2 ? rt.f : 0
      const u = clamp01((f2 - 0.12) / 0.76)
      const fr = templateFrame('orbit', u)
      cx = fr.cart[0]
      cz = fr.cart[1]
      aimPhone.set(fr.aim[0], fr.aim[1], fr.aim[2])
    }

    if (rt.shot === 5 || (rt.shot === 4 && rt.blend > 0.35)) {
      // the cart rolls off the set for its close-up and turns its front to the camera
      cx = RIG_SPOT[0]
      cz = RIG_SPOT[1]
      cyaw = -2.25
      aimPhone.set(RIG_SPOT[0] - 1.6, 1.55, RIG_SPOT[1] - 1.9)
    }

    if (tk && tk.phase !== 'idle' && tk.phase !== 'thinking') {
      direct = true
      const tt = t - tk.phaseStart
      if (tk.phase === 'reposition') {
        if (!tk.from) tk.from = { x: cart.x, z: cart.z, yaw: cart.yaw }
        const f0 = templateFrame(tk.template, 0)
        const yaw0 = f0.yaw ?? Math.atan2(f0.subject[0] - f0.cart[0], f0.subject[1] - f0.cart[1])
        const dist = Math.hypot(f0.cart[0] - tk.from.x, f0.cart[1] - tk.from.z)
        const dur = Math.min(2.6, Math.max(1.1, dist / 0.7 + Math.abs(wrapA(yaw0 - tk.from.yaw)) / 2))
        const k = ease(clamp01(tt / dur))
        cx = tk.from.x + (f0.cart[0] - tk.from.x) * k
        cz = tk.from.z + (f0.cart[1] - tk.from.z) * k
        cyaw = lerpAngle(tk.from.yaw, yaw0, k)
        targetLift = f0.lift * k
        fov = 40 + (f0.fov - 40) * k
        aimPhone.set(f0.aim[0], f0.aim[1], f0.aim[2])
        sx = f0.subject[0] * k
        sz = f0.subject[1] * k
        walking = Math.abs(f0.subject[0]) > 0.2 && k < 0.95
        if (tt >= dur) {
          tk.phase = 'rolling'
          tk.phaseStart = t
          captured = false
          bus.dispatchEvent(new Event('rolling'))
        }
      } else {
        const u = tk.phase === 'rolling' ? clamp01(tt / tk.duration) : 1
        const fr = templateFrame(tk.template, u)
        cx = fr.cart[0]
        cz = fr.cart[1]
        cyaw = fr.yaw
        targetLift = fr.lift
        fov = fr.fov
        aimPhone.set(fr.aim[0], fr.aim[1], fr.aim[2])
        sx = fr.subject[0]
        sz = fr.subject[1]
        walking = tk.phase === 'rolling' && fr.walking
        if (tk.phase === 'rolling') {
          if (rt.monitorClock) {
            const fr24 = Math.floor((tt % 1) * 24)
            rt.monitorClock.textContent = `00:00:${String(Math.floor(tt)).padStart(2, '0')}:${String(fr24).padStart(2, '0')}`
          }
          if (!captured && u > 0.55) {
            captured = true
            const id = tk.id
            rt.captureJobs.push({ kind: 'pov', done: (url) => bus.dispatchEvent(new CustomEvent('thumb', { detail: { id, url } })) })
          }
          if (u >= 1) {
            tk.phase = 'cut'
            tk.phaseStart = t
            bus.dispatchEvent(new Event('cut'))
          }
        } else if (tk.phase === 'cut' && !captured) {
          captured = true
          const id = tk.id
          rt.captureJobs.push({ kind: 'pov', done: (url) => bus.dispatchEvent(new CustomEvent('thumb', { detail: { id, url } })) })
        } else if (tk.phase === 'cut' && tt > 1.3) {
          rt.take = null
          bus.dispatchEvent(new Event('done'))
        }
      }
    }

    // cart: follows the take exactly, everything else eases
    const prevX = cart.x
    const prevZ = cart.z
    const faceYaw = Math.atan2(subj.x - cx, subj.z - cz)
    if (direct) {
      cart.x = cx
      cart.z = cz
      cart.yaw = cyaw ?? dampAngle(cart.yaw, faceYaw, 10, dt)
      lift = targetLift
      phoneFov = fov
    } else {
      cart.x = damp(cart.x, cx, 2.6, dt)
      cart.z = damp(cart.z, cz, 2.6, dt)
      cart.yaw = dampAngle(cart.yaw, cyaw ?? faceYaw, 3, dt)
      lift = damp(lift, targetLift, 3, dt)
      phoneFov = damp(phoneFov, fov, 3, dt)
    }
    const moved = Math.hypot(cart.x - prevX, cart.z - prevZ)
    const fwd = (cart.x - prevX) * Math.sin(cart.yaw) + (cart.z - prevZ) * Math.cos(cart.yaw)
    wheelSpin.forEach((g) => (g.rotation.x += (moved / 0.09) * Math.sign(fwd || 1)))
    if (refs.rig) {
      refs.rig.position.set(cart.x, 0, cart.z)
      refs.rig.rotation.y = cart.yaw
    }

    // performer: walks when the take moves them, otherwise drifts back to the mark
    const sdx = sx - subj.x
    const sdz = sz - subj.z
    const sd = Math.hypot(sdx, sdz)
    if (direct && walking) {
      subj.x = sx
      subj.z = sz
    } else if (sd > 0.01) {
      const step = Math.min(sd, dt * 0.95)
      subj.x += (sdx / sd) * step
      subj.z += (sdz / sd) * step
      walking = sd > 0.05
    }
    const s = refs.subject
    if (s.root) {
      if (refs.phoneCam) refs.phoneCam.getWorldPosition(tmp)
      else tmp.set(cart.x, 1.7, cart.z)
      const toPhone = Math.atan2(tmp.x - subj.x, tmp.z - subj.z)
      const travel = walking ? Math.atan2(sdx || 1, sdz || 0.0001) : toPhone
      const want = walking && !direct ? travel : walking ? lerpAngle(travel, toPhone, 0.45) : toPhone
      subj.yaw = dampAngle(subj.yaw, want, 5, dt)
      s.root.position.set(subj.x, 0, subj.z)
      s.root.rotation.y = subj.yaw
      subj.walk = damp(subj.walk, walking ? 1 : 0, 7, dt)
      subj.phase += dt * 7.2 * subj.walk
      const w = subj.walk
      const ph = subj.phase
      if (s.legL && s.legR && s.kneeL && s.kneeR && s.armL && s.armR && s.hips && s.torso && s.head) {
        s.legL.rotation.x = Math.sin(ph) * 0.48 * w
        s.legR.rotation.x = -Math.sin(ph) * 0.48 * w
        s.kneeL.rotation.x = Math.max(0, Math.sin(ph - 1.3)) * 0.85 * w
        s.kneeR.rotation.x = Math.max(0, -Math.sin(ph - 1.3)) * 0.85 * w
        s.armL.rotation.x = -Math.sin(ph) * 0.34 * w
        s.armR.rotation.x = Math.sin(ph) * 0.34 * w
        s.hips.position.y = 0.93 + Math.abs(Math.cos(ph)) * 0.022 * w - 0.01 * w
        s.torso.rotation.z = Math.sin(t * 0.9) * 0.012 * (1 - w)
        s.torso.rotation.x = 0.03 * w
        s.torso.scale.y = 1 + Math.sin(t * 1.7) * 0.004
        s.head.rotation.x = rt.shot === 1 ? -0.06 : 0
      }
    }

    // ---------- arms ----------
    let rp = -1
    if (rt.rigEl && (rt.shot === 5 || (rt.shot === 4 && rt.blend > 0))) {
      const r = rt.rigEl.getBoundingClientRect()
      rp = clamp01(-r.top / Math.max(1, r.height - size.height))
    }
    const ex = rp < 0 ? 0 : smooth(0.12, 0.45, rp) * (1 - smooth(0.8, 0.98, rp))
    rt.explode = ex
    refs.explode.forEach((p) => {
      const k = ease(clamp01((ex - p.delay * 0.55) / 0.72))
      p.obj.position.copy(p.home).addScaledVector(p.offset, k)
    })
    const straight = ease(clamp01(ex * 1.6))
    if (refs.rig) refs.rig.updateMatrixWorld(true)
    aimLight.set(subj.x, FACE_Y + 0.05, subj.z)
    solveArm(refs.phoneArm, aimPhone, lift, straight)
    solveArm(refs.lightArm, aimLight, 0.15, straight)

    // phone lens + frustum
    const pc = refs.phoneCam
    if (pc) {
      pc.fov = phoneFov
      pc.updateProjectionMatrix()
      if (rt.monitorLens) {
        const mm = 12 / Math.tan(((phoneFov * Math.PI) / 180) / 2)
        rt.monitorLens.textContent = `${Math.round(mm)} mm`
      }
      const fr = refs.phoneFrustum
      if (fr) {
        const sim = rt.shot === 2 ? smooth(0.0, 0.22, rt.f) * (1 - smooth(0.86, 1, rt.f)) : 0
        const show = Math.max(sim, rt.shot === 3 ? 0.35 : 0)
        ;(fr.material as THREE.LineBasicMaterial).opacity = show
        fr.visible = show > 0.01
        if (fr.visible) {
          pc.getWorldPosition(tmp)
          const D = Math.min(3.4, Math.max(0.8, tmp.distanceTo(tmp2.set(subj.x, 1.3, subj.z))))
          const hh = D * Math.tan(((phoneFov * Math.PI) / 180) / 2)
          const hw = hh * (16 / 9)
          const c = [
            [-hw, -hh],
            [hw, -hh],
            [hw, hh],
            [-hw, hh],
          ]
          const arr = (fr.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array
          let o = 0
          const put = (x: number, y: number, z: number) => {
            arr[o++] = x
            arr[o++] = y
            arr[o++] = z
          }
          for (let i = 0; i < 4; i++) {
            put(0, 0, 0)
            put(c[i][0], c[i][1], -D)
          }
          for (let i = 0; i < 4; i++) {
            const j = (i + 1) % 4
            put(c[i][0], c[i][1], -D)
            put(c[j][0], c[j][1], -D)
          }
          fr.geometry.attributes.position.needsUpdate = true
          fr.geometry.computeBoundingSphere()
        }
      }
    }

    // ---------- simulator overlay ----------
    const sim = rt.shot === 2 ? smooth(0.0, 0.2, rt.f) * (1 - smooth(0.85, 1, rt.f)) : rt.shot === 1 ? smooth(0.5, 1, rt.blend) : 0
    if (refs.sim.grid) refs.sim.grid.uniforms.uOpacity.value = sim
    refs.sim.pathMats.forEach((m) => ((m as THREE.Material & { opacity: number }).opacity = sim))
    M.cyc.color.copy(baseCyc).lerp(simCyc, sim * 0.8)

    // ---------- exploded-view labels ----------
    const lv = smooth(0.55, 0.85, ex)
    rt.labelEls.forEach((el, i) => {
      if (!el) return
      const a = i === 2 ? refs.phoneArm.a2 : refs.labelAnchors[i]
      if (!a || lv <= 0.001) {
        el.style.opacity = '0'
        return
      }
      a.getWorldPosition(tmp)
      tmp.project(cam)
      const x = ((tmp.x + 1) / 2) * size.width
      const y = ((1 - tmp.y) / 2) * size.height
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      el.style.opacity = tmp.z < 1 ? String(lv) : '0'
    })

    if (rt.hudClock) {
      const secs = rt.s * 8
      const fr24 = Math.floor((secs % 1) * 24)
      rt.hudClock.textContent = `00:00:${String(Math.floor(secs)).padStart(2, '0')}:${String(fr24).padStart(2, '0')}`
    }

    // ---------- render ----------
    if (rt.captureJobs.length) {
      const job = rt.captureJobs.shift()!
      if (job.kind === 'pov' && refs.phoneCam) {
        refs.phoneCam.aspect = 16 / 9
        refs.phoneCam.updateProjectionMatrix()
        job.done(capture(gl, scene, refs.phoneCam))
      } else if (job.seed) {
        seedCam.position.set(...job.seed.pos)
        seedCam.fov = job.seed.fov
        seedCam.updateProjectionMatrix()
        seedCam.lookAt(...job.seed.look)
        seedCam.updateMatrixWorld()
        job.done(capture(gl, scene, seedCam))
      }
    }
    if (!seeded && ui.introDone && lit > 0.98 && it > 3) {
      seeded = true
      SEEDS.forEach((sd, i) =>
        rt.captureJobs.push({
          kind: 'seed',
          seed: sd,
          done: (url) =>
            setUi((u) => ({
              takes: [...u.takes, { id: -(i + 1), template: sd.template, duration: [4.6, 6.2, 5.4][i], thumb: url, mine: false }].sort((a, b) =>
                a.mine === b.mine ? (a.mine ? a.id - b.id : b.id - a.id) : a.mine ? 1 : -1,
              ),
            })),
        }),
      )
    }

    gl.setScissorTest(false)
    gl.setViewport(0, 0, size.width, size.height)
    gl.render(scene, cam)

    const mon = rt.monitorEl
    if (mon && refs.phoneCam) {
      const r = mon.getBoundingClientRect()
      if (r.width > 4 && r.bottom > 0 && r.top < size.height) {
        const y = size.height - r.bottom
        refs.phoneCam.aspect = r.width / r.height
        refs.phoneCam.updateProjectionMatrix()
        refs.hideInPov.forEach((o) => (o.visible = false))
        if (refs.phoneFrustum) refs.phoneFrustum.visible = false
        gl.setScissorTest(true)
        gl.setViewport(r.left, y, r.width, r.height)
        gl.setScissor(r.left, y, r.width, r.height)
        gl.render(scene, refs.phoneCam)
        gl.setScissorTest(false)
        refs.hideInPov.forEach((o) => (o.visible = true))
      }
    }
  }, 1)

  return null
}
