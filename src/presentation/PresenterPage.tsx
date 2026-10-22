import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react'
import { slides, TOTAL_SLIDES } from '../content/slides'
import { openChannel } from '../lib/channel'
import { cn, formatClock, isTypingTarget, pad2, shortcutKey } from '../lib/dom'
import { TARGET_OPTIONS, useTimer } from '../lib/timer'
import { usePace } from './Toolbar'

/**
 * Presenter view: opened in a second window (key P) and kept on the laptop screen
 * while the projector shows the slides. Synced through BroadcastChannel.
 */
export function PresenterPage() {
  const [index, setIndex] = useState<number | null>(null)
  const channel = useRef<ReturnType<typeof openChannel> | null>(null)
  const timer = useTimer()

  useEffect(() => {
    document.documentElement.dataset.mode = 'explore'
    document.title = 'Presenter view · QuestLingua'
    const ch = openChannel((m) => {
      if (m.type === 'state') setIndex(m.index)
    })
    channel.current = ch
    ch.post({ type: 'hello' })
    return () => ch.close()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target) || e.ctrlKey || e.metaKey || e.altKey) return
      if (['ArrowRight', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault()
        channel.current?.post(e.shiftKey && e.key === ' ' ? { type: 'prev' } : { type: 'next' })
      } else if (['ArrowLeft', 'PageUp'].includes(e.key)) {
        e.preventDefault()
        channel.current?.post({ type: 'prev' })
      } else if (shortcutKey(e) === 't') timer.toggle()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [timer])

  const current = index ?? 0
  const slide = slides[current]
  const nextSlide = slides[current + 1]
  const { elapsed, status, scale } = usePace(current)

  return (
    <div className="mx-auto flex min-h-dvh max-w-[72rem] flex-col gap-5 p-5 sm:p-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">QuestLingua · Presenter view</p>
          {index === null && (
            <p className="mt-1 text-[0.9rem] text-amber-100">
              Waiting for the presentation window… Open the presentation in another tab or window of this browser.
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => channel.current?.post({ type: 'prev' })}
            className="grid size-11 cursor-pointer place-items-center rounded-xl border border-line text-muted hover:text-ink"
            aria-label="Previous slide"
          >
            <ChevronLeft className="size-5" />
          </button>
          <span className="min-w-[5rem] text-center font-display text-[1.3rem] font-semibold tabular-nums">
            {pad2(current + 1)} <span className="text-dim">/ {pad2(TOTAL_SLIDES)}</span>
          </span>
          <button
            type="button"
            onClick={() => channel.current?.post({ type: 'next' })}
            className="grid size-11 cursor-pointer place-items-center rounded-xl border border-cyan-glow/40 bg-cyan-glow/10 text-cyan-100 hover:bg-cyan-glow/20"
            aria-label="Next slide"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </header>

      <div className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
        <section className="panel p-6">
          <p className="text-[0.75rem] font-semibold tracking-[0.18em] text-dim uppercase">Now · {slide.kicker}</p>
          <h1 className="mt-1 font-display text-[2rem] leading-tight font-semibold">{slide.title}</h1>
          <ul className="mt-4 space-y-2.5">
            {slide.notes.map((n) => (
              <li key={n} className="flex gap-3 text-[1.15rem] leading-snug text-ink">
                <span className="mt-[0.55em] size-2 shrink-0 rounded-full bg-cyan-glow" />
                {n}
              </li>
            ))}
          </ul>
          {slide.seconds > 0 && <p className="mt-4 text-[0.9rem] text-dim">Suggested time ≈ {Math.round(slide.seconds * scale)} s</p>}
        </section>

        <div className="flex flex-col gap-5">
          <section className="panel p-6">
            <p className="text-[0.75rem] font-semibold tracking-[0.18em] text-dim uppercase">Timer</p>
            <p
              className={cn(
                'mt-1 font-display text-[3.4rem] leading-none font-semibold tabular-nums',
                status === 'behind' && 'text-amber-200',
                status === 'over' && 'text-rose-300',
              )}
            >
              {formatClock(elapsed)}
            </p>
            <p className="mt-1 text-[0.9rem] text-dim">
              Target {timer.state.targetMinutes}:00 ·{' '}
              {status === 'idle' ? 'not started' : status === 'ok' ? 'on pace' : status === 'behind' ? 'behind plan' : 'over time'}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={timer.toggle}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/[0.08] px-3 py-2 text-[0.9rem] hover:bg-white/[0.14]"
              >
                {timer.state.running ? <Pause className="size-4" /> : <Play className="size-4" />}
                {timer.state.running ? 'Pause' : 'Start'}
              </button>
              <button
                type="button"
                onClick={timer.reset}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-[0.9rem] text-muted hover:text-ink"
              >
                <RotateCcw className="size-4" /> Reset
              </button>
              <div className="ml-auto flex gap-1">
                {TARGET_OPTIONS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => timer.setTarget(m)}
                    className={cn(
                      'cursor-pointer rounded-lg border px-2 py-1.5 text-[0.85rem]',
                      timer.state.targetMinutes === m ? 'border-cyan-glow/60 bg-cyan-glow/15 text-cyan-100' : 'border-line text-muted',
                    )}
                  >
                    {m}′
                  </button>
                ))}
              </div>
            </div>
          </section>
          <section className="panel p-6">
            <p className="text-[0.75rem] font-semibold tracking-[0.18em] text-dim uppercase">Up next</p>
            <p className="mt-1 font-display text-[1.4rem] font-semibold">{nextSlide ? nextSlide.title : 'End of presentation'}</p>
            {nextSlide && <p className="mt-1 text-[0.95rem] text-muted">{nextSlide.summary}</p>}
          </section>
        </div>
      </div>

      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {slides.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => channel.current?.post({ type: 'go', index: i })}
              className={cn(
                'w-full cursor-pointer rounded-lg border px-3 py-2 text-left text-[0.85rem] transition',
                i === current ? 'border-cyan-glow/60 bg-cyan-glow/10 text-ink' : 'border-line text-muted hover:text-ink',
              )}
            >
              <span className="font-semibold tabular-nums">{pad2(i + 1)}</span> {s.title}
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
