import { createContext, useContext, useEffect, useRef } from 'react'

export type SlideKeyHandler = (e: KeyboardEvent) => boolean | void

export interface PresentationApi {
  index: number
  total: number
  go: (i: number) => void
  next: () => void
  prev: () => void
  startPresentation: () => void
  openOverview: () => void
  openExplore: (section?: string) => void
  /** Slides can claim keys (e.g. arrows inside an open mission card). Return true to consume. */
  registerKeys: (handler: SlideKeyHandler) => () => void
}

export const PresentationContext = createContext<PresentationApi | null>(null)

export function usePresentation() {
  const ctx = useContext(PresentationContext)
  if (!ctx) throw new Error('usePresentation must be used inside the presentation')
  return ctx
}

/** Optional variant for components that also render outside the presentation (Explore Mode). */
export function useOptionalPresentation() {
  return useContext(PresentationContext)
}

export function useSlideKeys(handler: SlideKeyHandler, active = true) {
  const ctx = useOptionalPresentation()
  const ref = useRef(handler)
  ref.current = handler
  useEffect(() => {
    if (!ctx || !active) return
    return ctx.registerKeys((e) => ref.current(e))
  }, [ctx, active])
}
