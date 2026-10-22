// A tiny isometric voxel renderer used for the original game-world illustrations.
// x runs to the lower right, y to the lower left, z up. Cubes are painted back to
// front (by x + y + z) and faces hidden by a neighbour are skipped.

export interface Voxel {
  x: number
  y: number
  z: number
  color: string
  /** light-emitting cube (windows, crystals, portal) */
  glow?: boolean
  /** 0…1, translucent cubes do not hide their neighbours' faces */
  alpha?: number
  /** draw two eyes on the face looking towards +x or +y */
  eyes?: 'x' | 'y'
}

export interface Annotation {
  x: number
  y: number
  z: number
  text: string
  kind: 'bubble' | 'tag' | 'marker'
  tone?: 'cyan' | 'violet' | 'mint' | 'amber' | 'rose'
  delay?: number
}

export interface Scene {
  voxels: Voxel[]
  annotations?: Annotation[]
}

export const A = 16 // half width of a cube's top diamond in SVG units

export const project = (x: number, y: number, z: number): [number, number] => [(x - y) * A, ((x + y) * A) / 2 - z * A]

// ── colour helpers ──────────────────────────────────────────────────────────
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
function mix(hex: string, target: [number, number, number], t: number) {
  const [r, g, b] = hexToRgb(hex)
  const m = (a: number, b2: number) => Math.round(a + (b2 - a) * t).toString(16).padStart(2, '0')
  // returns hex so mixed colours can be mixed again (e.g. a lighter leaf voxel)
  return `#${m(r, target[0])}${m(g, target[1])}${m(b, target[2])}`
}
export const lighten = (hex: string, t: number) => mix(hex, [255, 255, 255], t)
export const darken = (hex: string, t: number) => mix(hex, [6, 10, 30], t)

// ── builder ─────────────────────────────────────────────────────────────────
export class SceneBuilder {
  private map = new Map<string, Voxel>()
  annotations: Annotation[] = []

  add(x: number, y: number, z: number, color: string, opts: Partial<Voxel> = {}) {
    this.map.set(`${x},${y},${z}`, { x, y, z, color, ...opts })
    return this
  }

  box(x0: number, y0: number, z0: number, w: number, d: number, h: number, color: string, opts: Partial<Voxel> = {}) {
    for (let x = x0; x < x0 + w; x++)
      for (let y = y0; y < y0 + d; y++) for (let z = z0; z < z0 + h; z++) this.add(x, y, z, color, opts)
    return this
  }

  remove(x: number, y: number, z: number) {
    this.map.delete(`${x},${y},${z}`)
    return this
  }

  has(x: number, y: number, z: number) {
    return this.map.has(`${x},${y},${z}`)
  }

  get(x: number, y: number, z: number) {
    return this.map.get(`${x},${y},${z}`)
  }

  note(a: Annotation) {
    this.annotations.push(a)
    return this
  }

  /** A blocky character: legs, torso, head. */
  avatar(x: number, y: number, z: number, shirt: string, skin: string, facing: 'x' | 'y', pants = '#33407f') {
    this.add(x, y, z, pants)
    this.add(x, y, z + 1, shirt)
    this.add(x, y, z + 2, skin, { eyes: facing })
    return this
  }

  tree(x: number, y: number, z: number, leaves = '#25c39d', tall = false) {
    const trunk = '#6a4c7d'
    this.add(x, y, z, trunk)
    if (tall) this.add(x, y, z + 1, trunk)
    const t = z + (tall ? 2 : 1)
    this.box(x - 1, y - 1, t, 3, 3, 1, leaves)
    this.remove(x - 1, y - 1, t).remove(x + 1, y + 1, t)
    this.box(x, y, t + 1, 1, 1, 1, lighten(leaves, 0.12))
    return this
  }

  build(): Scene {
    return { voxels: [...this.map.values()], annotations: this.annotations }
  }
}

// ── faces ───────────────────────────────────────────────────────────────────
export interface Face {
  key: string
  points: string
  fill: string
  opacity?: number
  glow?: boolean
  eyes?: [number, number][]
}

const pts = (corners: [number, number, number][]) =>
  corners.map(([x, y, z]) => project(x, y, z).map((v) => v.toFixed(2)).join(',')).join(' ')

export function sceneToFaces(scene: Scene) {
  const solid = new Set(scene.voxels.filter((v) => (v.alpha ?? 1) >= 1).map((v) => `${v.x},${v.y},${v.z}`))
  const sorted = [...scene.voxels].sort((a, b) => a.x + a.y + a.z - (b.x + b.y + b.z) || a.z - b.z)
  const faces: Face[] = []
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity

  for (const v of sorted) {
    const { x, y, z } = v
    const id = `${x},${y},${z}`
    const opacity = v.alpha
    const left = !solid.has(`${x},${y + 1},${z}`)
    const right = !solid.has(`${x + 1},${y},${z}`)
    const top = !solid.has(`${x},${y},${z + 1}`)

    if (left)
      faces.push({
        key: id + 'l',
        points: pts([[x, y + 1, z + 1], [x + 1, y + 1, z + 1], [x + 1, y + 1, z], [x, y + 1, z]]),
        fill: v.glow ? lighten(v.color, 0.05) : darken(v.color, 0.22),
        opacity,
        glow: v.glow,
        eyes: v.eyes === 'y' ? eyePositions(x, y, z, 'y') : undefined,
      })
    if (right)
      faces.push({
        key: id + 'r',
        points: pts([[x + 1, y, z + 1], [x + 1, y + 1, z + 1], [x + 1, y + 1, z], [x + 1, y, z]]),
        fill: v.glow ? v.color : darken(v.color, 0.42),
        opacity,
        glow: v.glow,
        eyes: v.eyes === 'x' ? eyePositions(x, y, z, 'x') : undefined,
      })
    if (top)
      faces.push({
        key: id + 't',
        points: pts([[x, y, z + 1], [x + 1, y, z + 1], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]]),
        fill: v.glow ? lighten(v.color, 0.25) : lighten(v.color, 0.08),
        opacity,
        glow: v.glow,
      })

    for (const [cx, cy, cz] of [[x, y, z + 1], [x + 1, y + 1, z], [x + 1, y, z + 1], [x, y + 1, z + 1], [x + 1, y + 1, z + 1]] as const) {
      const [sx, sy] = project(cx, cy, cz)
      minX = Math.min(minX, sx)
      maxX = Math.max(maxX, sx)
      minY = Math.min(minY, sy)
      maxY = Math.max(maxY, sy)
    }
  }
  // include the left-most / bottom-most corners
  for (const v of scene.voxels) {
    const [sx] = project(v.x, v.y + 1, v.z)
    const [, sy] = project(v.x + 1, v.y + 1, v.z)
    minX = Math.min(minX, sx)
    maxY = Math.max(maxY, sy)
  }
  return { faces, bounds: { minX, minY, maxX, maxY } }
}

function eyePositions(x: number, y: number, z: number, facing: 'x' | 'y'): [number, number][] {
  // two points on the face, at 35% and 65% across, 55% up
  const at = (t: number): [number, number] =>
    facing === 'x' ? project(x + 1, y + t, z + 0.58) : project(x + t, y + 1, z + 0.58)
  return [at(0.32), at(0.68)]
}
