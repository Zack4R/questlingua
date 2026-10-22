import { criteria, TOTAL_MAX, TOTAL_MIN } from '../content/rubric'
import { SlideHeading } from '../components/ui/primitives'
import { criterionColors, criterionIcons, RubricExplorer } from '../components/shared/RubricExplorer'
import { SlideFrame } from './SlideFrame'

export function AssessmentSlide() {
  return (
    <SlideFrame>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SlideHeading kicker="06 · Speaking assessment" title="Four criteria, scored from 1 to 5" />
        <div className="mb-1 flex items-center gap-3 rounded-2xl border border-line bg-white/[0.03] px-4 py-2.5">
          <span className="font-display text-[1.05rem] text-muted">
            4 × 5 =
          </span>
          <span className="font-display text-[2rem] leading-none font-semibold text-gradient">{TOTAL_MAX}</span>
          <span className="max-w-[9rem] text-[0.8rem] leading-tight text-dim">
            points maximum · minimum {TOTAL_MIN}
          </span>
        </div>
      </div>

      <ul className="stagger mt-5 grid grid-cols-2 gap-3 lg:mt-[1.3rem] lg:grid-cols-4 lg:gap-[1rem]">
        {criteria.map((c) => {
          const Icon = criterionIcons[c.id]
          const color = criterionColors[c.id]
          return (
            <li key={c.id} className="panel relative overflow-hidden p-4 lg:p-[1.1rem]">
              <span className="absolute inset-x-0 top-0 h-[3px]" style={{ background: color }} />
              <Icon className="size-[1.5rem]" style={{ color }} />
              <h3 className="mt-2 font-display text-[1.1rem] leading-tight font-semibold lg:text-[1.2rem]">{c.name}</h3>
              <p className="mt-1 text-[0.85rem] leading-snug text-muted lg:text-[0.92rem]">{c.question}</p>
            </li>
          )
        })}
      </ul>

      <div className="mt-4 min-h-0 flex-1 lg:mt-[1.1rem]">
        <RubricExplorer />
      </div>
    </SlideFrame>
  )
}
