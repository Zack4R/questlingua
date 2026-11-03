import { useState } from 'react'
import { ArrowLeft, ClipboardList, Eye, Video } from 'lucide-react'
import { illustrativeParticipants } from '../content/illustrative'
import { useResearchRecord } from '../lib/record'
import { usePresentation } from '../presentation/context'
import { Badge, Button, SlideHeading } from '../components/ui/primitives'
import { ResultsDashboard } from '../components/results/ResultsDashboard'
import { SurveyVideo } from '../components/results/SurveyVideo'
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
            <ArrowLeft className="size-4" /> Back to the video
          </Button>
        ) : (
          <Badge tone="cyan" className="mb-1">
            <Video className="size-3.5" /> Сауалнама
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
          <SurveyVideo
            footer={
              <>
                <Button size="sm" variant="ghost" onClick={() => setPreview(true)}>
                  <Eye className="size-4" /> Results layout (illustrative)
                </Button>
                <Button size="sm" variant="ghost" onClick={() => openExplore('results')}>
                  <ClipboardList className="size-4" /> Enter verified data
                </Button>
              </>
            }
          />
        )}
      </div>
    </SlideFrame>
  )
}
