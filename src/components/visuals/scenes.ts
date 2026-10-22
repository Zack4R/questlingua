import { darken, lighten, SceneBuilder, type Scene } from './iso'

// Original voxel scenes — an exploration-and-collaboration game world.

const C = {
  grass: '#1f9e8f',
  grassAlt: '#1b8f86',
  path: '#aeb9e6',
  rock: '#2c3577',
  rockDeep: '#1d2458',
  wall: '#dfe5ff',
  wallAlt: '#c3ccf3',
  roof: '#7c6cf0',
  window: '#5ee7ff',
  door: '#1c2550',
  water: '#1aa6cc',
  crystal: '#8bf0ff',
  crystalViolet: '#b9adff',
}

const skins = ['#f1c27d', '#c68642', '#e0ac69', '#8d5524']

/** Floating island: grassy top, tapering rock underside, hanging crystals. */
function island(b: SceneBuilder, cx: number, cy: number, r: number, depth: number, opts: { crystals?: boolean } = {}) {
  const inside = (dx: number, dy: number, rad: number) => Math.abs(dx) ** 2.4 + Math.abs(dy) ** 2.4 <= rad ** 2.4
  const R = Math.ceil(r)
  for (let x = cx - R; x <= cx + R; x++)
    for (let y = cy - R; y <= cy + R; y++) {
      const dx = x - cx
      const dy = y - cy
      if (!inside(dx, dy, r)) continue
      b.add(x, y, 0, (x * 7 + y * 13) % 5 === 0 ? C.grassAlt : C.grass)
      for (let k = 1; k <= depth; k++) {
        const rk = r - k * (r / (depth + 0.6))
        if (rk > 0.4 && inside(dx, dy, rk)) b.add(x, y, -k, k > depth / 2 ? C.rockDeep : C.rock)
      }
    }
  if (opts.crystals) {
    b.add(cx, cy, -depth - 1, C.crystal, { glow: true })
    b.add(cx + 1, cy - 1, -depth, C.crystalViolet, { glow: true })
  }
}

function house(b: SceneBuilder, x: number, y: number, w: number, d: number, h: number) {
  b.box(x, y, 1, w, d, h, C.wall)
  // windows on the two visible faces
  for (let z = 2; z <= h; z += 2) {
    for (let yy = y; yy < y + d; yy += 2) b.add(x + w - 1, yy, z, C.window, { glow: true })
    for (let xx = x; xx < x + w; xx += 2) b.add(xx, y + d - 1, z, C.window, { glow: true })
  }
  b.add(x + w - 1, y + Math.floor(d / 2), 1, C.door)
  b.box(x, y, h + 1, w, d, 1, C.roof)
  b.box(x + 1, y + 1, h + 2, Math.max(1, w - 2), Math.max(1, d - 2), 1, lighten(C.roof, 0.15))
}

function portal(b: SceneBuilder, x: number, y: number, z: number, span: number, h: number) {
  const stone = '#9aa6dc'
  for (let k = 0; k < h; k++) {
    b.add(x, y, z + k, stone)
    b.add(x, y + span + 1, z + k, stone)
  }
  for (let yy = y; yy <= y + span + 1; yy++) b.add(x, yy, z + h, lighten(stone, 0.1))
  for (let yy = y + 1; yy <= y + span; yy++)
    for (let k = 0; k < h; k++) b.add(x, yy, z + k, k % 2 ? C.crystalViolet : C.crystal, { glow: true, alpha: 0.42 })
}

export function titleWorld(): Scene {
  const b = new SceneBuilder()
  island(b, 7, 7, 7.3, 5, { crystals: true })

  // paths
  for (let i = 1; i <= 13; i++) {
    if (b.has(i, 7, 0)) b.add(i, 7, 0, C.path)
    if (b.has(7, i, 0)) b.add(7, i, 0, C.path)
  }
  // pond
  for (const [x, y] of [[10, 3], [11, 3], [10, 4], [11, 4], [12, 4]]) b.add(x, y, 0, C.water, { glow: false })

  house(b, 2, 2, 3, 3, 3)
  portal(b, 2, 9, 1, 2, 4)

  b.tree(13, 11, 1, '#25c39d', true)
  b.tree(4, 12, 1, '#2fd1a8')
  b.tree(9, 13, 1, '#22b893')
  b.tree(12, 6, 1, '#2fd1a8')

  // tower with a beacon
  b.box(9, 1, 1, 1, 1, 4, C.wallAlt)
  b.add(9, 1, 5, C.crystal, { glow: true })

  // the team — players spread out so their speech bubbles never overlap
  b.avatar(6, 9, 1, '#22c3e6', skins[0], 'x')
  b.avatar(9, 6, 1, '#8b7ff0', skins[1], 'y')
  b.avatar(10, 10, 1, '#f2b84b', skins[2], 'x')
  b.avatar(12, 8, 1, '#f07ca0', skins[3], 'y')

  b.note({ x: 6.5, y: 9.5, z: 4.2, text: 'Hi! I’m Alex.', kind: 'bubble', tone: 'cyan', delay: 0 })
  b.note({ x: 9.5, y: 6.5, z: 4.2, text: 'Turn left!', kind: 'bubble', tone: 'violet', delay: 0.35 })
  b.note({ x: 10.5, y: 10.5, z: 4.2, text: 'Let’s team up!', kind: 'bubble', tone: 'mint', delay: 0.7 })
  b.note({ x: 3.5, y: 3.5, z: 7.6, text: '!', kind: 'marker' })
  return b.build()
}

export function miniIsland(variant: 'crystal' | 'tree' | 'chest'): Scene {
  const b = new SceneBuilder()
  island(b, 2, 2, 2.2, 3)
  if (variant === 'crystal') {
    b.add(2, 2, 1, C.crystal, { glow: true }).add(2, 2, 2, C.crystalViolet, { glow: true })
  } else if (variant === 'tree') {
    b.tree(2, 2, 1, '#2fd1a8', true)
  } else {
    b.box(2, 2, 1, 1, 1, 1, '#b7791f').add(2, 2, 2, '#f2b84b', { glow: true })
  }
  return b.build()
}

export function questionsWorld(): Scene {
  const b = new SceneBuilder()
  island(b, 5, 5, 5.2, 4, { crystals: true })
  for (let i = 1; i <= 9; i++) if (b.has(5, i, 0)) b.add(5, i, 0, C.path)
  portal(b, 1, 3, 1, 2, 4)
  b.tree(8, 2, 1, '#25c39d', true)
  b.tree(8, 8, 1, '#2fd1a8')
  b.avatar(6, 5, 1, '#22c3e6', skins[0], 'x')
  b.avatar(8, 6, 1, '#8b7ff0', skins[1], 'y')
  b.avatar(4, 8, 1, '#f2b84b', skins[2], 'x')
  b.note({ x: 8.5, y: 6.5, z: 4.3, text: 'Questions?', kind: 'bubble', tone: 'cyan', delay: 0 })
  b.note({ x: 4.5, y: 8.5, z: 4.2, text: 'Thank you!', kind: 'bubble', tone: 'violet', delay: 0.4 })
  b.note({ x: 1.5, y: 5, z: 7.4, text: '?', kind: 'marker' })
  return b.build()
}

/** Two cliffs and a bridge of coloured blocks: from knowing English to speaking it. */
export const bridgeColors = ['#22c3e6', '#8b7ff0', '#2dd4bf', '#f2b84b'] as const

export function gapBridge(): Scene {
  const b = new SceneBuilder()
  const cliff = (x0: number) => {
    for (let z = -1; z <= 3; z++) b.box(x0, 0, z, 3, 3, 1, z === 3 ? C.grass : z > 0 ? C.rock : C.rockDeep)
  }
  cliff(0)
  cliff(11)
  // bridge: four pairs of coloured blocks
  bridgeColors.forEach((color, i) => {
    for (const dx of [0, 1]) for (let y = 0; y < 3; y++) b.add(3 + i * 2 + dx, y, 3, y === 1 ? color : darken(color, 0.15))
  })
  // learner on the left cliff, flag on the right
  b.avatar(1, 1, 4, '#22c3e6', skins[0], 'x')
  b.box(12, 1, 4, 1, 1, 4, '#c3ccf3')
  b.add(12, 2, 7, '#f2b84b').add(12, 3, 7, '#f2b84b').add(12, 2, 6, '#f2b84b')
  return b.build()
}
