import { useRef, useState, type ReactNode } from 'react'
import { Maximize, Pause, Play, Video, Volume2 } from 'lucide-react'
import { cn, formatClock } from '../../lib/dom'
import { SURVEY_VIDEO } from '../../lib/mediaCache'
import { useSlideKeys } from '../../presentation/context'
import { Badge, Button } from '../ui/primitives'

/** Classroom recording of the questionnaire (Сауалнама), shown on the Results slide for the jury. */
export function SurveyVideo({ footer }: { footer?: ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const toggle = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused || v.ended) void v.play()
    else v.pause()
  }
  const fullscreen = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) void v.play()
    void v.requestFullscreen?.()
  }
  const seek = (fraction: number) => {
    const v = videoRef.current
    if (!v || !duration) return
    v.currentTime = Math.min(duration, Math.max(0, fraction * duration))
  }

  // Space plays / pauses only while the video or its buttons have focus (or it is full screen);
  // arrows and the clicker keep moving between slides.
  useSlideKeys((e) => {
    const v = videoRef.current
    if (!v) return false
    const inFullscreen = document.fullscreenElement === v
    const focused = inFullscreen || !!panelRef.current?.contains(document.activeElement)
    if (focused && e.key === ' ') return toggle(), true
    if (inFullscreen && e.key === 'ArrowRight') return (v.currentTime = Math.min(v.duration, v.currentTime + 5)), true
    if (inFullscreen && e.key === 'ArrowLeft') return (v.currentTime = Math.max(0, v.currentTime - 5)), true
    return false
  })

  const progress = duration ? time / duration : 0

  return (
    <div ref={panelRef} className="panel relative flex flex-1 flex-col gap-6 overflow-hidden p-5 sm:p-7 lg:min-h-0 lg:flex-row lg:items-stretch lg:gap-[3rem] lg:p-[1.6rem]">
      <div className="hairline-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(circle_at_30%_50%,black,transparent_75%)]" aria-hidden />

      <div className="relative mx-auto aspect-[9/16] w-full max-w-[19rem] shrink-0 lg:mx-0 lg:h-full lg:w-auto lg:max-w-none">
        <div
          className={cn(
            'absolute -inset-5 rounded-[2.4rem] bg-gradient-to-b from-cyan-glow/35 via-violet-glow/25 to-transparent blur-2xl transition-opacity duration-700',
            playing ? 'opacity-90' : 'opacity-50',
          )}
          aria-hidden
        />
        <div className="relative size-full overflow-hidden rounded-[1.6rem] border border-white/15 bg-black shadow-[0_2rem_4rem_-1.5rem_rgb(0_0_0/0.8)]">
          <video
            ref={videoRef}
            src={`${SURVEY_VIDEO}#t=0.1`}
            className="size-full object-cover"
            preload="metadata"
            playsInline
            controls={started}
            aria-label="Сауалнама — questionnaire video"
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            onPlay={() => {
              setStarted(true)
              setPlaying(true)
            }}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
          />
          {!started && (
            <button
              type="button"
              onClick={toggle}
              className="group absolute inset-0 grid cursor-pointer place-items-center bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-navy-950/30"
              aria-label="Play the Сауалнама video"
            >
              <span className="relative grid size-[4.75rem] place-items-center rounded-full border border-white/30 bg-white/15 backdrop-blur-md transition duration-300 group-hover:scale-105 group-hover:bg-white/25">
                <span className="absolute inset-0 animate-pulse-ring rounded-full border border-cyan-glow/60" aria-hidden />
                <Play className="ml-1 size-[2rem] fill-white text-white" />
              </span>
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 pb-4 text-[0.85rem] font-semibold text-white/90">
                <span>Сауалнама</span>
                {duration > 0 && <span className="tabular-nums">{formatClock(duration * 1000)}</span>}
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="relative flex min-w-0 flex-1 flex-col justify-center lg:max-w-[40rem]">
        <Badge tone="violet" className="self-start">
          <Video className="size-3.5" /> Video record
        </Badge>
        <h3 className="mt-4 font-display text-[2.6rem] leading-none font-semibold tracking-tight lg:text-[3.6rem]">
          <span className="text-gradient">Сауалнама</span>
        </h3>
        <p className="mt-2 font-display text-[0.95rem] font-semibold tracking-[0.2em] text-dim uppercase">Questionnaire</p>
        <p className="mt-5 max-w-[34rem] text-[1rem] leading-relaxed text-muted lg:text-[1.15rem]">
          A classroom recording of the questionnaire carried out with the students as part of the study.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Button variant="primary" size="lg" onClick={toggle}>
            {playing ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current" />}
            {playing ? 'Pause' : started ? 'Continue' : 'Play video'}
          </Button>
          <Button variant="secondary" size="lg" onClick={fullscreen}>
            <Maximize className="size-5" /> Full screen
          </Button>
        </div>

        <div className="mt-6 max-w-[34rem]">
          <div
            role="progressbar"
            aria-label="Video progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            className="group relative h-2 cursor-pointer rounded-full bg-white/10"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              seek((e.clientX - r.left) / r.width)
            }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-300 to-violet-300 shadow-[0_0_1rem_rgb(94_231_255/0.5)]"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[0.85rem] text-dim">
            <span className="tabular-nums">
              {formatClock(time * 1000)} / {duration ? formatClock(duration * 1000) : '–:––'}
            </span>
            <span className="flex items-center gap-1.5">
              <Volume2 className="size-4" /> Sound on
            </span>
          </div>
        </div>

        {footer && <div className="mt-8 flex flex-wrap gap-2">{footer}</div>}
      </div>
    </div>
  )
}
