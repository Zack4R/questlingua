import { useMemo } from 'react'
import { Compass, Play } from 'lucide-react'
import { project } from '../content/project'
import { usePresentation } from '../presentation/context'
import { Button, Kbd } from '../components/ui/primitives'
import { IsoScene } from '../components/visuals/IsoScene'
import { miniIsland, titleWorld } from '../components/visuals/scenes'
import { SlideFrame } from './SlideFrame'
import robloxLogo from '../assets/roblox-logo.png'
import robloxBanner from '../assets/roblox-banner.webp'

export function TitleSlide() {
  const { startPresentation, openExplore } = usePresentation()
  const world = useMemo(() => titleWorld(), [])
  const minis = useMemo(() => [miniIsland('crystal'), miniIsland('tree'), miniIsland('chest')], [])

  return (
    <SlideFrame className="justify-center">
      <div className="grid items-center gap-8 lg:h-full lg:grid-cols-[1.02fr_1fr] lg:gap-[3rem]">
        <div className="stagger order-2 lg:order-1">
          <div className="flex items-center gap-3">
            <span className="grid size-[2.4rem] place-items-center rounded-xl border border-cyan-glow/40 bg-cyan-glow/10 shadow-[0_0_1.5rem_-0.3rem_rgb(94_231_255/0.6)]">
              <svg viewBox="0 0 64 64" className="size-[1.5rem]" aria-hidden>
                <path d="M32 8 53 20v24L32 56 11 44V20z" fill="none" stroke="#5ee7ff" strokeWidth="5" strokeLinejoin="round" />
                <circle cx="32" cy="32" r="6" fill="#a297ff" />
              </svg>
            </span>
            <p className="font-display text-[1.05rem] font-semibold tracking-[0.3em] text-ink uppercase">{project.brand}</p>
            <span className="hidden h-px w-12 bg-gradient-to-r from-cyan-glow/60 to-transparent sm:block" />
            <p className="hidden text-[0.85rem] tracking-[0.2em] text-dim uppercase sm:block">Scientific research project</p>
          </div>

          <h1 className="text-gradient mt-6 font-display text-[2.1rem] leading-[1.06] font-semibold tracking-tight text-balance sm:text-[2.6rem] lg:text-[3.15rem]">
            {project.title}
          </h1>

          <dl className="mt-7 grid max-w-[44rem] grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-6 text-[0.95rem] lg:text-[1.05rem]">
            <div>
              <dt className="text-[0.75rem] font-semibold tracking-[0.18em] text-dim uppercase">Author</dt>
              <dd className="mt-1 font-display text-[1.25rem] font-semibold text-ink lg:text-[1.4rem]">{project.student}</dd>
              <dd className="text-muted">{project.grade}</dd>
            </div>
            <div>
              <dt className="text-[0.75rem] font-semibold tracking-[0.18em] text-dim uppercase">Supervisor</dt>
              <dd className="mt-1 font-display text-[1.25rem] font-semibold text-ink lg:text-[1.4rem]">{project.supervisor}</dd>
            </div>
            <div>
              <dt className="text-[0.75rem] font-semibold tracking-[0.18em] text-dim uppercase">School</dt>
              <dd className="mt-1 text-ink">
                {project.school} · {project.city}
              </dd>
            </div>
            <div>
              <dt className="text-[0.75rem] font-semibold tracking-[0.18em] text-dim uppercase">Game platform</dt>
              <dd className="mt-1 flex items-center gap-2 text-ink">
                <img src={robloxLogo} alt="Roblox logo" className="size-[1.6rem] rounded-md" />
                Roblox
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button variant="primary" size="lg" onClick={startPresentation}>
              <Play className="size-5 fill-current" /> Start Presentation
            </Button>
            <Button variant="secondary" size="lg" onClick={() => openExplore()}>
              <Compass className="size-5" /> Explore Mode
            </Button>
          </div>
          <p className="mt-5 hidden text-[0.85rem] text-dim lg:block">
            <Kbd>→</Kbd> / <Kbd>Space</Kbd> next · <Kbd>F</Kbd> fullscreen · <Kbd>O</Kbd> overview · <Kbd>?</Kbd> all shortcuts
          </p>
        </div>

        <div className="relative order-1 mx-auto w-full max-w-[34rem] lg:order-2 lg:max-w-none">
          <div className="absolute inset-[12%] rounded-full bg-cyan-glow/10 blur-[4rem]" aria-hidden />
          <div className="relative animate-float">
            <IsoScene
              scene={world}
              headroom={60}
              label="Original illustration: a floating voxel island where four players meet and talk in English"
            />
          </div>
          <div className="pointer-events-none absolute -top-[2%] left-[2%] w-[16%] animate-float [animation-delay:-2s]" aria-hidden>
            <IsoScene scene={minis[0]} label="" />
          </div>
          <div className="pointer-events-none absolute top-[6%] right-[0%] w-[13%] animate-float [animation-delay:-4s]" aria-hidden>
            <IsoScene scene={minis[1]} label="" />
          </div>
          <figure className="absolute bottom-[1%] left-[-2%] w-[36%] -rotate-[4deg] overflow-hidden rounded-xl border border-white/20 bg-navy-900 shadow-[0_1.2rem_2.5rem_-0.8rem_rgb(0_0_0/0.8)]">
            <img src={robloxBanner} alt="Roblox game world with player avatars" className="block aspect-[16/9] w-full object-cover" />
            <figcaption className="flex items-center gap-1.5 px-2 py-1 text-[0.65rem] font-semibold tracking-wide text-muted">
              <img src={robloxLogo} alt="" className="size-3.5 rounded-sm" /> Roblox
            </figcaption>
          </figure>
          <div className="pointer-events-none absolute right-[8%] bottom-[2%] w-[11%] animate-float [animation-delay:-1s]" aria-hidden>
            <IsoScene scene={minis[2]} label="" />
          </div>
        </div>
      </div>
    </SlideFrame>
  )
}
