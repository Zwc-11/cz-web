export type SignatureForm = 'orbit' | 'weave' | 'bloom'

export type SignatureRenderer = {
  form: (form: SignatureForm) => void
  pointer: (x: number, y: number) => void
  rotate: (x: number, y: number) => void
  ripple: () => void
  pause: (paused: boolean) => void
  reset: () => void
  destroy: () => void
}

const vertex = `
precision highp float;
attribute vec2 aParam;
uniform vec3 uForm;
uniform vec2 uRotation;
uniform vec2 uPointer;
uniform float uTime;
uniform float uPulse;
uniform float uAspect;
uniform float uDpr;
uniform mediump float uPass;
uniform float uLight;
uniform float uWarmth;
uniform vec3 uWood;
uniform vec3 uFire;
varying mediump vec3 vColor;
varying mediump float vAlpha;
void main() {
  float t = aParam.x;
  float b = aParam.y;
  float phi = b * 6.2831853;
  float r = 1.03 + .28 * cos(3.0 * t);
  vec3 orbit = vec3((r + .17 * cos(phi)) * cos(2.0*t),
                   (r + .17 * cos(phi)) * sin(2.0*t),
                   .40 * sin(3.0*t) + .17 * sin(phi));
  float lat = (b-.5) * 2.8;
  float shell = 1.20 + .08 * sin(4.0*t + phi*2.0);
  vec3 weave = vec3(shell*cos(lat)*cos(t), shell*sin(lat), shell*cos(lat)*sin(t));
  float petal = .58 + .58 * pow(abs(cos(3.0*t)), 1.4);
  vec3 bloom = vec3((petal+.14*cos(phi))*cos(t),
                   .37*sin(phi) + .14*cos(3.0*t), (petal+.14*cos(phi))*sin(t));
  vec3 p = orbit*uForm.x + weave*uForm.y + bloom*uForm.z;
  p *= 1.0 + .024*sin(uTime*.65 + phi*2.0 + t*3.0);
  float d = length(p.xy-uPointer*1.4);
  float pulse = sin(d*14.0-uPulse*8.0)*exp(-uPulse*1.6)*min(uPulse*3.0,1.0);
  p += normalize(p+vec3(.001)) * pulse * .16;
  p.z += .055*sin(t*5.0+phi+uTime*.45);
  float cy=cos(uRotation.x), sy=sin(uRotation.x);
  p=vec3(p.x*cy+p.z*sy,p.y,-p.x*sy+p.z*cy);
  float cx=cos(uRotation.y), sx=sin(uRotation.y);
  p=vec3(p.x,p.y*cx-p.z*sx,p.y*sx+p.z*cx);
  float perspective = 3.5/(4.8-p.z);
  gl_Position = vec4(p.x*perspective/uAspect*.88,p.y*perspective*.67,0.0,1.0);
  gl_PointSize = uDpr * (1.25 + 1.15 * smoothstep(-1.1,1.1,p.z));
  float blend = smoothstep(.08,.94,b + .14*sin(t*2.0) + (uWarmth-.5)*.5);
  vColor=mix(uWood,uFire,blend);
  float front=smoothstep(-1.35,1.3,p.z);
  vAlpha = mix(.10,.52,front) * mix(1.0,.65,uLight);
  if (uPass>.5) vAlpha= mix(.12,.72,front) * mix(1.0,.65,uLight);
}
`

const fragment = `
precision mediump float;
uniform mediump float uPass;
varying mediump vec3 vColor;
varying mediump float vAlpha;
void main(){
  float alpha=vAlpha;
  if(uPass>.5) alpha*=1.0-smoothstep(.12,.5,length(gl_PointCoord-vec2(.5)));
  gl_FragColor=vec4(vColor,alpha);
}
`

const forms: Record<SignatureForm, [number, number, number]> = {
  orbit: [1, 0, 0], weave: [0, 1, 0], bloom: [0, 0, 1],
}

const color = (value: string) => {
  const hex = value.trim().replace('#', '')
  return [0, 2, 4].map(start => parseInt(hex.slice(start, start + 2), 16) / 255)
}

/** Two static buffers and two batched draws; only uniforms change per frame. */
export function createSignatureRenderer(canvas: HTMLCanvasElement, reduce: boolean, onLost: () => void): SignatureRenderer | null {
  let gl: WebGLRenderingContext | null
  try { gl = canvas.getContext('webgl', { alpha: true, antialias: true, depth: false, powerPreference: 'low-power' }) }
  catch { console.warn('Living signature: WebGL context could not be created. Showing the static sculpture.'); return null }
  if (!gl) { console.warn('Living signature: WebGL is unavailable. Showing the static sculpture.'); return null }
  const program = gl.createProgram()
  if (!program) return null
  const shaders: WebGLShader[] = []
  for (const [type, source] of [[gl.VERTEX_SHADER, vertex], [gl.FRAGMENT_SHADER, fragment]] as const) {
    const shader = gl.createShader(type)
    if (!shader) { gl.deleteProgram(program); shaders.forEach(s => gl.deleteShader(s)); return null }
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    gl.attachShader(program, shader)
    shaders.push(shader)
  }
  gl.linkProgram(program)
  const linked = gl.getProgramParameter(program, gl.LINK_STATUS)
  shaders.forEach(s => gl.deleteShader(s))
  if (!linked) {
    console.warn('Living signature: shader program did not link.', gl.getProgramInfoLog(program))
    gl.deleteProgram(program); return null
  }
  const bands = 32, steps = 128
  const params = new Float32Array(bands * steps * 2)
  const indices = new Uint16Array(bands * (steps - 1) * 2)
  let index = 0
  for (let band = 0; band < bands; band++) {
    for (let step = 0; step < steps; step++) {
      const i = band * steps + step
      params[i * 2] = step / (steps - 1) * Math.PI * 2
      params[i * 2 + 1] = band / (bands - 1)
      if (step < steps - 1) { indices[index++] = i; indices[index++] = i + 1 }
    }
  }
  const points = gl.createBuffer(), lines = gl.createBuffer()
  if (!points || !lines) { gl.deleteBuffer(points); gl.deleteBuffer(lines); gl.deleteProgram(program); return null }
  gl.useProgram(program)
  gl.bindBuffer(gl.ARRAY_BUFFER, points)
  gl.bufferData(gl.ARRAY_BUFFER, params, gl.STATIC_DRAW)
  const attribute = gl.getAttribLocation(program, 'aParam')
  gl.enableVertexAttribArray(attribute)
  gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0)
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lines)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
  gl.enable(gl.BLEND)
  // The transparent canvas is composited with premultiplied alpha by the browser.
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
  const uniform = Object.fromEntries(['Form', 'Rotation', 'Pointer', 'Time', 'Pulse', 'Aspect', 'Dpr', 'Pass', 'Light', 'Warmth', 'Wood', 'Fire'].map(name => [name, gl.getUniformLocation(program, `u${name}`)]))
  const pose = { yaw: -.36, pitch: .62, aimYaw: -.36, aimPitch: .62, x: 0, y: 0 }
  let shape: number[] = [1, 0, 0], goal: number[] = [1, 0, 0]
  let visible = true, paused = false, destroyed = false, lost = false, raf = 0, time = 0, previous = 0, pulseAt = -10000, lastDraw = 0
  let width = 1, height = 1, dpr = 1

  function request() {
    if (!raf && !destroyed && !lost && visible && !document.hidden) raf = requestAnimationFrame(draw)
  }
  function colors() {
    if (destroyed || lost) return
    const style = getComputedStyle(document.documentElement)
    gl!.uniform3fv(uniform.Wood, color(style.getPropertyValue('--wood')))
    gl!.uniform3fv(uniform.Fire, color(style.getPropertyValue('--fire')))
    gl!.uniform1f(uniform.Light, document.documentElement.dataset.theme === 'light' ? 1 : 0)
    const warmth = parseFloat(style.getPropertyValue('--element-warmth'))
    gl!.uniform1f(uniform.Warmth, (Number.isFinite(warmth) ? Math.max(0, Math.min(100, warmth)) : 75) / 100)
    request()
  }
  function draw(now: number) {
    raf = 0
    if (destroyed || lost || !visible || document.hidden) { previous = 0; return }
    const dt = previous ? Math.min((now - previous) / 1000, .05) : 0
    previous = now
    if (!paused && !reduce) time += dt
    const ease = reduce ? 1 : 1 - Math.exp(-dt * 7)
    shape = shape.map((v, i) => v + (goal[i] - v) * ease)
    pose.yaw += (pose.aimYaw - pose.yaw) * ease
    pose.pitch += (pose.aimPitch - pose.pitch) * ease
    const pulseAge = reduce ? 10 : Math.max(0, (now - pulseAt) / 1000)
    if (now - lastDraw > 1000 / 45 || reduce || paused) {
      lastDraw = now
      gl!.viewport(0, 0, canvas.width, canvas.height)
      gl!.clearColor(0, 0, 0, 0)
      gl!.clear(gl!.COLOR_BUFFER_BIT)
      gl!.uniform3fv(uniform.Form, shape)
      gl!.uniform2f(uniform.Rotation, pose.yaw + time * .07, pose.pitch + Math.sin(time * .22) * .055)
      gl!.uniform2f(uniform.Pointer, pose.x, pose.y)
      gl!.uniform1f(uniform.Time, time)
      gl!.uniform1f(uniform.Pulse, Math.min(pulseAge, 10))
      gl!.uniform1f(uniform.Aspect, width / height)
      gl!.uniform1f(uniform.Dpr, dpr)
      gl!.uniform1f(uniform.Pass, 0)
      gl!.drawElements(gl!.LINES, indices.length, gl!.UNSIGNED_SHORT, 0)
      gl!.uniform1f(uniform.Pass, 1)
      gl!.drawArrays(gl!.POINTS, 0, bands * steps)
    }
    const settling = shape.some((v, i) => Math.abs(v - goal[i]) > .001) || Math.abs(pose.yaw - pose.aimYaw) > .001 || Math.abs(pose.pitch - pose.aimPitch) > .001
    if (!reduce && (!paused || settling || pulseAge < 3)) request()
    else previous = 0
  }
  const resize = new ResizeObserver(entries => {
    const rect = entries[0]?.contentRect
    if (!rect) return
    width = Math.max(1, rect.width); height = Math.max(1, rect.height)
    dpr = Math.min(window.devicePixelRatio || 1, 1.75)
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr)
    request()
  })
  resize.observe(canvas)
  const observer = new IntersectionObserver(entries => {
    visible = entries[0]?.isIntersecting ?? false
    if (visible) request()
    else { cancelAnimationFrame(raf); raf = 0; previous = 0 }
  })
  observer.observe(canvas)
  const appearance = new MutationObserver(colors)
  appearance.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style'] })
  const visibility = () => { previous = 0; if (!document.hidden) request(); else { cancelAnimationFrame(raf); raf = 0 } }
  document.addEventListener('visibilitychange', visibility)
  const contextLost = (event: Event) => { event.preventDefault(); lost = true; cancelAnimationFrame(raf); raf = 0; onLost() }
  canvas.addEventListener('webglcontextlost', contextLost)
  colors()
  request()
  return {
    form: form => { goal = [...forms[form]]; request() },
    pointer: (x, y) => { pose.x = x; pose.y = y; request() },
    rotate: (x, y) => { if (reduce) return; pose.aimYaw += x; pose.aimPitch = Math.max(-1.2, Math.min(1.2, pose.aimPitch + y)); request() },
    ripple: () => { if (reduce) return; pulseAt = performance.now(); request() },
    pause: value => { paused = value; request() },
    reset: () => { pose.aimYaw = -.36; pose.aimPitch = .62; time = 0; pulseAt = -10000; goal = [1, 0, 0]; request() },
    destroy: () => {
      if (destroyed) return
      destroyed = true; cancelAnimationFrame(raf)
      resize.disconnect(); observer.disconnect(); appearance.disconnect()
      document.removeEventListener('visibilitychange', visibility)
      canvas.removeEventListener('webglcontextlost', contextLost)
      gl.deleteBuffer(points); gl.deleteBuffer(lines); gl.deleteProgram(program)
    },
  }
}
