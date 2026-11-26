import * as THREE from 'three'

// One instance of each material, shared across the scene.
export const COLORS = {
  cyc: new THREE.Color('#d5d6d2'),
  orange: new THREE.Color('#ef6a1a'),
  tally: new THREE.Color('#e0242f'),
}

const std = (p: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial(p)

export const M = {
  cyc: std({ color: '#d7d8d4', roughness: 0.95, metalness: 0 }),
  wood: std({ color: '#151515', roughness: 0.82, metalness: 0.02 }),
  woodEdge: std({ color: '#222222', roughness: 0.7 }),
  pla: std({ color: '#8f9297', roughness: 0.52, metalness: 0.05 }),
  plaDark: std({ color: '#6f7277', roughness: 0.55 }),
  servo: std({ color: '#1c1d20', roughness: 0.45, metalness: 0.2 }),
  rubber: std({ color: '#1a1a1a', roughness: 0.9 }),
  hub: std({ color: '#5d6066', roughness: 0.35, metalness: 0.6 }),
  phone: std({ color: '#ec6a1d', roughness: 0.32, metalness: 0.45 }),
  phonePlateau: std({ color: '#d85c14', roughness: 0.25, metalness: 0.5 }),
  glass: std({ color: '#050608', roughness: 0.05, metalness: 0.9 }),
  ringFace: new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 2.2, roughness: 0.4 }),
  ringBack: std({ color: '#121212', roughness: 0.6 }),
  clear: new THREE.MeshStandardMaterial({ color: '#cfd8dc', roughness: 0.15, metalness: 0, transparent: true, opacity: 0.28, depthWrite: false }),
  pcbGreen: std({ color: '#1f6b3a', roughness: 0.6 }),
  pcbBlue: std({ color: '#1d63c9', roughness: 0.5 }),
  ledGreen: new THREE.MeshStandardMaterial({ color: '#3cff7a', emissive: '#3cff7a', emissiveIntensity: 3 }),
  ledRed: new THREE.MeshStandardMaterial({ color: '#ff3a2f', emissive: '#ff3a2f', emissiveIntensity: 2 }),
  wireRed: std({ color: '#b3261e', roughness: 0.6 }),
  wireBlack: std({ color: '#0c0c0c', roughness: 0.6 }),
  laptop: std({ color: '#2a2c30', roughness: 0.4, metalness: 0.6 }),
  speakerGrill: std({ color: '#0d0d0e', roughness: 0.8 }),
  speakerRing: new THREE.MeshStandardMaterial({ color: '#ef6a1a', emissive: '#ef6a1a', emissiveIntensity: 0 }),
  // subject
  skin: std({ color: '#c9c3ba', roughness: 0.6 }),
  cloth: std({ color: '#33363b', roughness: 0.85 }),
  clothLight: std({ color: '#55585e', roughness: 0.85 }),
  shoe: std({ color: '#101010', roughness: 0.7 }),
  // set
  standMetal: std({ color: '#1f2023', roughness: 0.35, metalness: 0.7 }),
  standChrome: std({ color: '#9a9ca0', roughness: 0.25, metalness: 0.9 }),
  flag: std({ color: '#0d0d0d', roughness: 1 }),
  softboxShell: std({ color: '#141414', roughness: 0.9 }),
  softboxFace: new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#fbfbff', emissiveIntensity: 1.6, roughness: 1 }),
  fresnelLens: new THREE.MeshStandardMaterial({ color: '#ffd29a', emissive: '#ffb45e', emissiveIntensity: 2.4, roughness: 0.3 }),
  appleBox: std({ color: '#b07b46', roughness: 0.78 }),
  appleBoxDark: std({ color: '#7d5530', roughness: 0.8 }),
  tapeOrange: std({ color: '#ef6a1a', roughness: 0.7 }),
  tapeWhite: std({ color: '#f4f4f1', roughness: 0.7 }),
}

// Black plate with white doodles, like the printed sheet on the real tower top.
export function doodleTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 176
  const g = c.getContext('2d')!
  g.fillStyle = '#0b0b0b'
  g.fillRect(0, 0, c.width, c.height)
  g.strokeStyle = 'rgba(240,240,236,0.85)'
  g.lineCap = 'round'
  let seed = 7
  const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  for (let i = 0; i < 70; i++) {
    g.lineWidth = 1 + r() * 2.2
    g.beginPath()
    let x = r() * c.width
    let y = r() * c.height
    g.moveTo(x, y)
    const n = 2 + Math.floor(r() * 4)
    for (let k = 0; k < n; k++) {
      const nx = x + (r() - 0.5) * 90
      const ny = y + (r() - 0.5) * 60
      g.quadraticCurveTo(x + (r() - 0.5) * 60, y + (r() - 0.5) * 60, nx, ny)
      x = nx
      y = ny
    }
    g.stroke()
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

// A tiny version of the Shot Studio screen for the laptop on the cart.
export function laptopScreenTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 320
  const g = c.getContext('2d')!
  g.fillStyle = '#16171a'
  g.fillRect(0, 0, 512, 320)
  g.fillStyle = '#222428'
  g.fillRect(0, 0, 512, 22)
  g.fillStyle = '#e8e8e4'
  g.font = '600 11px sans-serif'
  g.fillText('Shot Studio', 10, 15)
  // viewport with grid
  g.fillStyle = '#d9dad6'
  g.fillRect(8, 30, 340, 200)
  g.strokeStyle = 'rgba(0,0,0,0.12)'
  for (let x = 8; x < 348; x += 14) {
    g.beginPath(); g.moveTo(x, 30); g.lineTo(x, 230); g.stroke()
  }
  for (let y = 30; y < 230; y += 14) {
    g.beginPath(); g.moveTo(8, y); g.lineTo(348, y); g.stroke()
  }
  g.strokeStyle = '#ef6a1a'
  g.lineWidth = 2.5
  g.beginPath()
  g.arc(178, 150, 70, Math.PI * 1.1, Math.PI * 1.9)
  g.stroke()
  g.fillStyle = '#111'
  g.fillRect(170, 120, 14, 22)
  // monitor panel
  g.fillStyle = '#0c0c0d'
  g.fillRect(356, 30, 148, 92)
  g.fillStyle = '#5a5d63'
  g.fillRect(360, 34, 140, 84)
  g.fillStyle = '#c9c3ba'
  g.beginPath(); g.arc(430, 68, 16, 0, Math.PI * 2); g.fill()
  g.fillStyle = '#33363b'
  g.fillRect(410, 86, 40, 32)
  // timeline
  g.fillStyle = '#26282c'
  g.fillRect(8, 240, 496, 70)
  const cols = ['#3b3e44', '#4a4d54', '#3b3e44']
  ;[0, 1, 2].forEach((i) => {
    g.fillStyle = cols[i]
    g.fillRect(14 + i * 162, 262, 156, 18)
  })
  g.fillStyle = '#ef6a1a'
  g.fillRect(200, 248, 2, 56)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}
