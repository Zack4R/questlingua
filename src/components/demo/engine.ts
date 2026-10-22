import {
  GRID,
  horizontalStreets,
  landmarks,
  verticalStreets,
  type Heading,
  type Landmark,
  type Scenario,
  type Segment,
} from '../../content/findYourWay'

export type Node = [number, number]
export type Command = 'straight' | 'left' | 'right'

const VEC: Record<Heading, [number, number]> = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] }
const ORDER: Heading[] = ['N', 'E', 'S', 'W']

export const turn = (h: Heading, dir: 'left' | 'right'): Heading =>
  ORDER[(ORDER.indexOf(h) + (dir === 'right' ? 1 : 3)) % 4]

export const vec = (h: Heading) => VEC[h]

export const sameNode = (a: Node, b: Node) => a[0] === b[0] && a[1] === b[1]

export const inGrid = ([i, j]: Node) => i >= 0 && j >= 0 && i < GRID.cols && j < GRID.rows

export function landmarkAtBlock(bx: number, by: number): Landmark | undefined {
  return landmarks.find((l) => l.bx === bx && l.by === by)
}

export const landmarkById = (id: string) => landmarks.find((l) => l.id === id)!

/** Landmark whose block centre is at (cx, cy) in node coordinates. */
function landmarkAtPoint(cx: number, cy: number) {
  return landmarkAtBlock(Math.floor(cx), Math.floor(cy))
}

export const streetFor = (node: Node, h: Heading) =>
  h === 'N' || h === 'S' ? verticalStreets[node[0]] : horizontalStreets[node[1]]

export function isClosed(closed: Segment[], a: Node, b: Node) {
  return closed.some(
    (s) => (sameNode(s.a, a) && sameNode(s.b, b)) || (sameNode(s.a, b) && sameNode(s.b, a)),
  )
}

export function step(node: Node, h: Heading): Node {
  const [dx, dy] = VEC[h]
  return [node[0] + dx, node[1] + dy]
}

/** Landmarks on the left and right of the street segment from `node` in direction `h`. */
export function sidesOfSegment(node: Node, h: Heading) {
  const [dx, dy] = VEC[h]
  const mx = node[0] + dx / 2
  const my = node[1] + dy / 2
  const [lx, ly] = [dy, -dx] // left normal in screen coordinates (y grows downwards)
  return {
    left: landmarkAtPoint(mx + lx / 2, my + ly / 2),
    right: landmarkAtPoint(mx - lx / 2, my - ly / 2),
  }
}

/** The corner block you turn around: behind-left for a left turn, behind-right for a right turn. */
export function cornerOfTurn(node: Node, h: Heading, dir: 'left' | 'right') {
  const [dx, dy] = VEC[h]
  const [lx, ly] = [dy, -dx]
  const side = dir === 'left' ? 1 : -1
  return landmarkAtPoint(node[0] + (side * lx) / 2 - dx / 2, node[1] + (side * ly) / 2 - dy / 2)
}

/** Is the landmark on the traveller's left or right? */
export function sideOf(node: Node, h: Heading, l: Landmark): 'left' | 'right' | 'ahead' {
  const [hx, hy] = VEC[h]
  const vx = l.bx + 0.5 - node[0]
  const vy = l.by + 0.5 - node[1]
  const cross = hx * vy - hy * vx
  if (Math.abs(cross) < 1e-6) return 'ahead'
  return cross > 0 ? 'right' : 'left'
}

/** A node touches the destination when it is one of the four corners of its block. */
export function touchesLandmark(node: Node, l: Landmark) {
  const [i, j] = node
  return (i === l.bx || i === l.bx + 1) && (j === l.by || j === l.by + 1)
}

// ── Command log & sentences ───────────────────────────────────────────────────

export type LogEntry =
  | { kind: 'straight'; from: Node; to: Node; heading: Heading }
  | { kind: 'turn'; dir: 'left' | 'right'; at: Node; before: Heading; after: Heading }
  | { kind: 'stop'; at: Node; heading: Heading }

const numberWords = ['zero', 'one', 'two', 'three', 'four', 'five']
const the = (l: Landmark) => `the ${l.name}`

function joinNames(names: string[]) {
  if (names.length <= 1) return names[0] ?? ''
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}

/** Turns the command log into the English instructions a Guide would say. */
export function buildSentences(log: LogEntry[], destination: Landmark): string[] {
  const out: string[] = []
  const mentioned = new Set<string>([destination.id])
  let i = 0
  while (i < log.length) {
    const entry = log[i]
    if (entry.kind === 'straight') {
      const run: Extract<LogEntry, { kind: 'straight' }>[] = []
      while (i < log.length && log[i].kind === 'straight') {
        run.push(log[i] as Extract<LogEntry, { kind: 'straight' }>)
        i++
      }
      const street = streetFor(run[0].from, run[0].heading)
      const passed: string[] = []
      for (const seg of run) {
        const { left, right } = sidesOfSegment(seg.from, seg.heading)
        const pick = [right, left].find((l) => l && !mentioned.has(l.id))
        if (pick) {
          mentioned.add(pick.id)
          passed.push(the(pick))
        }
      }
      const blocks = run.length === 1 ? '' : ` for ${numberWords[run.length] ?? run.length} blocks`
      const past = passed.length ? `, past ${joinNames(passed.slice(0, 2))}` : ''
      out.push(`Go straight along ${street}${blocks}${past}.`)
      continue
    }
    if (entry.kind === 'turn') {
      const corner = cornerOfTurn(entry.at, entry.before, entry.dir)
      const street = streetFor(entry.at, entry.after)
      const at = corner ? `At ${the(corner)}, turn` : 'Turn'
      out.push(`${at} ${entry.dir} onto ${street}.`)
      if (corner) mentioned.add(corner.id)
      i++
      continue
    }
    // stop
    const side = sideOf(entry.at, entry.heading, destination)
    out.push(
      touchesLandmark(entry.at, destination)
        ? `Stop here. ${capitalise(the(destination))} is ${side === 'ahead' ? 'in front of you' : `on your ${side}`}.`
        : 'Stop here.',
    )
    i++
  }
  return out
}

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

// ── Model route (breadth-first search over position + heading) ───────────────

export function modelRoute(scenario: Scenario): Command[] {
  const dest = landmarkById(scenario.toLandmark)
  type State = { node: Node; heading: Heading; path: Command[] }
  const key = (s: { node: Node; heading: Heading }) => `${s.node[0]},${s.node[1]},${s.heading}`
  const queue: State[] = [{ node: scenario.start.node, heading: scenario.start.heading, path: [] }]
  const seen = new Set([key(queue[0])])
  while (queue.length) {
    const cur = queue.shift()!
    if (touchesLandmark(cur.node, dest) && cur.path.length > 0) return cur.path
    const options: [Command, Node, Heading][] = []
    const next = step(cur.node, cur.heading)
    if (inGrid(next) && !isClosed(scenario.closed, cur.node, next)) options.push(['straight', next, cur.heading])
    for (const dir of ['left', 'right'] as const) {
      const h = turn(cur.heading, dir)
      if (inGrid(step(cur.node, h))) options.push([dir, cur.node, h])
    }
    for (const [cmd, node, heading] of options) {
      const k = key({ node, heading })
      if (seen.has(k)) continue
      seen.add(k)
      queue.push({ node, heading, path: [...cur.path, cmd] })
    }
  }
  return []
}
