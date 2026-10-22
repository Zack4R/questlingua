import { useMemo } from 'react'
import { Clock, Map, MessageCircle, ShieldAlert } from 'lucide-react'
import { problem, project } from '../content/project'
import { IconTile, SlideHeading } from '../components/ui/primitives'
import { IsoScene } from '../components/visuals/IsoScene'
import { bridgeColors, gapBridge } from '../components/visuals/scenes'
import { SlideFrame } from './SlideFrame'

const icons = [MessageCircle, Clock, ShieldAlert, Map]
const iconColors = ['#5ee7ff', '#a297ff', '#fda4af', '#5eead4']

export function ProblemSlide() {
  const bridge = useMemo(() => gapBridge(), [])
  return (
    <SlideFrame>
      <SlideHeading kicker="01 · Research problem" title="Students know English — but often hesitate to speak it">
        {problem.lead}
      </SlideHeading>

      <div className="mt-6 grid min-h-0 flex-1 gap-5 lg:mt-[1.6rem] lg:grid-cols-[1.05fr_1fr] lg:gap-[1.6rem]">
        <ul className="stagger grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-[1rem]">
          {problem.whySpeakingMatters.map((item, i) => {
            const Icon = icons[i]
            return (
              <li key={item.title} className="panel flex gap-4 p-4 lg:p-[1.2rem]">
                <IconTile color={iconColors[i]} className="size-[2.8rem]">
                  <Icon className="size-[1.4rem]" />
                </IconTile>
                <div>
                  <h3 className="font-display text-[1.15rem] font-semibold lg:text-[1.25rem]">{item.title}</h3>
                  <p className="mt-1 text-[0.95rem] leading-snug text-muted lg:text-[1.05rem]">{item.text}</p>
                </div>
              </li>
            )
          })}
        </ul>

        <figure className="panel flex flex-col p-4 lg:p-[1.3rem]">
          <figcaption className="text-[0.8rem] font-semibold tracking-[0.18em] text-dim uppercase">The learning gap</figcaption>
          <div className="mt-3 grid min-h-0 flex-1 items-center gap-4 sm:grid-cols-[1fr_auto] lg:gap-[1.2rem]">
            <IsoScene
              className="mx-auto w-full max-w-[24rem]"
              scene={bridge}
              label="Two cliffs joined by a bridge of four coloured blocks: from knowing English to speaking it"
            />
            <div className="flex flex-col gap-2.5 text-[0.9rem] lg:text-[1rem]">
              <p className="leading-tight text-muted">
                <span className="block text-[0.7rem] font-semibold tracking-[0.16em] text-dim uppercase">From</span>
                {problem.gap.from}
              </p>
              <ul className="space-y-1.5 border-l border-line pl-3">
                {problem.gap.bridge.map((label, i) => (
                  <li key={label} className="flex items-center gap-2">
                    <span className="size-3 shrink-0 rounded-[3px]" style={{ background: bridgeColors[i] }} />
                    {label}
                  </li>
                ))}
              </ul>
              <p className="leading-tight font-semibold text-ink">
                <span className="block text-[0.7rem] font-semibold tracking-[0.16em] text-dim uppercase">To</span>
                {problem.gap.to}
              </p>
            </div>
          </div>
        </figure>
      </div>

      <blockquote className="relative mt-5 overflow-hidden rounded-2xl border border-cyan-glow/30 bg-gradient-to-r from-cyan-glow/[0.12] via-violet-glow/[0.08] to-transparent px-5 py-4 lg:mt-[1.4rem] lg:px-[1.8rem] lg:py-[1.2rem]">
        <p className="text-[0.75rem] font-semibold tracking-[0.2em] text-cyan-glow uppercase">Research question</p>
        <p className="mt-1.5 font-display text-[1.3rem] leading-snug font-medium text-ink lg:text-[1.7rem]">“{project.researchQuestion}”</p>
      </blockquote>
    </SlideFrame>
  )
}
