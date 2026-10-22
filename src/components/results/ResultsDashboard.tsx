import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { TriangleAlert } from 'lucide-react'
import { ILLUSTRATIVE_LABEL } from '../../content/illustrative'
import { TOTAL_MAX, TOTAL_MIN } from '../../content/rubric'
import { cn } from '../../lib/dom'
import type { ParticipantResult } from '../../lib/record'
import { fmt, signed, summarise, type ResultsSummary } from '../../lib/stats'

const PRE = 'var(--color-pre)'
const POST = 'var(--color-post)'

function Legend() {
  return (
    <div className="flex items-center gap-4 text-[0.82rem] text-muted">
      <span className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-[3px]" style={{ background: PRE }} /> Pre-test
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-[3px]" style={{ background: POST }} /> Post-test
      </span>
    </div>
  )
}

function Tile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="panel px-4 py-3">
      <p className="text-[0.75rem] font-medium text-dim">{label}</p>
      <p className="mt-1 font-display text-[1.7rem] leading-none font-semibold lg:text-[1.9rem]">{value}</p>
      {sub && <p className="mt-1 text-[0.75rem] text-dim">{sub}</p>}
    </div>
  )
}

function CriteriaChart({ summary }: { summary: ResultsSummary }) {
  const data = summary.criteria.map((c) => ({ name: c.short, full: c.name, pre: +c.preMean.toFixed(2), post: +c.postMean.toFixed(2) }))
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }} barGap={2} barCategoryGap="30%">
        <CartesianGrid vertical={false} stroke="rgb(148 163 255 / 0.12)" />
        <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: 'rgb(148 163 255 / 0.25)' }} tick={{ fill: '#b0bbdd', fontSize: 13 }} />
        <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tickLine={false} axisLine={false} tick={{ fill: '#7d89b3', fontSize: 12 }} />
        <Tooltip
          cursor={{ fill: 'rgb(255 255 255 / 0.04)' }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            const row = payload[0].payload as (typeof data)[number]
            return (
              <div className="rounded-lg border border-line bg-navy-900/95 px-3 py-2 text-[0.82rem] shadow-xl">
                <p className="font-semibold text-ink">{row.full}</p>
                <p className="mt-1 flex items-center gap-2 text-muted">
                  <span className="size-2 rounded-[2px]" style={{ background: PRE }} /> Pre-test mean {fmt(row.pre, 2)}
                </p>
                <p className="flex items-center gap-2 text-muted">
                  <span className="size-2 rounded-[2px]" style={{ background: POST }} /> Post-test mean {fmt(row.post, 2)}
                </p>
              </div>
            )
          }}
        />
        <Bar dataKey="pre" name="Pre-test" fill={PRE} radius={[4, 4, 0, 0]} maxBarSize={24} isAnimationActive={false} />
        <Bar dataKey="post" name="Post-test" fill={POST} radius={[4, 4, 0, 0]} maxBarSize={24} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  )
}

/** Paired pre → post totals per participant on the 4–20 scale. */
function Dumbbell({ summary }: { summary: ResultsSummary }) {
  const [hover, setHover] = useState<string | null>(null)
  const pos = (v: number) => ((v - TOTAL_MIN) / (TOTAL_MAX - TOTAL_MIN)) * 100
  const ticks = [4, 8, 12, 16, 20]
  return (
    <div className="flex h-full flex-col">
      <div className="relative ml-[3.2rem] mr-[3.2rem] h-4 text-[0.7rem] text-dim">
        {ticks.map((t) => (
          <span key={t} className="absolute -translate-x-1/2 tabular-nums" style={{ left: `${pos(t)}%` }}>
            {t}
          </span>
        ))}
      </div>
      <ul className="mt-1 min-h-0 flex-1 space-y-0.5 overflow-y-auto scrollbar-thin">
        {summary.participants.map((p) => {
          const a = pos(Math.min(p.pre, p.post))
          const b = pos(Math.max(p.pre, p.post))
          return (
            <li
              key={p.id}
              onMouseEnter={() => setHover(p.id)}
              onMouseLeave={() => setHover(null)}
              className={cn('flex items-center rounded-md py-1 transition-colors', hover === p.id && 'bg-white/[0.05]')}
              title={`${p.id}: ${p.pre} → ${p.post} (${signed(p.change, 0)})`}
            >
              <span className="w-[3.2rem] shrink-0 pl-1 text-[0.8rem] text-muted tabular-nums">{p.id}</span>
              <span className="relative h-4 flex-1">
                {ticks.map((t) => (
                  <span key={t} className="absolute inset-y-0 w-px bg-white/[0.06]" style={{ left: `${pos(t)}%` }} />
                ))}
                <span className="absolute top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-white/25" style={{ left: `${a}%`, width: `${b - a}%` }} />
                <span
                  className="absolute top-1/2 size-[0.7rem] -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-navy-800"
                  style={{ left: `${pos(p.pre)}%`, background: PRE }}
                />
                <span
                  className="absolute top-1/2 size-[0.7rem] -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-navy-800"
                  style={{ left: `${pos(p.post)}%`, background: POST }}
                />
              </span>
              <span className="w-[3.2rem] shrink-0 text-right text-[0.8rem] text-muted tabular-nums">{signed(p.change, 0)}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function StatsTable({ summary }: { summary: ResultsSummary }) {
  return (
    <table className="w-full text-[0.85rem] tabular-nums">
      <thead>
        <tr className="text-left text-[0.72rem] tracking-wide text-dim uppercase">
          <th className="py-1.5 font-semibold">Criterion (1–5)</th>
          <th className="py-1.5 text-right font-semibold">Pre M (SD)</th>
          <th className="py-1.5 text-right font-semibold">Post M (SD)</th>
          <th className="py-1.5 text-right font-semibold">Change</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/[0.06]">
        {summary.criteria.map((c) => (
          <tr key={c.id}>
            <td className="py-1 text-ink">{c.name}</td>
            <td className="py-1 text-right text-muted">
              {fmt(c.preMean, 2)} ({fmt(c.preSd, 2)})
            </td>
            <td className="py-1 text-right text-muted">
              {fmt(c.postMean, 2)} ({fmt(c.postSd, 2)})
            </td>
            <td className="py-1 text-right text-ink">{signed(c.change, 2)}</td>
          </tr>
        ))}
        <tr className="font-semibold">
          <td className="py-1 text-ink">Total (4–20)</td>
          <td className="py-1 text-right text-ink">
            {fmt(summary.totalPreMean, 2)} ({fmt(summary.totalPreSd, 2)})
          </td>
          <td className="py-1 text-right text-ink">
            {fmt(summary.totalPostMean, 2)} ({fmt(summary.totalPostSd, 2)})
          </td>
          <td className="py-1 text-right text-ink">{signed(summary.meanChange, 2)}</td>
        </tr>
      </tbody>
    </table>
  )
}

export function IllustrativeBanner() {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border-2 border-amber-glow/70 bg-amber-glow/15 px-4 py-2 text-[0.85rem] font-bold tracking-[0.08em] text-amber-50 lg:text-[0.95rem]" role="status">
      <TriangleAlert className="size-5 shrink-0 text-amber-glow" />
      {ILLUSTRATIVE_LABEL}
    </div>
  )
}

export function ResultsDashboard({
  participants,
  illustrative,
  footnote,
  layout = 'slide',
}: {
  participants: ParticipantResult[]
  illustrative: boolean
  footnote?: string
  layout?: 'slide' | 'page'
}) {
  const summary = summarise(participants)
  return (
    <div className="relative flex min-h-0 flex-1 flex-col gap-3 lg:gap-[0.9rem]">
      {illustrative && <IllustrativeBanner />}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-[0.9rem]">
        <Tile label={illustrative ? 'Participants (example)' : 'Participants'} value={`n = ${summary.n}`} />
        <Tile label="Mean total · pre-test" value={fmt(summary.totalPreMean)} sub={`of ${TOTAL_MAX} points`} />
        <Tile label="Mean total · post-test" value={fmt(summary.totalPostMean)} sub={`of ${TOTAL_MAX} points`} />
        <Tile label="Mean change" value={signed(summary.meanChange)} sub={`${summary.improved} higher · ${summary.unchanged} same · ${summary.declined} lower`} />
      </div>

      <div className={cn('grid min-h-0 flex-1 gap-3 lg:gap-[0.9rem]', layout === 'slide' ? 'lg:grid-cols-[1.1fr_1fr]' : 'lg:grid-cols-2')}>
        <section className="panel flex min-h-[18rem] flex-col p-4 lg:min-h-0 lg:py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-[1rem] font-semibold">Mean score by criterion</h3>
            <Legend />
          </div>
          <div className="mt-2 min-h-[12rem] flex-1 lg:min-h-[7rem]">
            <CriteriaChart summary={summary} />
          </div>
          <div className="mt-2 border-t border-line pt-2">
            <StatsTable summary={summary} />
          </div>
        </section>
        <section className="panel flex min-h-[16rem] flex-col p-4 lg:min-h-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-[1rem] font-semibold">Total score per participant (4–20)</h3>
            <Legend />
          </div>
          <div className="mt-2 min-h-0 flex-1">
            <Dumbbell summary={summary} />
          </div>
        </section>
      </div>

      <p className="text-[0.8rem] leading-snug text-dim">
        Descriptive statistics from a one-group pre-test / post-test design (M = mean, SD = standard deviation). Differences
        cannot be attributed to the game activities alone.{footnote ? ` ${footnote}` : ''}
      </p>

      {illustrative && (
        <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden">
          <span className="-rotate-[16deg] font-display text-[4.5rem] font-bold tracking-[0.12em] whitespace-nowrap text-amber-glow/[0.09] lg:text-[6rem]">
            ILLUSTRATIVE
          </span>
        </div>
      )}
    </div>
  )
}
