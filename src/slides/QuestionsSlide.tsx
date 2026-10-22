import { useMemo } from 'react'
import { Compass, LayoutGrid, RotateCcw } from 'lucide-react'
import { project } from '../content/project'
import { usePresentation } from '../presentation/context'
import { Button } from '../components/ui/primitives'
import { IsoScene } from '../components/visuals/IsoScene'
import { questionsWorld } from '../components/visuals/scenes'
import { SlideFrame } from './SlideFrame'

export function QuestionsSlide() {
  const { openOverview, openExplore, go } = usePresentation()
  const world = useMemo(() => questionsWorld(), [])
  return (
    <SlideFrame className="items-center justify-center text-center">
      <div className="relative w-full max-w-[18rem] animate-float lg:max-w-[21rem]">
        <div className="absolute inset-[15%] rounded-full bg-violet-glow/15 blur-[3rem]" aria-hidden />
        <IsoScene scene={world} headroom={50} textScale={1.6} label="Original illustration: a small floating island where three players say thank you and ask for questions" />
      </div>
      <h2 className="text-gradient mt-4 font-display text-[2.3rem] leading-tight font-semibold tracking-tight lg:text-[3.2rem]">
        Thank You for Your Attention
      </h2>
      <p className="mt-2 font-display text-[3.2rem] leading-none font-bold tracking-tight text-ink lg:text-[5.2rem]">Questions?</p>
      <p className="mx-auto mt-5 max-w-[52rem] text-[1rem] leading-snug text-muted lg:text-[1.15rem]">{project.title}</p>
      <p className="mt-1 text-[0.95rem] text-dim">
        {project.student} · {project.grade} · {project.school}, {project.city} · Supervisor: {project.supervisor}
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button variant="primary" onClick={openOverview}>
          <LayoutGrid className="size-4" /> Presentation overview
        </Button>
        <Button variant="secondary" onClick={() => openExplore()}>
          <Compass className="size-4" /> Explore Mode
        </Button>
        <Button variant="ghost" onClick={() => go(0)}>
          <RotateCcw className="size-4" /> Back to title
        </Button>
      </div>
    </SlideFrame>
  )
}
