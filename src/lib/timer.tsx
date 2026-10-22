import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { storage } from './storage'

// Presenter timer. Stored in localStorage so the presenter window and the
// projected window show the same time. The ticking value lives in its own
// context so that only the clock re-renders every half second, not the slides.

export interface TimerState {
  running: boolean
  /** epoch ms when the current run started (only when running) */
  startedAt: number | null
  /** ms accumulated before the current run */
  accumulated: number
  targetMinutes: number
}

const KEY = 'questlingua.timer.v1'
export const TARGET_OPTIONS = [5, 6, 7, 8] as const

const initial: TimerState = { running: false, startedAt: null, accumulated: 0, targetMinutes: 7 }

function read(): TimerState {
  try {
    const raw = storage.get(KEY)
    if (!raw) return initial
    const v = JSON.parse(raw) as TimerState
    if (typeof v.accumulated !== 'number' || typeof v.targetMinutes !== 'number') return initial
    return v
  } catch {
    return initial
  }
}

interface TimerApi {
  state: TimerState
  hasStarted: boolean
  start: () => void
  pause: () => void
  toggle: () => void
  reset: () => void
  setTarget: (m: number) => void
}

const TimerContext = createContext<TimerApi | null>(null)
const ElapsedContext = createContext(0)

const elapsedOf = (s: TimerState, now: number) => s.accumulated + (s.running && s.startedAt ? Math.max(0, now - s.startedAt) : 0)

export function TimerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TimerState>(read)
  const [now, setNow] = useState(() => Date.now())

  const commit = useCallback((next: TimerState) => {
    storage.set(KEY, JSON.stringify(next))
    setState(next)
  }, [])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setState(read())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    if (!state.running) return
    const id = window.setInterval(() => setNow(Date.now()), 500)
    return () => window.clearInterval(id)
  }, [state.running])

  const api = useMemo<TimerApi>(() => {
    const start = () => {
      if (state.running) return
      setNow(Date.now())
      commit({ ...state, running: true, startedAt: Date.now() })
    }
    const pause = () => {
      if (!state.running) return
      commit({ ...state, running: false, startedAt: null, accumulated: elapsedOf(state, Date.now()) })
    }
    return {
      state,
      hasStarted: state.running || state.accumulated > 0,
      start,
      pause,
      toggle: () => (state.running ? pause() : start()),
      reset: () => commit({ ...initial, targetMinutes: state.targetMinutes }),
      setTarget: (m: number) => commit({ ...state, targetMinutes: m }),
    }
  }, [state, commit])

  return (
    <TimerContext.Provider value={api}>
      <ElapsedContext.Provider value={elapsedOf(state, now)}>{children}</ElapsedContext.Provider>
    </TimerContext.Provider>
  )
}

/** Timer state and controls (re-renders only when started, paused, reset or retargeted). */
export function useTimer() {
  const ctx = useContext(TimerContext)
  if (!ctx) throw new Error('useTimer must be used inside TimerProvider')
  return ctx
}

/** Elapsed milliseconds (re-renders twice per second while running). */
export function useElapsed() {
  return useContext(ElapsedContext)
}
