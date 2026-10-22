import { memo, useMemo } from 'react'
import {
  Banknote,
  Bus,
  Clapperboard,
  Coffee,
  Dumbbell,
  Hospital,
  Landmark as LandmarkIcon,
  Library,
  Mail,
  School,
  ShoppingCart,
  Trees,
  type LucideIcon,
} from 'lucide-react'
import {
  GRID,
  horizontalStreets,
  landmarks,
  verticalStreets,
  type Heading,
  type Landmark,
  type LandmarkIcon as IconName,
  type Scenario,
} from '../../content/findYourWay'
import { landmarkById, step, turn, type Command, type Node } from './engine'

const icons: Record<IconName, LucideIcon> = {
  school: School,
  library: Library,
  cafe: Coffee,
  hospital: Hospital,
  park: Trees,
  supermarket: ShoppingCart,
  museum: LandmarkIcon,
  cinema: Clapperboard,
  bus: Bus,
  bank: Banknote,
  post: Mail,
  sports: Dumbbell,
}

// visible area: the street grid plus room for the START label
const VB = { x: 46, y: 34, w: 908, h: 650 }
const STREET = 44
const X = (i: number) => 90 + i * 205
const Y = (j: number) => 75 + j * 183
const pt = ([i, j]: Node) => [X(i), Y(j)] as const

const headingAngle: Record<Heading, number> = { N: 0, E: 90, S: 180, W: 270 }

/** Nodes visited when the model route is followed (for the dashed hint line). */
function simulate(scenario: Scenario, cmds: Command[]) {
  let node: Node = scenario.start.node
  let h = scenario.start.heading
  const nodes: Node[] = [node]
  for (const c of cmds) {
    if (c === 'straight') {
      node = step(node, h)
      nodes.push(node)
    } else h = turn(h, c)
  }
  return nodes
}

const Blocks = memo(function Blocks({ highlight, destination }: { highlight: string | null; destination: string }) {
  return (
    <g>
      {landmarks.map((l) => (
        <Block key={l.id} l={l} highlighted={highlight === l.id} isDestination={destination === l.id} />
      ))}
    </g>
  )
})

function Block({ l, highlighted, isDestination }: { l: Landmark; highlighted: boolean; isDestination: boolean }) {
  const x0 = X(l.bx) + STREET / 2 + 9
  const y0 = Y(l.by) + STREET / 2 + 9
  const w = 205 - STREET - 18
  const h = 183 - STREET - 18
  const Icon = icons[l.icon]
  const isPark = l.icon === 'park'
  return (
    <g>
      {isDestination && (
        <rect x={x0 - 8} y={y0 - 8} width={w + 16} height={h + 16} rx={22} fill="none" stroke={l.color} strokeWidth={3} opacity={0.9}>
          <animate attributeName="opacity" values="0.95;0.25;0.95" dur="2.2s" repeatCount="indefinite" />
        </rect>
      )}
      <rect
        x={x0}
        y={y0}
        width={w}
        height={h}
        rx={16}
        fill={isPark ? '#0f3b3a' : '#121f45'}
        stroke={highlighted || isDestination ? l.color : 'rgb(148 163 255 / 0.22)'}
        strokeWidth={highlighted ? 3 : 1.5}
      />
      {/* little buildings / trees for texture */}
      {isPark ? (
        [[0.2, 0.7], [0.8, 0.72], [0.15, 0.3], [0.86, 0.3]].map(([fx, fy], i) => (
          <circle key={i} cx={x0 + w * fx} cy={y0 + h * fy} r={9} fill="#1f9e8f" opacity={0.7} />
        ))
      ) : (
        <>
          <rect x={x0 + 10} y={y0 + h - 26} width={22} height={16} rx={3} fill={l.color} opacity={0.14} />
          <rect x={x0 + w - 32} y={y0 + h - 30} width={22} height={20} rx={3} fill={l.color} opacity={0.14} />
          <rect x={x0 + w - 32} y={y0 + 10} width={22} height={14} rx={3} fill={l.color} opacity={0.1} />
        </>
      )}
      <rect x={x0 + w / 2 - 25} y={y0 + 16} width={50} height={50} rx={14} fill={l.color} opacity={highlighted ? 0.35 : 0.16} />
      <Icon x={x0 + w / 2 - 15} y={y0 + 26} width={30} height={30} color={l.color} strokeWidth={2} aria-hidden />
      <text
        x={x0 + w / 2}
        y={y0 + h - 22}
        textAnchor="middle"
        fontSize={19}
        fontWeight={600}
        fill="#eef2ff"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {l.name}
      </text>
    </g>
  )
}

const Streets = memo(function Streets() {
  const left = X(0) - STREET / 2
  const right = X(GRID.cols - 1) + STREET / 2
  const top = Y(0) - STREET / 2
  const bottom = Y(GRID.rows - 1) + STREET / 2
  return (
    <g>
      {horizontalStreets.map((name, j) => (
        <g key={name}>
          <rect x={left} y={Y(j) - STREET / 2} width={right - left} height={STREET} fill="#1b2a58" />
          <line x1={left + 10} x2={right - 10} y1={Y(j)} y2={Y(j)} stroke="#4b5fa6" strokeWidth={2} strokeDasharray="12 14" />
        </g>
      ))}
      {verticalStreets.map((name, i) => (
        <g key={name}>
          <rect x={X(i) - STREET / 2} y={top} width={STREET} height={bottom - top} fill="#1b2a58" />
          <line y1={top + 10} y2={bottom - 10} x1={X(i)} x2={X(i)} stroke="#4b5fa6" strokeWidth={2} strokeDasharray="12 14" />
        </g>
      ))}
      {/* crossings drawn on top so the dashes stop at junctions */}
      {verticalStreets.map((_, i) =>
        horizontalStreets.map((__, j) => (
          <rect key={`${i}-${j}`} x={X(i) - STREET / 2} y={Y(j) - STREET / 2} width={STREET} height={STREET} fill="#1d2d5e" />
        )),
      )}
      {/* street names */}
      {horizontalStreets.map((name, j) => (
        <text key={name} x={(X(0) + X(1)) / 2} y={Y(j) + 6} textAnchor="middle" fontSize={14} fontWeight={600} fill="#9fb0e8" letterSpacing={1}>
          {name.toUpperCase()}
        </text>
      ))}
      {verticalStreets.map((name, i) => (
        <text
          key={name}
          x={X(i) + 5}
          y={(Y(2) + Y(3)) / 2}
          textAnchor="middle"
          fontSize={14}
          fontWeight={600}
          fill="#9fb0e8"
          letterSpacing={1}
          transform={`rotate(-90 ${X(i) + 5} ${(Y(2) + Y(3)) / 2})`}
        >
          {name.toUpperCase()}
        </text>
      ))}
    </g>
  )
})

export function CityMap({
  scenario,
  node,
  heading,
  trail,
  modelPath,
  highlight,
  completed,
}: {
  scenario: Scenario
  node: Node
  heading: Heading
  trail: Node[]
  modelPath: Command[] | null
  highlight: string | null
  completed: boolean
}) {
  const destination = landmarkById(scenario.toLandmark)
  const startLandmark = landmarkById(scenario.fromLandmark)
  const modelNodes = useMemo(() => (modelPath ? simulate(scenario, modelPath) : null), [scenario, modelPath])
  const [tx, ty] = pt(node)
  const [sx, sy] = pt(scenario.start.node)

  return (
    <svg
      viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
      className="block h-auto max-h-full w-full select-none"
      role="img"
      aria-label={`City map. Start: ${startLandmark.name}. Destination: ${destination.name}.`}
    >
      <defs>
        <pattern id="hatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="12" height="12" fill="#3a1f2b" />
          <rect width="6" height="12" fill="#f59e0b" opacity="0.85" />
        </pattern>
        <filter id="trailGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x={VB.x} y={VB.y} width={VB.w} height={VB.h} rx={24} fill="#0a1430" stroke="rgb(148 163 255 / 0.14)" />
      <Streets />
      <Blocks highlight={highlight} destination={destination.id} />

      {/* closed roads */}
      {scenario.closed.map((s, i) => {
        const [ax, ay] = pt(s.a)
        const [bx, by] = pt(s.b)
        const horizontal = ay === by
        const cx = (ax + bx) / 2
        const cy = (ay + by) / 2
        const len = 140
        return (
          <g key={i}>
            <rect
              x={horizontal ? cx - len / 2 : cx - STREET / 2 + 4}
              y={horizontal ? cy - STREET / 2 + 4 : cy - len / 2}
              width={horizontal ? len : STREET - 8}
              height={horizontal ? STREET - 8 : len}
              rx={6}
              fill="url(#hatch)"
              stroke="#fbbf24"
              strokeWidth={2}
            />
            <g transform={`translate(${cx} ${cy})${horizontal ? '' : ' rotate(-90)'}`}>
              <rect x={-56} y={-12} width={112} height={24} rx={12} fill="#1a1020" stroke="#fbbf24" strokeWidth={1.5} />
              <text y={4.5} textAnchor="middle" fontSize={12.5} fontWeight={700} fill="#fde68a" letterSpacing={1.5}>
                ROAD CLOSED
              </text>
            </g>
          </g>
        )
      })}

      {/* model route (hint) */}
      {modelNodes && modelNodes.length > 1 && (
        <polyline
          points={modelNodes.map((n) => pt(n).join(',')).join(' ')}
          fill="none"
          stroke="#a297ff"
          strokeWidth={5}
          strokeDasharray="4 14"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.9}
        />
      )}

      {/* travelled route */}
      {trail.length > 1 && (
        <polyline
          points={trail.map((n) => pt(n).join(',')).join(' ')}
          fill="none"
          stroke="#5ee7ff"
          strokeWidth={7}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#trailGlow)"
          opacity={0.95}
        />
      )}

      {/* start */}
      <g transform={`translate(${sx} ${sy})`}>
        <circle r={14} fill="#0a1430" stroke="#5eead4" strokeWidth={3} />
        <circle r={5} fill="#5eead4" />
        <g transform="translate(0 30)">
          <rect x={-34} y={-12} width={68} height={24} rx={12} fill="#5eead4" />
          <text y={5} textAnchor="middle" fontSize={13} fontWeight={800} fill="#062a2a" letterSpacing={1.5}>
            START
          </text>
        </g>
      </g>

      {/* explorer */}
      <g className="map-traveller" style={{ transform: `translate(${tx}px, ${ty}px)` }}>
        <circle r={30} fill="#5ee7ff" opacity={0.18}>
          <animate attributeName="r" values="24;34;24" dur="2s" repeatCount="indefinite" />
        </circle>
        <g style={{ transform: `rotate(${headingAngle[heading]}deg)`, transition: 'transform 0.4s ease' }}>
          <path d="M0 -38 L11 -22 L-11 -22 Z" fill="#5ee7ff" />
        </g>
        <circle r={19} fill={completed ? '#5eead4' : '#0e1938'} stroke="#5ee7ff" strokeWidth={3} />
        {/* blocky head */}
        <rect x={-9} y={-10} width={18} height={18} rx={3} fill="#f1c27d" />
        <rect x={-5.5} y={-5} width={3} height={5} rx={1} fill="#0b1026" />
        <rect x={2.5} y={-5} width={3} height={5} rx={1} fill="#0b1026" />
        <rect x={-9} y={8} width={18} height={6} rx={2} fill="#8b7ff0" />
      </g>
    </svg>
  )
}
