import { Check, Mic } from 'lucide-react'
import { missions } from '../../content/missions'
import { programme, sessions } from '../../content/methodology'
import { cn } from '../../lib/dom'

interface Props {
  completedSessions: number[]
  /** In Explore Mode sessions can be toggled by the presenter. */
  onToggleSession?: (n: number) => void
  className?: string
  /** 'slide' = one row of eight weeks; 'page' = two rows of four (narrower Explore column) */
  variant?: 'slide' | 'page'
}

export function SessionLegend({ completed }: { completed: number }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.85rem] text-muted lg:text-[0.95rem]">
      <span className="flex items-center gap-2">
        <span className="size-[0.95rem] rounded-full border-2 border-dashed border-white/35" /> Planned session
      </span>
      <span className="flex items-center gap-2">
        <span className="grid size-[0.95rem] place-items-center rounded-full bg-cyan-glow text-navy-950">
          <Check className="size-[0.65rem]" strokeWidth={4} />
        </span>
        Confirmed completed
      </span>
      <span className="font-semibold text-ink tabular-nums">
        {completed} / {programme.plannedSessions} confirmed
      </span>
    </div>
  )
}

function TestCard({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-violet-glow/35 bg-violet-glow/[0.08] px-3 py-3 lg:flex-col lg:justify-center lg:px-2 lg:text-center">
      <Mic className="size-[1.2rem] shrink-0 text-violet-glow" />
      <div>
        <p className="font-display text-[0.95rem] leading-tight font-semibold">{label}</p>
        <p className="text-[0.75rem] text-dim">{sub}</p>
      </div>
    </div>
  )
}

export function ProgrammeTimeline({ completedSessions, onToggleSession, className, variant = 'slide' }: Props) {
  const done = new Set(completedSessions)
  const slide = variant === 'slide'
  return (
    <div className={cn('grid gap-3', slide ? 'lg:grid-cols-[6.5rem_1fr_6.5rem] lg:gap-[0.8rem]' : 'md:grid-cols-[7rem_1fr_7rem]', className)}>
      <TestCard label="Pre-test" sub="Before week 1" />

      <ol className={cn('relative grid grid-cols-2 gap-2 sm:grid-cols-4', slide && 'lg:grid-cols-8 lg:gap-[0.55rem]')}>
        {missions.map((m) => {
          const weekSessions = sessions.filter((s) => s.week === m.week)
          return (
            <li key={m.week} className="panel-quiet relative flex flex-col gap-2 p-2.5 lg:p-[0.7rem]">
              <div className="flex items-baseline justify-between">
                <span className="font-display text-[0.8rem] font-semibold tracking-widest text-cyan-glow uppercase">Week {m.week}</span>
              </div>
              <p className="min-h-[2.4em] text-[0.85rem] leading-tight font-medium text-ink lg:text-[0.9rem]">{m.title}</p>
              <div className="flex gap-1.5">
                {weekSessions.map((s) => {
                  const isDone = done.has(s.number)
                  const label = `Session ${s.number} (week ${s.week}, ${s.part}): ${isDone ? 'confirmed completed' : 'planned'}`
                  const dot = (
                    <span
                      className={cn(
                        'flex h-[1.9rem] flex-1 items-center justify-center gap-1 rounded-md text-[0.75rem] font-semibold tabular-nums transition',
                        isDone
                          ? 'bg-cyan-glow text-navy-950 shadow-[0_0_1rem_-0.2rem_rgb(94_231_255/0.8)]'
                          : 'border border-dashed border-white/30 text-dim',
                      )}
                    >
                      {isDone && <Check className="size-3" strokeWidth={3.5} />}S{s.number}
                    </span>
                  )
                  return onToggleSession ? (
                    <button
                      key={s.number}
                      type="button"
                      onClick={() => onToggleSession(s.number)}
                      className="flex flex-1 cursor-pointer rounded-md hover:brightness-125"
                      aria-pressed={isDone}
                      aria-label={label}
                      title={label}
                    >
                      {dot}
                    </button>
                  ) : (
                    <span key={s.number} className="flex flex-1" title={label} aria-label={label} role="img">
                      {dot}
                    </span>
                  )
                })}
              </div>
            </li>
          )
        })}
      </ol>

      <TestCard label="Post-test" sub="After week 8" />
    </div>
  )
}
