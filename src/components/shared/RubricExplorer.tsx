import { useState } from 'react'
import { BookA, Mic2, RotateCcw, Spline, Users } from 'lucide-react'
import { criteria, scaleLabels, TOTAL_MAX, type CriterionId } from '../../content/rubric'
import { cn } from '../../lib/dom'
import { Badge } from '../ui/primitives'

export const criterionIcons: Record<CriterionId, typeof BookA> = {
  vocabulary: BookA,
  grammar: Spline,
  fluency: Mic2,
  interaction: Users,
}
export const criterionColors: Record<CriterionId, string> = {
  vocabulary: '#5ee7ff',
  grammar: '#a297ff',
  fluency: '#5eead4',
  interaction: '#fcd34d',
}

/** Interactive rubric: select a score per criterion to read its descriptor and see the total out of 20. */
export function RubricExplorer({ compact = false }: { compact?: boolean }) {
  const [scores, setScores] = useState<Partial<Record<CriterionId, number>>>({})
  const [focus, setFocus] = useState<{ id: CriterionId; score: number }>({ id: 'vocabulary', score: 3 })
  const chosen = criteria.filter((c) => scores[c.id] !== undefined)
  const total = chosen.reduce((s, c) => s + (scores[c.id] ?? 0), 0)
  const focusCriterion = criteria.find((c) => c.id === focus.id)!

  return (
    <div className={cn('grid gap-4', !compact && 'lg:h-full lg:grid-cols-[1.35fr_1fr] lg:gap-[1.2rem]')}>
      <div className="panel flex flex-col justify-center overflow-x-auto p-3 lg:p-[1rem]">
        <table className="w-full min-w-[34rem] table-fixed border-separate border-spacing-[0.35rem] text-left">
          <colgroup>
            <col className="w-[38%]" />
            {[1, 2, 3, 4, 5].map((n) => (
              <col key={n} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th className="pb-1 text-[0.75rem] font-semibold tracking-[0.16em] text-dim uppercase">Criterion</th>
              {[1, 2, 3, 4, 5].map((n) => (
                <th key={n} className="pb-1 text-center">
                  <span className="block font-display text-[1.3rem] leading-none font-semibold">{n}</span>
                  <span className="mt-1 block truncate text-[0.68rem] font-medium tracking-wide text-dim uppercase">{scaleLabels[n]}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {criteria.map((c) => {
              const Icon = criterionIcons[c.id]
              const color = criterionColors[c.id]
              return (
                <tr key={c.id}>
                  <th scope="row" className="pr-2">
                    <span className="flex items-center gap-2.5">
                      <span className="grid size-[2.2rem] shrink-0 place-items-center rounded-lg" style={{ background: `${color}1f`, color }}>
                        <Icon className="size-[1.1rem]" />
                      </span>
                      <span className="font-display text-[1rem] leading-tight font-semibold lg:text-[1.12rem]">{c.name}</span>
                    </span>
                  </th>
                  {[1, 2, 3, 4, 5].map((n) => {
                    const selected = scores[c.id] === n
                    const focused = focus.id === c.id && focus.score === n
                    return (
                      <td key={n} className="p-0">
                        <button
                          type="button"
                          onClick={() => {
                            setScores((s) => ({ ...s, [c.id]: n }))
                            setFocus({ id: c.id, score: n })
                          }}
                          onMouseEnter={() => setFocus({ id: c.id, score: n })}
                          onFocus={() => setFocus({ id: c.id, score: n })}
                          aria-pressed={selected}
                          aria-label={`${c.name}: score ${n}`}
                          className={cn(
                            'h-[2.6rem] w-full cursor-pointer rounded-lg border font-display text-[1rem] font-semibold tabular-nums transition lg:h-[3.3rem] lg:text-[1.15rem]',
                            selected ? 'text-navy-950' : focused ? 'border-white/40 bg-white/10 text-ink' : 'border-line bg-white/[0.025] text-dim hover:text-ink',
                          )}
                          style={
                            selected
                              ? { background: color, borderColor: color, boxShadow: `0 0 1.2rem -0.3rem ${color}` }
                              : { background: !focused ? `color-mix(in srgb, ${color} ${n * 4}%, transparent)` : undefined }
                          }
                        >
                          {n}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:grid-rows-[1fr_auto] lg:gap-[1rem]">
        <div className="panel p-4 lg:p-[1.3rem]" aria-live="polite">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[0.75rem] font-semibold tracking-[0.16em] uppercase" style={{ color: criterionColors[focus.id] }}>
              {focusCriterion.name}
            </p>
            <Badge tone="neutral">
              Score {focus.score} · {scaleLabels[focus.score]}
            </Badge>
          </div>
          <p className="mt-2 text-[0.85rem] text-dim">{focusCriterion.question}</p>
          <p className="mt-2 font-display text-[1.15rem] leading-snug text-ink lg:text-[1.4rem]">{focusCriterion.descriptors[focus.score - 1]}</p>
        </div>

        <div className="panel p-4 lg:p-[1.2rem]">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[0.75rem] font-semibold tracking-[0.16em] text-dim uppercase">Total score</p>
              <p className="mt-1 font-display text-[2.6rem] leading-none font-semibold">
                {chosen.length === criteria.length ? total : '—'}
                <span className="text-[1.3rem] text-dim"> / {TOTAL_MAX}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setScores({})}
              disabled={!chosen.length}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-[0.8rem] text-dim transition hover:text-ink disabled:cursor-default disabled:opacity-40"
            >
              <RotateCcw className="size-3.5" /> Clear
            </button>
          </div>
          {/* 4 criteria × 5 points */}
          <div className="mt-3 flex gap-[3px]" aria-hidden>
            {criteria.map((c) =>
              [1, 2, 3, 4, 5].map((n) => (
                <span
                  key={`${c.id}${n}`}
                  className="h-2.5 flex-1 first:rounded-l-full last:rounded-r-full"
                  style={{ background: (scores[c.id] ?? 0) >= n ? criterionColors[c.id] : 'rgb(255 255 255 / 0.07)' }}
                />
              )),
            )}
          </div>
          <p className="mt-2 text-[0.8rem] text-dim">
            {chosen.length === criteria.length ? '4 criteria × 1–5 points.' : 'Select one score in each row to practise scoring.'} Practice only — not research data.
          </p>
        </div>
      </div>
    </div>
  )
}
