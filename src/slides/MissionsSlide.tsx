import { useState } from 'react'
import { ChevronLeft, ChevronRight, MousePointerClick } from 'lucide-react'
import { missions } from '../content/missions'
import { useSlideKeys } from '../presentation/context'
import { IconTile, SlideHeading } from '../components/ui/primitives'
import { Overlay } from '../components/ui/Overlay'
import { MissionDetail } from '../components/shared/MissionDetail'
import { missionIcons } from '../components/shared/icons'
import { SlideFrame } from './SlideFrame'

export function MissionsSlide() {
  const [open, setOpen] = useState<number | null>(null)
  const close = () => setOpen(null)
  const step = (d: number) => setOpen((o) => (o === null ? o : (o + d + missions.length) % missions.length))

  // While a card is open, arrows move between missions and Esc closes it.
  useSlideKeys((e) => {
    if (open === null) return false
    if (e.key === 'Escape') return close(), true
    if (e.key === 'ArrowRight') return step(1), true
    if (e.key === 'ArrowLeft') return step(-1), true
    if (e.key === ' ') return true
    return false
  })

  return (
    <SlideFrame>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SlideHeading kicker="04 · The programme" title="Eight missions, one communicative goal each week" />
        <p className="mb-1 flex items-center gap-2 text-[0.9rem] text-dim">
          <MousePointerClick className="size-4" /> Select a mission to open it
        </p>
      </div>

      <ol className="stagger mt-6 grid min-h-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-[1.6rem] lg:grid-cols-4 lg:grid-rows-2 lg:gap-[1rem]">
        {missions.map((m, i) => {
          const Icon = missionIcons[m.icon]
          return (
            <li key={m.slug} className="min-h-0">
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="group panel relative flex h-full w-full cursor-pointer flex-col overflow-hidden p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-white/25 lg:p-[1.3rem]"
              >
                <span
                  aria-hidden
                  className="absolute -top-12 -right-12 size-40 rounded-full opacity-25 blur-2xl transition-opacity duration-300 group-hover:opacity-50"
                  style={{ background: m.accent }}
                />
                <span className="relative flex items-start justify-between">
                  <IconTile color={m.accent} className="size-[3rem]">
                    <Icon className="size-[1.5rem]" />
                  </IconTile>
                  <span className="font-display text-[2.2rem] leading-none font-semibold text-white/10 tabular-nums transition group-hover:text-white/20">
                    {String(m.number).padStart(2, '0')}
                  </span>
                </span>
                <span className="relative mt-4 hidden self-start rounded-xl rounded-bl-sm border border-white/12 bg-white/[0.05] px-3 py-1.5 font-display text-[0.95rem] text-ink/90 sm:block lg:text-[1.02rem]">
                  “{m.targetPhrases[0]}”
                </span>
                <span className="relative mt-auto pt-4">
                  <span className="block text-[0.75rem] font-semibold tracking-[0.18em] uppercase" style={{ color: m.accent }}>
                    Week {m.week}
                  </span>
                  <span className="mt-1 block font-display text-[1.25rem] leading-tight font-semibold lg:text-[1.35rem]">{m.title}</span>
                  <span className="mt-1 block text-[0.9rem] text-muted lg:text-[0.95rem]">{m.tagline}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      <Overlay
        open={open !== null}
        onClose={close}
        className="max-w-[72rem]"
        title={
          open !== null && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => step(-1)}
                className="grid size-9 cursor-pointer place-items-center rounded-lg border border-line text-muted hover:text-ink"
                aria-label="Previous mission"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="grid size-9 cursor-pointer place-items-center rounded-lg border border-line text-muted hover:text-ink"
                aria-label="Next mission"
              >
                <ChevronRight className="size-5" />
              </button>
              <span className="ml-2 text-[0.85rem] text-dim tabular-nums">
                {open + 1} / {missions.length} · ← → to browse · Esc to close
              </span>
            </div>
          )
        }
      >
        {open !== null && <MissionDetail mission={missions[open]} large />}
      </Overlay>
    </SlideFrame>
  )
}
