import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Rocket, Timer } from 'lucide-react'
import { cn, formatClock } from '../../lib/dom'
import { stopSpeaking } from '../../lib/speech'
import { Button } from '../ui/primitives'
import { CityMap } from './CityMap'
import { BriefingStep, DialogueStep, GuideStep, QuestionsStep, ReflectionStep, VocabularyStep } from './DemoSteps'
import { modelRoute } from './engine'
import { derive, mission, STEPS, useMission } from './missionStore'

const TARGET_MS = 2 * 60 * 1000

function DemoClock({ startedAt, completedAt }: { startedAt: number | null; completedAt: number | null }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!startedAt) return
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [startedAt])
  const elapsed = startedAt ? Math.max(0, (completedAt ?? now) - startedAt) : 0
  const over = elapsed > TARGET_MS
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.8rem] font-semibold tabular-nums',
        over ? 'border-amber-glow/50 text-amber-100' : 'border-line text-muted',
      )}
      title="Demonstration time (target: under 2 minutes)"
    >
      <Timer className="size-3.5" />
      {formatClock(elapsed)} <span className="font-normal text-dim">/ 2:00</span>
    </span>
  )
}

export function FindYourWayDemo() {
  const s = useMission()
  const d = derive(s)
  const route = useMemo(() => modelRoute(d.scenario), [d.scenario])

  // play the model route step by step
  useEffect(() => {
    if (!s.autoplay) return
    const id = window.setTimeout(() => {
      if (s.log.length < route.length) mission.command(route[s.log.length])
      else mission.command('stop')
    }, 750)
    return () => window.clearTimeout(id)
  }, [s.autoplay, s.log.length, route])

  useEffect(() => () => stopSpeaking(), [])

  const StepBody = [BriefingStep, VocabularyStep, GuideStep, QuestionsStep, DialogueStep, ReflectionStep][s.step]
  const last = s.step === STEPS.length - 1

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr] lg:gap-[1.1rem]">
      {/* map */}
      <div className="panel flex min-h-0 min-w-0 flex-col p-2.5 lg:p-[0.8rem]">
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <CityMap
            scenario={d.scenario}
            node={d.node}
            heading={d.heading}
            trail={d.trail}
            modelPath={s.showModel ? route : null}
            highlight={s.highlight}
            completed={d.completed}
          />
        </div>
        <ul className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[0.78rem] text-muted lg:text-[0.82rem]">
          <li className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-mint-glow" /> Start: {d.scenario.title.split(' → ')[0]}
          </li>
          <li className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm border-2" style={{ borderColor: d.destination.color }} /> Destination: {d.destination.name}
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-2.5 w-4 rounded-sm bg-[repeating-linear-gradient(45deg,#f59e0b_0_3px,#3a1f2b_3px_6px)]" /> Road closed
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-1 w-4 rounded-full bg-cyan-glow" /> Your route
          </li>
          {s.showModel && (
            <li className="flex items-center gap-1.5">
              <span className="h-1 w-4 rounded-full bg-[repeating-linear-gradient(90deg,#a297ff_0_3px,transparent_3px_7px)]" /> Model route
            </li>
          )}
        </ul>
      </div>

      {/* mission steps */}
      <div className="panel flex min-h-0 min-w-0 flex-col">
        <div className="flex items-center gap-1 overflow-x-auto border-b border-line px-2 pt-2 scrollbar-thin" role="tablist" aria-label="Mission steps">
          {STEPS.map((label, i) => (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={s.step === i}
              title={`${i + 1}. ${label}`}
              onClick={() => mission.goStep(i)}
              className={cn(
                'relative flex shrink-0 cursor-pointer items-center gap-1.5 rounded-t-lg px-2.5 pt-1.5 pb-2.5 text-[0.82rem] font-semibold transition lg:text-[0.86rem]',
                s.step === i ? 'text-ink' : 'text-dim hover:text-muted',
              )}
            >
              <span
                className={cn(
                  'grid size-[1.35rem] place-items-center rounded-full text-[0.7rem] tabular-nums',
                  s.step === i ? 'bg-cyan-glow text-navy-950' : i < s.step ? 'bg-cyan-glow/20 text-cyan-100' : 'bg-white/[0.06]',
                )}
              >
                {i < s.step ? <Check className="size-3" strokeWidth={3.5} /> : i + 1}
              </span>
              <span className={cn(s.step !== i && 'lg:sr-only')}>{label}</span>
              {s.step === i && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-cyan-glow" />}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 scrollbar-thin lg:p-[1.1rem]" role="tabpanel" aria-label={STEPS[s.step]}>
          <StepBody s={s} />
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-line px-3 py-2.5">
          <Button size="sm" variant="ghost" onClick={() => mission.goStep(s.step - 1)} disabled={s.step === 0}>
            <ArrowLeft className="size-4" /> Back
          </Button>
          <DemoClock startedAt={s.startedAt} completedAt={s.completedAt} />
          {s.step === 0 ? (
            <Button size="sm" variant="primary" onClick={mission.start}>
              <Rocket className="size-4" /> Start mission
            </Button>
          ) : last ? (
            <Button size="sm" variant="subtle" onClick={mission.restart}>
              Restart demo
            </Button>
          ) : (
            <Button size="sm" variant="subtle" onClick={() => mission.goStep(s.step + 1)}>
              {STEPS[s.step + 1]} <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
