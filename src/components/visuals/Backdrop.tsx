import { memo } from 'react'

// Deep-navy atmosphere: soft colour fields, a faint blueprint grid and stars.
// Pure CSS/SVG, rendered once.

const stars = Array.from({ length: 70 }, (_, i) => {
  const r = (n: number) => {
    const x = Math.sin(i * 9301 + n * 49297) * 233280
    return x - Math.floor(x)
  }
  return { x: r(1) * 100, y: r(2) * 100, s: 0.6 + r(3) * 1.4, o: 0.15 + r(4) * 0.5 }
})

export const Backdrop = memo(function Backdrop() {
  return (
    <div aria-hidden className="no-print pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-navy-950">
      <div className="absolute inset-0 bg-[radial-gradient(60rem_40rem_at_12%_-10%,rgb(124_108_240/0.22),transparent_60%),radial-gradient(55rem_40rem_at_105%_110%,rgb(19_156_194/0.22),transparent_60%),radial-gradient(40rem_30rem_at_70%_20%,rgb(94_231_255/0.07),transparent_70%)]" />
      <div className="hairline-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        {stars.map((s, i) => (
          <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.s} fill="#dfe8ff" opacity={s.o} />
        ))}
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950 to-transparent" />
    </div>
  )
})
