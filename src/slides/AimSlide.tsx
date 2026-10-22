import { FlaskConical, Target } from 'lucide-react'
import { aim, hypothesis, objectives } from '../content/project'
import { Badge, IconTile, SlideHeading } from '../components/ui/primitives'
import { SlideFrame } from './SlideFrame'

export function AimSlide() {
  return (
    <SlideFrame>
      <SlideHeading kicker="02 · Purpose" title="Aim, objectives & hypothesis" />

      <div className="mt-6 grid min-h-0 flex-1 gap-5 lg:mt-[1.6rem] lg:grid-cols-[1fr_1.1fr] lg:gap-[1.6rem]">
        <div className="stagger flex flex-col gap-5 lg:gap-[1.4rem]">
          <section className="panel p-5 lg:p-[1.5rem]">
            <div className="flex items-center gap-3">
              <IconTile className="size-[2.6rem]">
                <Target className="size-[1.3rem]" />
              </IconTile>
              <h3 className="font-display text-[1.3rem] font-semibold">Research aim</h3>
            </div>
            <p className="mt-3 text-[1.05rem] leading-relaxed text-ink lg:text-[1.2rem]">{aim}</p>
          </section>

          <section className="panel relative flex-1 overflow-hidden border-violet-glow/30 p-5 lg:p-[1.5rem]">
            <div className="absolute -top-16 -right-16 size-48 rounded-full bg-violet-glow/15 blur-3xl" aria-hidden />
            <div className="relative flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <IconTile color="#a297ff" className="size-[2.6rem]">
                  <FlaskConical className="size-[1.3rem]" />
                </IconTile>
                <h3 className="font-display text-[1.3rem] font-semibold">Hypothesis</h3>
              </div>
              <Badge tone="amber">To be tested</Badge>
            </div>
            <p className="relative mt-3 text-[1rem] leading-relaxed text-ink lg:text-[1.1rem]">{hypothesis.statement}</p>
            <dl className="relative mt-4 grid gap-2 text-[0.9rem] sm:grid-cols-2 lg:text-[0.95rem]">
              <div className="panel-quiet p-3">
                <dt className="text-[0.7rem] font-semibold tracking-[0.18em] text-dim uppercase">Independent variable</dt>
                <dd className="mt-1 text-muted">{hypothesis.variables.independent}</dd>
              </div>
              <div className="panel-quiet p-3">
                <dt className="text-[0.7rem] font-semibold tracking-[0.18em] text-dim uppercase">Dependent variable</dt>
                <dd className="mt-1 text-muted">{hypothesis.variables.dependent}</dd>
              </div>
            </dl>
            <p className="relative mt-3 text-[0.85rem] text-amber-100/80">{hypothesis.status}</p>
          </section>
        </div>

        <section className="panel p-5 lg:p-[1.5rem]">
          <h3 className="font-display text-[1.3rem] font-semibold">Objectives</h3>
          <ol className="stagger mt-4 space-y-3 lg:space-y-[0.9rem]">
            {objectives.map((o, i) => (
              <li key={o} className="flex gap-4">
                <span className="grid size-[2.3rem] shrink-0 place-items-center rounded-lg border border-cyan-glow/35 bg-cyan-glow/10 font-display text-[1.05rem] font-semibold text-cyan-glow tabular-nums">
                  {i + 1}
                </span>
                <p className="pt-1 text-[1rem] leading-snug text-ink lg:text-[1.12rem]">{o}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </SlideFrame>
  )
}
