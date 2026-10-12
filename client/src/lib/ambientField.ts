import * as THREE from 'three'

/**
 * A quiet field of points rolling like low waves, tinted with the site's
 * wood and fire colours. It reads the theme from CSS variables, follows the
 * pointer a little, drifts with scroll, and stops drawing when the tab is
 * hidden. With reduced motion it renders one still frame.
 */
export function startAmbientField(canvas: HTMLCanvasElement, reduceMotion: boolean) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'low-power' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
  camera.position.set(0, 2.4, 9)

  // Grid of points on the XZ plane.
  const cols = 150, rows = 90, spacing = 0.2
  const positions = new Float32Array(cols * rows * 3)
  const seeds = new Float32Array(cols * rows)
  let i = 0
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      positions[i * 3] = (c - cols / 2) * spacing
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = (r - rows / 2) * spacing - 4
      seeds[i] = Math.random()
      i++
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('seed', new THREE.BufferAttribute(seeds, 1))

  const uniforms = {
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uWood: { value: new THREE.Color('#b6cca0') },
    uFire: { value: new THREE.Color('#f2a080') },
    uWarmth: { value: 0.75 },
    uSize: { value: 3.2 * renderer.getPixelRatio() },
    uAlpha: { value: 0.75 },
  }

  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    vertexShader: /* glsl */ `
      uniform float uTime;
      uniform vec2 uPointer;
      uniform float uSize;
      attribute float seed;
      varying float vHeight;
      varying float vFade;
      varying float vSeed;
      void main() {
        vec3 p = position;
        float t = uTime * 0.35;
        float h = sin(p.x * 0.55 + t) * 0.32
                + sin(p.z * 0.8 - t * 1.3) * 0.22
                + sin((p.x + p.z) * 0.35 + t * 0.6) * 0.28;
        // A soft swell that follows the pointer.
        vec2 target = vec2(uPointer.x * 9.0, uPointer.y * -5.0 - 2.0);
        float d = distance(p.xz, target);
        h += 0.55 * exp(-d * d * 0.06);
        p.y = h;
        vHeight = h;
        vSeed = seed;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vFade = smoothstep(26.0, 6.0, -mv.z) * smoothstep(0.5, 3.0, -mv.z);
        gl_PointSize = uSize * (6.0 / -mv.z) * (0.75 + seed * 0.5);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uWood;
      uniform vec3 uFire;
      uniform float uWarmth;
      uniform float uAlpha;
      varying float vHeight;
      varying float vFade;
      varying float vSeed;
      void main() {
        float r = length(gl_PointCoord - 0.5);
        if (r > 0.5) discard;
        float soft = smoothstep(0.5, 0.1, r);
        float k = clamp(vHeight * 0.9 + 0.5, 0.0, 1.0);
        vec3 col = mix(uWood, uFire, mix(k, uWarmth, 0.35));
        float a = soft * vFade * uAlpha * (0.45 + 0.55 * k) * (0.6 + 0.4 * vSeed);
        gl_FragColor = vec4(col, a);
      }
    `,
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  const readTheme = () => {
    const css = getComputedStyle(document.documentElement)
    const wood = css.getPropertyValue('--wood').trim()
    const fire = css.getPropertyValue('--fire').trim()
    const warmth = parseFloat(css.getPropertyValue('--element-warmth')) / 100
    if (wood) uniforms.uWood.value.set(wood)
    if (fire) uniforms.uFire.value.set(fire)
    if (!Number.isNaN(warmth)) uniforms.uWarmth.value = warmth
    uniforms.uAlpha.value = document.documentElement.dataset.theme === 'light' ? 0.75 : 0.95
  }
  readTheme()
  const themeObserver = new MutationObserver(() => { readTheme(); if (reduceMotion) render() })
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style'] })

  const resize = () => {
    const w = window.innerWidth, h = window.innerHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  resize()
  window.addEventListener('resize', resize)

  const pointer = new THREE.Vector2(0, 0)
  const onPointer = (e: PointerEvent) => {
    pointer.set(e.clientX / window.innerWidth * 2 - 1, e.clientY / window.innerHeight * 2 - 1)
  }
  window.addEventListener('pointermove', onPointer, { passive: true })

  const render = () => {
    const scroll = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    camera.position.y = 2.4 - scroll * 1.1
    camera.position.x = uniforms.uPointer.value.x * 0.6
    camera.lookAt(0, -0.2 - scroll * 0.6, -2)
    points.rotation.y = scroll * 0.35
    renderer.render(scene, camera)
  }

  let frame = 0
  let last = performance.now()
  const loop = (now: number) => {
    frame = requestAnimationFrame(loop)
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    uniforms.uTime.value += dt
    uniforms.uPointer.value.lerp(pointer, 0.04)
    render()
  }
  const onVisibility = () => {
    cancelAnimationFrame(frame)
    if (!document.hidden && !reduceMotion) { last = performance.now(); frame = requestAnimationFrame(loop) }
  }
  const onScrollStill = () => render()

  if (reduceMotion) {
    render()
    window.addEventListener('scroll', onScrollStill, { passive: true })
    window.addEventListener('resize', onScrollStill)
  } else {
    frame = requestAnimationFrame(loop)
    document.addEventListener('visibilitychange', onVisibility)
  }

  return () => {
    cancelAnimationFrame(frame)
    themeObserver.disconnect()
    window.removeEventListener('resize', resize)
    window.removeEventListener('pointermove', onPointer)
    window.removeEventListener('scroll', onScrollStill)
    window.removeEventListener('resize', onScrollStill)
    document.removeEventListener('visibilitychange', onVisibility)
    geometry.dispose()
    material.dispose()
    renderer.dispose()
  }
}
