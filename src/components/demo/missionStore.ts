import { useSyncExternalStore } from 'react'
import { scenarios, type Heading, type Scenario } from '../../content/findYourWay'
import {
  inGrid,
  isClosed,
  landmarkById,
  sidesOfSegment,
  sideOf,
  step as stepNode,
  streetFor,
  touchesLandmark,
  turn,
  type Command,
  type LogEntry,
  type Node,
} from './engine'

// The demo keeps its state in a small module-level store so that leaving the
// slide (e.g. to answer a question) and coming back does not lose progress.

export const STEPS = ['Briefing', 'Vocabulary', 'Guide', 'Questions', 'Dialogue', 'Reflection'] as const

export interface Reply {
  text: string
  tone: 'info' | 'warn' | 'success'
}

export interface MissionState {
  scenarioId: string
  step: number
  log: LogEntry[]
  reply: Reply | null
  showModel: boolean
  autoplay: boolean
  startedAt: number | null
  completedAt: number | null
  revealed: number[]
  dialogueShown: number
  ratings: (number | null)[]
  usefulPhrase: string | null
  note: string
  highlight: string | null
}

const fresh = (scenarioId = scenarios[0].id): MissionState => ({
  scenarioId,
  step: 0,
  log: [],
  reply: null,
  showModel: false,
  autoplay: false,
  startedAt: null,
  completedAt: null,
  revealed: [],
  dialogueShown: 1,
  ratings: [null, null, null],
  usefulPhrase: null,
  note: '',
  highlight: null,
})

let state: MissionState = fresh()
const listeners = new Set<() => void>()
const set = (patch: Partial<MissionState> | ((s: MissionState) => Partial<MissionState>)) => {
  state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) }
  listeners.forEach((l) => l())
}

export function useMission() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => state,
  )
}

export const scenarioOf = (s: MissionState): Scenario => scenarios.find((x) => x.id === s.scenarioId) ?? scenarios[0]

/** Position, heading and trail are derived by replaying the command log. */
export function derive(s: MissionState) {
  const scenario = scenarioOf(s)
  let node: Node = scenario.start.node
  let heading: Heading = scenario.start.heading
  const trail: Node[] = [node]
  let completed = false
  for (const e of s.log) {
    if (e.kind === 'straight') {
      node = e.to
      trail.push(node)
    } else if (e.kind === 'turn') heading = e.after
    else completed = true
  }
  const destination = landmarkById(scenario.toLandmark)
  return { scenario, node, heading, trail, completed, destination, arrived: touchesLandmark(node, destination) }
}

const name = (id: string) => landmarkById(id).name

export const mission = {
  start() {
    set((s) => ({ step: Math.max(s.step, 1), startedAt: s.startedAt ?? Date.now() }))
  },
  goStep(step: number) {
    set((s) => ({ step: Math.min(Math.max(step, 0), STEPS.length - 1), startedAt: s.startedAt ?? (step > 0 ? Date.now() : null) }))
  },
  setScenario(id: string) {
    set((s) => ({ ...fresh(id), step: s.step, startedAt: s.startedAt }))
  },
  highlight(id: string | null) {
    set({ highlight: id })
  },
  command(cmd: Command | 'stop') {
    const d = derive(state)
    if (d.completed) return
    const dest = d.destination
    if (cmd === 'stop') {
      if (d.arrived) {
        const side = sideOf(d.node, d.heading, dest)
        set((s) => ({
          log: [...s.log, { kind: 'stop', at: d.node, heading: d.heading }],
          reply: {
            text: `I’m here! The ${dest.name.toLowerCase()} is ${side === 'ahead' ? 'in front of me' : `on my ${side}`}. Thank you!`,
            tone: 'success',
          },
          completedAt: Date.now(),
          autoplay: false,
        }))
      } else set({ reply: { text: `Hmm, I can’t see the ${dest.name.toLowerCase()} here. Where should I go next?`, tone: 'warn' } })
      return
    }
    if (cmd === 'straight') {
      const next = stepNode(d.node, d.heading)
      if (!inGrid(next)) return set({ reply: { text: 'There’s no road ahead — it’s the edge of the city. Which way should I turn?', tone: 'warn' } })
      if (isClosed(d.scenario.closed, d.node, next))
        return set({ reply: { text: 'Sorry, I can’t go that way — the road is closed! Can you find another way?', tone: 'warn' } })
      const { left, right } = sidesOfSegment(d.node, d.heading)
      const passing = right ?? left
      const reached = touchesLandmark(next, dest)
      set((s) => ({
        log: [...s.log, { kind: 'straight', from: d.node, to: next, heading: d.heading }],
        reply: reached
          ? { text: `I think I can see the ${dest.name.toLowerCase()}! Should I stop here?`, tone: 'info' }
          : {
              text: `OK, going straight along ${streetFor(d.node, d.heading)}${passing ? ` — I’m passing the ${passing.name.toLowerCase()}` : ''}.`,
              tone: 'info',
            },
      }))
      return
    }
    const after = turn(d.heading, cmd)
    if (!inGrid(stepNode(d.node, after))) return set({ reply: { text: `There’s no street on the ${cmd} here.`, tone: 'warn' } })
    set((s) => ({
      log: [...s.log, { kind: 'turn', dir: cmd, at: d.node, before: d.heading, after }],
      reply: { text: `Turning ${cmd} onto ${streetFor(d.node, after)}.`, tone: 'info' },
    }))
  },
  undo() {
    set((s) => ({ log: s.log.slice(0, -1), reply: null, completedAt: null, autoplay: false }))
  },
  resetRoute() {
    set({ log: [], reply: null, completedAt: null, autoplay: false })
  },
  toggleModel() {
    set((s) => ({ showModel: !s.showModel }))
  },
  playModel() {
    set({ log: [], reply: { text: 'Watch the model route…', tone: 'info' }, completedAt: null, autoplay: true, showModel: true })
  },
  stopAutoplay() {
    set({ autoplay: false })
  },
  reveal(i: number) {
    set((s) => ({ revealed: s.revealed.includes(i) ? s.revealed.filter((x) => x !== i) : [...s.revealed, i] }))
  },
  revealAll(n: number) {
    set({ revealed: Array.from({ length: n }, (_, i) => i) })
  },
  showLines(n: number) {
    set({ dialogueShown: n })
  },
  rate(i: number, v: number) {
    set((s) => ({ ratings: s.ratings.map((r, j) => (j === i ? v : r)) }))
  },
  pickPhrase(p: string | null) {
    set({ usefulPhrase: p })
  },
  setNote(note: string) {
    set({ note })
  },
  restart() {
    state = fresh(state.scenarioId)
    listeners.forEach((l) => l())
  },
}

export const destinationName = (s: MissionState) => name(scenarioOf(s).toLandmark)
