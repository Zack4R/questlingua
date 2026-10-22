import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  CircleQuestionMark,
  Compass,
  LayoutGrid,
  Maximize,
  Minimize,
  MonitorUp,
  NotebookPen,
  Pause,
  Play,
  RotateCcw,
  Timer,
} from 'lucide-react'
import { slides, TOTAL_SLIDES, plannedSeconds } from '../content/slides'
import { cn, formatClock, pad2 } from '../lib/dom'
import { TARGET_OPTIONS, useElapsed, useTimer } from '../lib/timer'

interface ToolbarProps {
  index: number
  onPrev: () => void
  onNext: () => void
  onOverview: () => void
  onExplore: () => void
  onHelp: () => void
  onNotes: () => void
  notesOpen: boolean
  onFullscreen: () => void
  isFullscreen: boolean
  fullscreenSupported: boolean
  onPresenterView: () => void
}

function ToolButton({
  label,
  shortcut,
  onClick,
  active,
  children,
  className,
}: {
  label: string
  shortcut?: string
  onClick: () => void
  active?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={shortcut ? `${label} (${shortcut})` : label}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        'grid size-[2.5rem] cursor-pointer place-items-center rounded-xl text-muted transition hover:bg-white/[0.08] hover:text-ink lg:size-[2.4rem]',
        active && 'bg-cyan-glow/12 text-cyan-glow',
        className,
      )}
    >
      {children}
    </button>
  )
}

/** Pace status: compares elapsed time with the planned end of the current slide. */
export function usePace(index: number) {
  const { state } = useTimer()
  const elapsed = useElapsed()
  const scale = (state.targetMinutes * 60) / plannedSeconds
  const plannedEnd = slides.slice(0, index + 1).reduce((s, x) => s + x.seconds, 0) * scale * 1000
  const target = state.targetMinutes * 60 * 1000
  const status: 'idle' | 'ok' | 'behind' | 'over' =
    elapsed === 0 && !state.running ? 'idle' : elapsed > target ? 'over' : elapsed > plannedEnd + 15000 ? 'behind' : 'ok'
  return { elapsed, target, status, scale }
}

function TimerControl({ index, onPresenterView }: { index: number; onPresenterView: () => void }) {
  const timer = useTimer()
  const { elapsed, target, status } = usePace(index)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('mousedown', close)
    return () => window.removeEventListener('mousedown', close)
  }, [open])

  const dot = { idle: 'bg-dim', ok: 'bg-mint-glow', behind: 'bg-amber-glow', over: 'bg-rose-glow' }[status]

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title="Presenter timer (T to start / pause)"
        aria-expanded={open}
        className="flex h-[2.4rem] cursor-pointer items-center gap-2 rounded-xl px-3 text-muted tabular-nums transition hover:bg-white/[0.08] hover:text-ink"
      >
        <span className={cn('size-2 rounded-full', dot, timer.state.running && 'animate-pulse')} />
        <Timer className="size-4" />
        <span className="text-[0.9rem]">
          {formatClock(elapsed)} <span className="text-dim">/ {timer.state.targetMinutes}:00</span>
        </span>
      </button>
      {open && (
        <div className="panel absolute right-0 bottom-[calc(100%+0.6rem)] z-40 w-[17rem] animate-pop p-4">
          <p className="text-[0.75rem] font-semibold tracking-widest text-dim uppercase">Target length</p>
          <div className="mt-2 grid grid-cols-4 gap-1.5">
            {TARGET_OPTIONS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => timer.setTarget(m)}
                className={cn(
                  'cursor-pointer rounded-lg border py-1.5 text-[0.9rem] transition',
                  timer.state.targetMinutes === m
                    ? 'border-cyan-glow/60 bg-cyan-glow/15 text-cyan-100'
                    : 'border-line text-muted hover:text-ink',
                )}
              >
                {m} min
              </button>
            ))}
          </div>
          <p className="mt-3 text-[0.8rem] leading-snug text-dim">
            {status === 'idle' && 'Timer not started.'}
            {status === 'ok' && 'On pace for the target length.'}
            {status === 'behind' && 'Behind the plan — consider moving on.'}
            {status === 'over' && `Over the ${formatClock(target)} target.`}
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={timer.toggle}
              className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-white/[0.08] py-2 text-[0.9rem] hover:bg-white/[0.14]"
            >
              {timer.state.running ? <Pause className="size-4" /> : <Play className="size-4" />}
              {timer.state.running ? 'Pause' : timer.hasStarted ? 'Resume' : 'Start'}
            </button>
            <button
              type="button"
              onClick={timer.reset}
              className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-white/[0.05] px-3 py-2 text-[0.9rem] text-muted hover:text-ink"
            >
              <RotateCcw className="size-4" /> Reset
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onPresenterView()
            }}
            className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-line py-2 text-[0.85rem] text-muted hover:text-ink"
          >
            <MonitorUp className="size-4" /> Open presenter view (P)
          </button>
        </div>
      )}
    </div>
  )
}

export function Toolbar(p: ToolbarProps) {
  const slide = slides[p.index]
  return (
    <footer
      className={cn(
        'no-print fixed inset-x-0 bottom-0 z-30 border-t border-line bg-navy-950/85 backdrop-blur-md',
        'lg:static lg:border-0 lg:bg-transparent lg:backdrop-blur-none',
      )}
    >
      <div className="flex h-[3.6rem] items-center justify-between gap-2 px-2 opacity-100 transition-opacity duration-300 sm:px-4 lg:h-[3.8rem] lg:px-[1.6rem] lg:opacity-55 lg:hover:opacity-100 lg:focus-within:opacity-100">
        {/* left: identity */}
        <div className="hidden min-w-0 flex-1 items-center gap-3 lg:flex">
          <span className="font-display text-[0.95rem] font-semibold tracking-wide text-ink">QuestLingua</span>
          <span className="h-4 w-px bg-white/15" />
          <span className="truncate text-[0.9rem] text-dim">{slide.title}</span>
        </div>

        {/* centre: navigation */}
        <nav aria-label="Slide navigation" className="flex items-center gap-1">
          <ToolButton label="Previous slide" shortcut="←" onClick={p.onPrev}>
            <ChevronLeft className="size-5" />
          </ToolButton>
          <button
            type="button"
            onClick={p.onOverview}
            title="Slide overview (O)"
            className="min-w-[5.2rem] cursor-pointer rounded-lg px-2 py-1 text-center font-display text-[1rem] font-semibold tracking-wider tabular-nums transition hover:bg-white/[0.06]"
            aria-label={`Slide ${p.index + 1} of ${TOTAL_SLIDES}. Open overview`}
          >
            <span className="text-ink">{pad2(p.index + 1)}</span>
            <span className="text-dim"> / {pad2(TOTAL_SLIDES)}</span>
          </button>
          <ToolButton label="Next slide" shortcut="→ / Space" onClick={p.onNext}>
            <ChevronRight className="size-5" />
          </ToolButton>
        </nav>

        {/* right: presenter tools */}
        <div className="flex flex-1 items-center justify-end gap-0.5">
          <div className="hidden lg:block">
            <TimerControl index={p.index} onPresenterView={p.onPresenterView} />
          </div>
          <ToolButton label="Speaker notes" shortcut="N" onClick={p.onNotes} active={p.notesOpen} className="hidden lg:grid">
            <NotebookPen className="size-[1.1rem]" />
          </ToolButton>
          <ToolButton label="Slide overview" shortcut="O" onClick={p.onOverview}>
            <LayoutGrid className="size-[1.1rem]" />
          </ToolButton>
          <ToolButton label="Explore Mode" shortcut="E" onClick={p.onExplore}>
            <Compass className="size-[1.1rem]" />
          </ToolButton>
          {p.fullscreenSupported && (
            <ToolButton
              label={p.isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              shortcut="F"
              onClick={p.onFullscreen}
              active={p.isFullscreen}
            >
              {p.isFullscreen ? <Minimize className="size-[1.1rem]" /> : <Maximize className="size-[1.1rem]" />}
            </ToolButton>
          )}
          <ToolButton label="Keyboard shortcuts" shortcut="?" onClick={p.onHelp} className="hidden sm:grid">
            <CircleQuestionMark className="size-[1.1rem]" />
          </ToolButton>
        </div>
      </div>
    </footer>
  )
}
