import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { slides, TOTAL_SLIDES } from '../content/slides'
import { openChannel, type PresenterMessage } from '../lib/channel'
import { isTypingTarget, shortcutKey } from '../lib/dom'
import { session } from '../lib/storage'
import { useTimer } from '../lib/timer'
import { enterFullscreen, useFullscreen } from '../lib/useFullscreen'
import { slideComponents } from '../slides'
import { PresentationContext, type PresentationApi, type SlideKeyHandler } from './context'
import { BlankScreen, HelpOverlay, NotesPanel, OverviewOverlay } from './Overlays'
import { Toolbar } from './Toolbar'

export const LAST_SLIDE_KEY = 'questlingua.lastSlide'

export const slidePath = (i: number) => (i === 0 ? '/' : `/slide/${i + 1}`)

export function PresentationPage() {
  const params = useParams()
  const navigate = useNavigate()
  const parsed = Number.parseInt(params.n ?? '1', 10)
  const index = Number.isFinite(parsed) ? Math.min(Math.max(parsed - 1, 0), TOTAL_SLIDES - 1) : 0

  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const [overview, setOverview] = useState(false)
  const [help, setHelp] = useState(false)
  const [notes, setNotes] = useState(false)
  const [blank, setBlank] = useState(false)
  const { isFullscreen, toggle: toggleFullscreen, supported: fsSupported } = useFullscreen()
  const timer = useTimer()

  const indexRef = useRef(index)
  indexRef.current = index
  const keyHandlers = useRef<SlideKeyHandler[]>([])

  useEffect(() => {
    document.documentElement.dataset.mode = 'present'
    session.set(LAST_SLIDE_KEY, String(index))
    document.title = `${slides[index].title} · QuestLingua`
  }, [index])

  // Normalise invalid URLs such as /slide/99
  useEffect(() => {
    if (params.n !== undefined && (String(index + 1) !== params.n || index === 0)) navigate(slidePath(index), { replace: true })
  }, [params.n, index, navigate])

  const go = useCallback(
    (i: number) => {
      const target = Math.min(Math.max(i, 0), TOTAL_SLIDES - 1)
      if (target === indexRef.current) return
      setDirection(target > indexRef.current ? 'next' : 'prev')
      // update immediately so rapid key presses / presenter clicks are not lost before re-render
      indexRef.current = target
      navigate(slidePath(target), { replace: true })
    },
    [navigate],
  )
  const next = useCallback(() => go(indexRef.current + 1), [go])
  const prev = useCallback(() => go(indexRef.current - 1), [go])

  const openExplore = useCallback(
    (section?: string) => {
      session.set(LAST_SLIDE_KEY, String(indexRef.current))
      navigate(section ? `/explore/${section}` : '/explore')
    },
    [navigate],
  )

  const openPresenterView = useCallback(() => {
    window.open('/presenter', 'questlingua-presenter', 'popup,width=980,height=640')
  }, [])

  const startPresentation = useCallback(() => {
    void enterFullscreen()
    if (!timer.hasStarted) timer.start()
    go(1)
  }, [go, timer])

  const registerKeys = useCallback((h: SlideKeyHandler) => {
    keyHandlers.current.push(h)
    return () => {
      keyHandlers.current = keyHandlers.current.filter((x) => x !== h)
    }
  }, [])

  // ── presenter view sync ─────────────────────────────────────────────────
  const channel = useRef<ReturnType<typeof openChannel> | null>(null)
  useEffect(() => {
    const ch = openChannel((m: PresenterMessage) => {
      if (m.type === 'go') go(m.index)
      else if (m.type === 'next') next()
      else if (m.type === 'prev') prev()
      else if (m.type === 'hello') ch.post({ type: 'state', index: indexRef.current })
    })
    channel.current = ch
    return () => ch.close()
  }, [go, next, prev])
  useEffect(() => {
    channel.current?.post({ type: 'state', index })
  }, [index])

  // ── keyboard ─────────────────────────────────────────────────────────────
  const anyOverlay = overview || help
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return
      if (isTypingTarget(e.target)) {
        if (e.key === 'Escape') (e.target as HTMLElement).blur()
        return
      }
      const handled = () => e.preventDefault()
      const k = shortcutKey(e)

      if (blank) {
        if (['b', '.', 'Escape', ' ', 'ArrowRight', 'ArrowLeft'].includes(k)) {
          setBlank(false)
          handled()
        }
        return
      }
      if (e.key === 'Escape') {
        if (help) setHelp(false)
        else if (overview) setOverview(false)
        else if (notes) setNotes(false)
        else {
          for (let i = keyHandlers.current.length - 1; i >= 0; i--) if (keyHandlers.current[i](e)) return handled()
        }
        return handled()
      }
      if (/^[0-9]$/.test(e.key)) {
        const n = e.key === '0' ? 9 : Number(e.key) - 1
        setOverview(false)
        setHelp(false)
        go(n)
        return handled()
      }
      if (k === 'o' || k === 'g') {
        setHelp(false)
        setOverview((v) => !v)
        return handled()
      }
      if (k === '?' || k === 'h') {
        setOverview(false)
        setHelp((v) => !v)
        return handled()
      }
      if (anyOverlay) return

      // slide-level handlers (e.g. an open mission card) get first refusal
      for (let i = keyHandlers.current.length - 1; i >= 0; i--) if (keyHandlers.current[i](e)) return handled()

      switch (k) {
        case 'ArrowRight':
        case 'PageDown':
          next()
          return handled()
        case ' ':
          if (e.shiftKey) prev()
          else next()
          return handled()
        case 'ArrowLeft':
        case 'PageUp':
          prev()
          return handled()
        case 'Home':
          go(0)
          return handled()
        case 'End':
          go(TOTAL_SLIDES - 1)
          return handled()
        case 'f':
          void toggleFullscreen()
          return handled()
        case 'e':
          openExplore()
          return handled()
        case 'n':
          setNotes((v) => !v)
          return handled()
        case 't':
          timer.toggle()
          return handled()
        case 'p':
          openPresenterView()
          return handled()
        case 'b':
        case '.':
          setBlank(true)
          return handled()
      }
    }
    // Space on a focused button would also "click" it on keyup — stop that.
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ' && !isTypingTarget(e.target) && e.target instanceof HTMLButtonElement) e.preventDefault()
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [anyOverlay, blank, help, overview, notes, go, next, prev, openExplore, openPresenterView, toggleFullscreen, timer])

  const api = useMemo<PresentationApi>(
    () => ({
      index,
      total: TOTAL_SLIDES,
      go,
      next,
      prev,
      startPresentation,
      openOverview: () => setOverview(true),
      openExplore,
      registerKeys,
    }),
    [index, go, next, prev, startPresentation, openExplore, registerKeys],
  )

  const Slide = slideComponents[slides[index].id]
  const progress = ((index + 1) / TOTAL_SLIDES) * 100

  return (
    <PresentationContext.Provider value={api}>
      <div className="flex h-dvh flex-col overflow-hidden">
        {/* progress */}
        <div className="no-print relative z-30 h-[3px] w-full shrink-0 bg-white/[0.04]" aria-hidden>
          <div
            className="h-full bg-gradient-to-r from-cyan-glow via-cyan-300 to-violet-glow shadow-[0_0_12px_rgb(94_231_255/0.7)] transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <main className="relative min-h-0 flex-1">
          <section
            key={index}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${TOTAL_SLIDES}: ${slides[index].title}`}
            className={`absolute inset-0 overflow-x-hidden overflow-y-auto scrollbar-thin ${direction === 'next' ? 'animate-slide-next' : 'animate-slide-prev'}`}
          >
            <Slide />
          </section>
        </main>

        <Toolbar
          index={index}
          onPrev={prev}
          onNext={next}
          onOverview={() => setOverview(true)}
          onExplore={() => openExplore()}
          onHelp={() => setHelp(true)}
          onNotes={() => setNotes((v) => !v)}
          notesOpen={notes}
          onFullscreen={() => void toggleFullscreen()}
          isFullscreen={isFullscreen}
          fullscreenSupported={fsSupported}
          onPresenterView={openPresenterView}
        />
      </div>

      {notes && <NotesPanel index={index} onClose={() => setNotes(false)} />}
      <OverviewOverlay
        open={overview}
        onClose={() => setOverview(false)}
        index={index}
        onGo={(i) => {
          setOverview(false)
          go(i)
        }}
        onExplore={() => {
          setOverview(false)
          openExplore()
        }}
      />
      <HelpOverlay open={help} onClose={() => setHelp(false)} />
      {blank && <BlankScreen onResume={() => setBlank(false)} />}
    </PresentationContext.Provider>
  )
}
