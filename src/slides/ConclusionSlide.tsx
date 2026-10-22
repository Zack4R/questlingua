import { CircleAlert, Lightbulb, Package, Telescope, TriangleAlert } from 'lucide-react'
import { expectedOutcomes, futureSteps, limitations, practicalValue } from '../content/project'
import { useResearchRecord } from '../lib/record'
import { fmt, signed, summarise } from '../lib/stats'
import { TOTAL_MAX } from '../content/rubric'
import { Badge, SlideHeading } from '../components/ui/primitives'
import { SlideFrame } from './SlideFrame'

/** Conclusions are generated only from verified data and only describe what was measured. */
function evidenceStatements(participants: Parameters<typeof summarise>[0]) {
  const s = summarise(participants)
  const lines = [
    `In this group (n = ${s.n}), the mean total speaking score changed from ${fmt(s.totalPreMean)} to ${fmt(s.totalPostMean)} out of ${TOTAL_MAX} (${signed(s.meanChange)}).`,
    `${s.improved} of ${s.n} participants scored higher in the post-test, ${s.unchanged} the same and ${s.declined} lower.`,
  ]
  if (s.largestChange.length) {
    const names = s.largestChange.map((c) => c.name)
    const list = names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0]
    lines.push(`The largest mean change (${signed(s.largestChange[0].change, 2)}) was in ${list}.`)
  }
  lines.push(
    s.meanChange > 0
      ? 'The direction of change is consistent with the hypothesis, but this design cannot show that the missions caused it.'
      : 'The data do not show the expected increase; the hypothesis is not supported by these scores.',
  )
  return lines
}

export function ConclusionSlide() {
  const { record, hasVerifiedResults } = useResearchRecord()
  const statements = hasVerifiedResults && record.results ? evidenceStatements(record.results.participants) : null

  return (
    <SlideFrame>
      <SlideHeading kicker="08 · Conclusion" title="Conclusions, limitations & practical value" />
      <p className="mt-3 flex items-start gap-2.5 text-[0.98rem] leading-snug text-amber-100 lg:text-[1.08rem]">
        <TriangleAlert className="mt-0.5 size-[1.15em] shrink-0 text-amber-glow" />
        Without a control group, any change in scores cannot be attributed to gaming alone — regular lessons, familiarity with the test and other
        factors may also play a role.
      </p>

      <div className="mt-5 grid min-h-0 flex-1 gap-4 lg:mt-[1.1rem] lg:grid-cols-3 lg:gap-[1.1rem]">
        <section className="panel flex flex-col p-5 lg:p-[1.3rem]">
          <div className="flex items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 font-display text-[1.2rem] font-semibold">
              {statements ? <Lightbulb className="size-5 text-cyan-glow" /> : <Telescope className="size-5 text-cyan-glow" />}
              {statements ? 'What the evidence shows' : 'Expected outcomes'}
            </h3>
            <Badge tone={statements ? 'mint' : 'amber'}>{statements ? 'Verified data' : 'To be tested'}</Badge>
          </div>
          <ul className="stagger mt-3 space-y-2.5">
            {(statements ?? expectedOutcomes).map((t) => (
              <li key={t} className="flex gap-2.5 text-[0.98rem] leading-snug text-ink lg:text-[1.04rem]">
                <span className="mt-[0.5em] size-1.5 shrink-0 rounded-full bg-cyan-glow" />
                {t}
              </li>
            ))}
          </ul>
          {!statements && (
            <>
              <p className="mt-4 text-[0.75rem] font-semibold tracking-[0.16em] text-dim uppercase">Next research steps</p>
              <ol className="mt-2 space-y-1.5">
                {futureSteps.map((t, i) => (
                  <li key={t} className="flex gap-2 text-[0.9rem] leading-snug text-muted lg:text-[0.95rem]">
                    <span className="font-display font-semibold text-violet-glow tabular-nums">{i + 1}.</span>
                    {t}
                  </li>
                ))}
              </ol>
            </>
          )}
        </section>

        <section className="panel flex flex-col p-5 lg:p-[1.3rem]">
          <h3 className="flex items-center gap-2 font-display text-[1.2rem] font-semibold">
            <Package className="size-5 text-violet-glow" /> Practical value
          </h3>
          <ul className="stagger mt-3 space-y-3">
            {practicalValue.map((p) => (
              <li key={p.title}>
                <p className="font-display text-[1.02rem] font-semibold lg:text-[1.08rem]">{p.title}</p>
                <p className="mt-0.5 text-[0.9rem] leading-snug text-muted lg:text-[0.95rem]">{p.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel flex flex-col p-5 lg:p-[1.3rem]">
          <h3 className="flex items-center gap-2 font-display text-[1.2rem] font-semibold">
            <CircleAlert className="size-5 text-amber-glow" /> Limitations
          </h3>
          <ul className="mt-3 space-y-2.5">
            {limitations.map((l) => (
              <li key={l.title} className="text-[0.88rem] leading-snug text-muted lg:text-[0.93rem]">
                <span className="font-semibold text-ink">{l.title}.</span> {l.text}
              </li>
            ))}
          </ul>
        </section>
      </div>

    </SlideFrame>
  )
}
