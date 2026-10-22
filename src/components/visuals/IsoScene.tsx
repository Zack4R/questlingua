import { useId, useMemo } from 'react'
import { cn } from '../../lib/dom'
import { project, sceneToFaces, type Annotation, type Scene } from './iso'

const toneClass: Record<NonNullable<Annotation['tone']>, string> = {
  cyan: 'border-cyan-glow/50 text-cyan-50 shadow-[0_0_1.2em_-0.2em_rgb(94_231_255/0.55)]',
  violet: 'border-violet-glow/50 text-violet-50 shadow-[0_0_1.2em_-0.2em_rgb(162_151_255/0.55)]',
  mint: 'border-mint-glow/50 text-emerald-50 shadow-[0_0_1.2em_-0.2em_rgb(94_234_212/0.5)]',
  amber: 'border-amber-glow/50 text-amber-50 shadow-[0_0_1.2em_-0.2em_rgb(252_211_77/0.45)]',
  rose: 'border-rose-glow/50 text-rose-50 shadow-[0_0_1.2em_-0.2em_rgb(253_164_175/0.45)]',
}

interface Props {
  scene: Scene
  className?: string
  label: string
  /** extra SVG units of space above the scene (for speech bubbles) */
  headroom?: number
  pad?: number
  /** enlarge bubble text for small scenes */
  textScale?: number
}

export function IsoScene({ scene, className, label, headroom = 0, pad = 12, textScale = 1 }: Props) {
  const k = textScale
  const glowId = useId().replace(/:/g, '')
  const { faces, bounds } = useMemo(() => sceneToFaces(scene), [scene])

  const vb = {
    x: bounds.minX - pad,
    y: bounds.minY - pad - headroom,
    w: bounds.maxX - bounds.minX + pad * 2,
    h: bounds.maxY - bounds.minY + pad * 2 + headroom,
  }

  return (
    <div className={cn('relative [container-type:inline-size]', className)}>
      <svg
        viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
        className="block h-auto w-full overflow-visible"
        role="img"
        aria-label={label}
      >
        <defs>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {faces.map((f) => (
          <g key={f.key} opacity={f.opacity} filter={f.glow ? `url(#${glowId})` : undefined}>
            <polygon points={f.points} fill={f.fill} stroke={f.fill} strokeWidth={0.6} strokeLinejoin="round" />
            {f.eyes?.map(([ex, ey], i) => (
              <rect key={i} x={ex - 1.3} y={ey - 2.2} width={2.6} height={4.4} rx={1} fill="#0b1026" />
            ))}
          </g>
        ))}
      </svg>

      {scene.annotations?.map((a, i) => {
        const [sx, sy] = project(a.x, a.y, a.z)
        const left = ((sx - vb.x) / vb.w) * 100
        const top = ((sy - vb.y) / vb.h) * 100
        const tone = toneClass[a.tone ?? 'cyan']
        if (a.kind === 'marker')
          return (
            <div
              key={i}
              aria-hidden
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-full"
              style={{ left: `${left}%`, top: `${top}%` }}
            >
              <div className="animate-float" style={{ animationDelay: `${a.delay ?? 0}s` }}>
                <div
                  className="grid rotate-45 place-items-center rounded-[0.6cqw] border border-amber-glow/70 bg-amber-300/90 shadow-[0_0_2.5cqw_rgb(252_211_77/0.7)]"
                  style={{ width: `${4.2 * k}cqw`, height: `${4.2 * k}cqw` }}
                >
                  <span className="-rotate-45 font-display leading-none font-bold text-navy-900" style={{ fontSize: `${2.6 * k}cqw` }}>
                    {a.text}
                  </span>
                </div>
              </div>
            </div>
          )
        return (
          <div
            key={i}
            aria-hidden
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-full"
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            <div
              className={cn(
                'animate-pop whitespace-nowrap border bg-navy-900/85 font-display font-medium backdrop-blur-sm',
                a.kind === 'bubble' ? 'relative' : 'rounded-full',
                tone,
              )}
              style={{
                animationDelay: `${0.6 + (a.delay ?? i * 0.25)}s`,
                fontSize: `${(a.kind === 'bubble' ? 2.15 : 1.8) * k}cqw`,
                padding: a.kind === 'bubble' ? `${0.8 * k}cqw ${1.6 * k}cqw` : `${0.5 * k}cqw ${1.3 * k}cqw`,
                borderRadius: a.kind === 'bubble' ? `${1.2 * k}cqw` : undefined,
              }}
            >
              {a.text}
              {a.kind === 'bubble' && (
                <span
                  className="absolute -bottom-[0.6cqw] left-1/2 size-[1.1cqw] -translate-x-1/2 rotate-45 border-r border-b bg-navy-900"
                  style={{ borderColor: 'inherit' }}
                />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
