import { Compass } from 'lucide-react'
import { slides } from '../content/slides'
import { cn, pad2 } from '../lib/dom'
import { Kbd } from '../components/ui/primitives'
import { Overlay } from '../components/ui/Overlay'
import { usePace } from './Toolbar'

export function OverviewOverlay({
  open,
  onClose,
  index,
  onGo,
  onExplore,
}: {
  open: boolean
  onClose: () => void
  index: number
  onGo: (i: number) => void
  onExplore: () => void
}) {
  return (
    <Overlay
      open={open}
      onClose={onClose}
      className="max-w-[78rem]"
      labelledBy="overview-title"
      title={
        <div>
          <p className="eyebrow">Presentation overview</p>
          <h2 id="overview-title" className="mt-1 font-display text-[1.6rem] font-semibold">
            Jump to a section
          </h2>
        </div>
      }
    >
      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {slides.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => onGo(i)}
              className={cn(
                'group flex h-full w-full cursor-pointer flex-col rounded-xl border p-4 text-left transition',
                i === index
                  ? 'border-cyan-glow/60 bg-cyan-glow/10 shadow-[0_0_2rem_-0.8rem_rgb(94_231_255/0.8)]'
                  : 'border-line bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.07]',
              )}
            >
              <span className="flex items-center justify-between">
                <span className="font-display text-[1.5rem] font-semibold text-cyan-glow/90 tabular-nums">{pad2(i + 1)}</span>
                {s.seconds > 0 && <span className="text-[0.75rem] text-dim">{s.seconds >= 60 ? `${s.seconds / 60} min` : `${s.seconds} s`}</span>}
              </span>
              <span className="mt-2 font-display text-[1.05rem] leading-tight font-semibold">{s.title}</span>
              <span className="mt-1 text-[0.85rem] leading-snug text-muted">{s.summary}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-[0.85rem] text-dim">
        <span>
          Tip: press <Kbd>1</Kbd>–<Kbd>9</Kbd> or <Kbd>0</Kbd> to jump directly.
        </span>
        <button
          type="button"
          onClick={onExplore}
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-line px-3 py-1.5 text-muted transition hover:text-ink"
        >
          <Compass className="size-4" /> Open Explore Mode
        </button>
      </div>
    </Overlay>
  )
}

const shortcuts: [string[], string][] = [
  [['→', 'Space', 'PgDn'], 'Next slide'],
  [['←', 'Shift+Space', 'PgUp'], 'Previous slide'],
  [['Home', 'End'], 'First / last slide'],
  [['1–9', '0'], 'Jump to slide 1–9 / 10'],
  [['O'], 'Slide overview'],
  [['F'], 'Toggle fullscreen'],
  [['E'], 'Explore Mode'],
  [['N'], 'Speaker notes'],
  [['T'], 'Start / pause timer'],
  [['P'], 'Presenter view (second window)'],
  [['B'], 'Blank screen'],
  [['?'], 'This help'],
  [['Esc'], 'Close overlay / exit fullscreen'],
]

export function HelpOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Overlay
      open={open}
      onClose={onClose}
      className="max-w-[40rem]"
      labelledBy="help-title"
      title={
        <div>
          <p className="eyebrow">Presenter controls</p>
          <h2 id="help-title" className="mt-1 font-display text-[1.5rem] font-semibold">
            Keyboard shortcuts
          </h2>
        </div>
      }
    >
      <dl className="grid gap-x-6 gap-y-2.5 sm:grid-cols-[auto_1fr]">
        {shortcuts.map(([keys, label]) => (
          <div key={label} className="contents">
            <dt className="flex flex-wrap gap-1">
              {keys.map((k) => (
                <Kbd key={k}>{k}</Kbd>
              ))}
            </dt>
            <dd className="text-[0.95rem] text-muted">{label}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 border-t border-line pt-4 text-[0.85rem] leading-relaxed text-dim">
        Shortcuts are paused while you type in a text field. On a touch screen, use the arrows in the toolbar.
      </p>
    </Overlay>
  )
}

export function NotesPanel({ index, onClose }: { index: number; onClose: () => void }) {
  const slide = slides[index]
  const nextSlide = slides[index + 1]
  const { scale } = usePace(index)
  const suggested = Math.round(slide.seconds * scale)
  return (
    <aside
      aria-label="Speaker notes"
      className="no-print panel fixed bottom-[4.4rem] left-4 z-40 w-[24rem] max-w-[calc(100vw-2rem)] animate-pop p-4 lg:bottom-[4.6rem] lg:left-[1.6rem]"
    >
      <div className="flex items-center justify-between">
        <p className="eyebrow text-[0.7rem]">Speaker notes · {pad2(index + 1)}</p>
        <button type="button" onClick={onClose} className="cursor-pointer text-[0.8rem] text-dim hover:text-ink">
          Hide (N)
        </button>
      </div>
      <ul className="mt-2 space-y-1.5 text-[0.92rem] leading-snug text-muted">
        {slide.notes.map((n) => (
          <li key={n} className="flex gap-2">
            <span className="mt-[0.5em] size-1.5 shrink-0 rounded-full bg-cyan-glow/70" />
            {n}
          </li>
        ))}
      </ul>
      <p className="mt-3 border-t border-line pt-2 text-[0.8rem] text-dim">
        {suggested > 0 ? `Suggested ≈ ${suggested} s` : 'Open-ended'}
        {nextSlide && <> · Next: {nextSlide.title}</>}
      </p>
    </aside>
  )
}

export function BlankScreen({ onResume }: { onResume: () => void }) {
  return (
    <button
      type="button"
      onClick={onResume}
      className="fixed inset-0 z-[70] flex cursor-pointer items-end justify-center bg-black pb-6 text-[0.75rem] text-white/15"
      aria-label="Resume presentation"
    >
      Paused — press B or click to resume
    </button>
  )
}
