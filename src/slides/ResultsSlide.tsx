import { useState } from 'react'
import { ArrowLeft, ClipboardList, DatabaseZap, Eye } from 'lucide-react'
import { illustrativeParticipants } from '../content/illustrative'
import { programme } from '../content/methodology'
import { useResearchRecord } from '../lib/record'
import { usePresentation } from '../presentation/context'
import { Badge, Button, SlideHeading } from '../components/ui/primitives'
import { ResultsDashboard } from '../components/results/ResultsDashboard'
import { SlideFrame } from './SlideFrame'

export function ResultsSlide() {
  const { record, hasVerifiedResults, source } = useResearchRecord()
  const { openExplore } = usePresentation()
  const [preview, setPreview] = useState(false)
  const results = record.results

  return (
    <SlideFrame>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SlideHeading kicker="07 · Results" title="Pre-test and post-test comparison" />
        {hasVerifiedResults ? (
          <Badge tone="mint" className="mb-1">
            Verified data
          </Badge>
        ) : preview ? (
          <Button size="sm" variant="secondary" onClick={() => setPreview(false)} className="mb-1">
            <ArrowLeft className="size-4" /> Back to verified-data view
          </Button>
        ) : (
          <Badge tone="neutral" className="mb-1">
            No verified data yet
          </Badge>
        )}
      </div>

      <div className="mt-5 flex min-h-0 flex-1 flex-col lg:mt-[1.3rem]">
        {hasVerifiedResults && results ? (
          <ResultsDashboard
            participants={results.participants}
            illustrative={false}
            footnote={`Verified by ${results.verifiedBy} on ${results.verifiedOn}${results.note ? ` — ${results.note}` : ''}. Source: ${source === 'file' ? 'project research record' : 'research record entered on this device'}.`}
          />
        ) : preview ? (
          <ResultsDashboard participants={illustrativeParticipants} illustrative />
        ) : (
          <div className="panel relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-10 text-center">
            <div className="hairline-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]" aria-hidden />
            <div className="relative grid size-[4.5rem] place-items-center rounded-2xl border border-cyan-glow/35 bg-cyan-glow/10 shadow-[0_0_3rem_-0.8rem_rgb(94_231_255/0.8)]">
              <DatabaseZap className="size-[2.1rem] text-cyan-glow" />
            </div>
            <h3 className="relative mt-5 font-display text-[1.6rem] font-semibold lg:text-[2rem]">Verified results have not been entered yet</h3>
            <p className="relative mt-3 max-w-[46rem] text-[1rem] leading-relaxed text-muted lg:text-[1.15rem]">
              The pre-test / post-test comparison appears here automatically once real, checked scores are added to the research record.
              Until then, no scores, sample sizes or percentages are shown.
            </p>
            <dl className="relative mt-6 grid w-full max-w-[44rem] grid-cols-1 gap-3 text-left sm:grid-cols-3">
              <div className="panel-quiet px-4 py-3">
                <dt className="text-[0.72rem] font-semibold tracking-[0.16em] text-dim uppercase">Sessions confirmed</dt>
                <dd className="mt-1 font-display text-[1.4rem] font-semibold tabular-nums">
                  {record.completedSessions.length} <span className="text-[1rem] text-dim">/ {programme.plannedSessions}</span>
                </dd>
              </div>
              <div className="panel-quiet px-4 py-3">
                <dt className="text-[0.72rem] font-semibold tracking-[0.16em] text-dim uppercase">Verified scores</dt>
                <dd className="mt-1 font-display text-[1.4rem] font-semibold">Not entered</dd>
              </div>
              <div className="panel-quiet px-4 py-3">
                <dt className="text-[0.72rem] font-semibold tracking-[0.16em] text-dim uppercase">Conclusions</dt>
                <dd className="mt-1 font-display text-[1.4rem] font-semibold">Pending</dd>
              </div>
            </dl>
            <div className="relative mt-7 flex flex-wrap justify-center gap-3">
              <Button variant="secondary" onClick={() => setPreview(true)}>
                <Eye className="size-4" /> Preview the layout with illustrative data
              </Button>
              <Button variant="ghost" onClick={() => openExplore('results')}>
                <ClipboardList className="size-4" /> Enter verified data
              </Button>
            </div>
          </div>
        )}
      </div>
    </SlideFrame>
  )
}
