import { CalendarDays, Layers, Repeat } from 'lucide-react'
import { methods, programme, researchDesign } from '../content/methodology'
import { useResearchRecord } from '../lib/record'
import { Badge, IconTile, SlideHeading } from '../components/ui/primitives'
import { ProgrammeTimeline, SessionLegend } from '../components/shared/ProgrammeTimeline'
import { methodIcons } from '../components/shared/icons'
import { SlideFrame } from './SlideFrame'

const kindTone = { Quantitative: 'cyan', Qualitative: 'violet', Mixed: 'mint' } as const

export function MethodologySlide() {
  const { record } = useResearchRecord()
  const completed = record.completedSessions.length

  const stats = [
    { icon: CalendarDays, value: programme.weeks, label: 'weeks' },
    { icon: Repeat, value: programme.sessionsPerWeek, label: 'sessions per week' },
    { icon: Layers, value: programme.plannedSessions, label: 'planned sessions' },
  ]

  return (
    <SlideFrame>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SlideHeading kicker="03 · Research methodology" title="Eight weeks, measured before and after">
          {researchDesign.name} · {researchDesign.type.toLowerCase()}
        </SlideHeading>
        <div className="flex gap-2 lg:gap-[0.7rem]">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="panel flex items-center gap-2.5 px-3.5 py-2.5">
              <Icon className="hidden size-[1.2rem] text-cyan-glow sm:block" />
              <div>
                <p className="font-display text-[1.6rem] leading-none font-semibold lg:text-[1.9rem]">{value}</p>
                <p className="mt-0.5 text-[0.75rem] leading-tight text-muted lg:text-[0.8rem]">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="panel mt-4 p-4 lg:mt-[1.2rem] lg:p-[1.1rem]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-[1.1rem] font-semibold lg:text-[1.2rem]">Programme timeline</h3>
          <SessionLegend completed={completed} />
        </div>
        <ProgrammeTimeline completedSessions={record.completedSessions} />
        {completed === 0 && (
          <p className="mt-3 text-[0.85rem] text-dim lg:text-[0.9rem]">
            All sessions are shown as planned. A session is marked as completed only after it has been confirmed in the research record.
          </p>
        )}
      </section>

      <ul className="stagger mt-4 grid min-h-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-[1.1rem] lg:grid-cols-5 lg:gap-[0.9rem]">
        {methods.map((m) => {
          const Icon = methodIcons[m.icon]
          return (
            <li key={m.id} className="panel flex flex-col p-4 lg:p-[1rem]">
              <div className="flex items-start justify-between gap-2">
                <IconTile className="size-[2.4rem]" color={m.kind === 'Qualitative' ? '#a297ff' : m.kind === 'Mixed' ? '#5eead4' : '#5ee7ff'}>
                  <Icon className="size-[1.2rem]" />
                </IconTile>
                <Badge tone={kindTone[m.kind]} className="text-[0.65rem]">
                  {m.kind}
                </Badge>
              </div>
              <h4 className="mt-3 font-display text-[1.05rem] leading-tight font-semibold lg:text-[1.22rem]">{m.name}</h4>
              <p className="mt-1 text-[0.85rem] font-medium text-cyan-100/80 lg:text-[0.95rem]">{m.when}</p>
              <p className="mt-1.5 text-[0.85rem] leading-snug text-muted lg:text-[1rem]">{m.purpose}</p>
            </li>
          )
        })}
      </ul>
    </SlideFrame>
  )
}
