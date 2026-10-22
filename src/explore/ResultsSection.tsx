import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { Download, Eye, EyeOff, FileUp, Plus, RotateCcw, Save, ShieldCheck, Trash, TriangleAlert, X } from 'lucide-react'
import { illustrativeParticipants } from '../content/illustrative'
import { criteria, SCORE_MAX, SCORE_MIN, type CriterionId } from '../content/rubric'
import { cn, downloadText } from '../lib/dom'
import { parseRecord, useResearchRecord, type ParticipantResult } from '../lib/record'
import { total } from '../lib/stats'
import { Badge, Button } from '../components/ui/primitives'
import { ResultsDashboard } from '../components/results/ResultsDashboard'
import { SectionHeader } from './sections'

type DraftScores = Record<CriterionId, number | ''>
interface DraftRow {
  key: number
  id: string
  pre: DraftScores
  post: DraftScores
}

const emptyScores = (): DraftScores => ({ vocabulary: '', grammar: '', fluency: '', interaction: '' })
let keySeq = 1
const toDraft = (p: ParticipantResult): DraftRow => ({ key: keySeq++, id: p.id, pre: { ...p.pre }, post: { ...p.post } })
const nextCode = (rows: DraftRow[]) => {
  let n = rows.length + 1
  const used = new Set(rows.map((r) => r.id))
  while (used.has(`S${String(n).padStart(2, '0')}`)) n++
  return `S${String(n).padStart(2, '0')}`
}

function ScoreSelect({ value, onChange, label }: { value: number | ''; onChange: (v: number | '') => void; label: string }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
      aria-label={label}
      className={cn(
        'h-9 w-[3.3rem] rounded-md border bg-navy-950/70 px-1.5 text-center text-[0.92rem] tabular-nums focus:border-cyan-glow/60 focus:outline-none',
        value === '' ? 'border-line text-dim' : 'border-white/20 text-ink',
      )}
    >
      <option value="">–</option>
      {Array.from({ length: SCORE_MAX - SCORE_MIN + 1 }, (_, i) => SCORE_MIN + i).map((n) => (
        <option key={n} value={n}>
          {n}
        </option>
      ))}
    </select>
  )
}

function Editor({ onDone }: { onDone: () => void }) {
  const { record, saveRecord } = useResearchRecord()
  const existing = record.results
  const [rows, setRows] = useState<DraftRow[]>(() =>
    existing?.participants.length ? existing.participants.map(toDraft) : [{ key: keySeq++, id: 'S01', pre: emptyScores(), post: emptyScores() }],
  )
  const [verifiedBy, setVerifiedBy] = useState(existing?.verifiedBy ?? '')
  const [verifiedOn, setVerifiedOn] = useState(existing?.verifiedOn ?? '')
  const [note, setNote] = useState(existing?.note ?? '')
  const [confirmed, setConfirmed] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const update = (key: number, patch: (r: DraftRow) => DraftRow) => setRows((rs) => rs.map((r) => (r.key === key ? patch(r) : r)))

  const save = () => {
    const candidate = {
      ...record,
      results: { verified: true, verifiedBy, verifiedOn, note, participants: rows.map((r) => ({ id: r.id, pre: r.pre, post: r.post })) },
    }
    const parsed = parseRecord(candidate)
    if (!parsed.record) return setErrors(parsed.errors)
    if (!confirmed) return setErrors(['Please confirm that these are actual, verified scores from the study.'])
    setErrors([])
    saveRecord(parsed.record)
    onDone()
  }

  return (
    <section className="panel p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-[1.25rem] font-semibold">Enter verified scores</h2>
          <p className="mt-1 max-w-[46rem] text-[0.9rem] text-muted">
            One row per participant (code only, no names). Each criterion is scored {SCORE_MIN}–{SCORE_MAX}. Enter only scores that come from the real
            pre-test and post-test and have been checked.
          </p>
        </div>
        <Button size="sm" variant="ghost" onClick={onDone}>
          <X className="size-4" /> Cancel
        </Button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[54rem] text-left text-[0.88rem]">
          <thead>
            <tr className="text-[0.7rem] tracking-wide text-dim uppercase">
              <th className="py-1.5 pr-2 font-semibold">Code</th>
              <th colSpan={4} className="border-l border-line px-2 py-1.5 font-semibold text-violet-200">
                Pre-test
              </th>
              <th colSpan={4} className="border-l border-line px-2 py-1.5 font-semibold text-cyan-100">
                Post-test
              </th>
              <th className="border-l border-line px-2 py-1.5 text-right font-semibold">Totals</th>
              <th />
            </tr>
            <tr className="text-[0.7rem] text-dim">
              <th />
              {['pre', 'post'].map((t) =>
                criteria.map((c, i) => (
                  <th key={t + c.id} className={cn('px-1 pb-2 font-medium', i === 0 && 'border-l border-line pl-2')}>
                    {c.short}
                  </th>
                )),
              )}
              <th className="border-l border-line" />
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const complete = criteria.every((c) => r.pre[c.id] !== '' && r.post[c.id] !== '')
              return (
                <tr key={r.key} className="border-t border-white/[0.05]">
                  <td className="py-1.5 pr-2">
                    <input
                      value={r.id}
                      onChange={(e) => update(r.key, (x) => ({ ...x, id: e.target.value.toUpperCase().slice(0, 8) }))}
                      className="h-9 w-[5rem] rounded-md border border-white/20 bg-navy-950/70 px-2 text-[0.92rem] uppercase focus:border-cyan-glow/60 focus:outline-none"
                      aria-label="Participant code"
                    />
                  </td>
                  {(['pre', 'post'] as const).map((t) =>
                    criteria.map((c, i) => (
                      <td key={t + c.id} className={cn('px-1 py-1.5', i === 0 && 'border-l border-line pl-2')}>
                        <ScoreSelect
                          value={r[t][c.id]}
                          label={`${r.id} ${t}-test ${c.name}`}
                          onChange={(v) => update(r.key, (x) => ({ ...x, [t]: { ...x[t], [c.id]: v } }))}
                        />
                      </td>
                    )),
                  )}
                  <td className="border-l border-line px-2 py-1.5 text-right text-muted tabular-nums">
                    {complete
                      ? `${total(r.pre as Record<CriterionId, number>)} → ${total(r.post as Record<CriterionId, number>)}`
                      : '—'}
                  </td>
                  <td className="py-1.5 pl-1">
                    <button
                      type="button"
                      onClick={() => setRows((rs) => rs.filter((x) => x.key !== r.key))}
                      disabled={rows.length === 1}
                      className="grid size-8 cursor-pointer place-items-center rounded-md text-dim hover:bg-white/10 hover:text-rose-200 disabled:cursor-default disabled:opacity-30"
                      aria-label={`Remove ${r.id}`}
                    >
                      <Trash className="size-4" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="mt-2"
        onClick={() => setRows((rs) => [...rs, { key: keySeq++, id: nextCode(rs), pre: emptyScores(), post: emptyScores() }])}
      >
        <Plus className="size-4" /> Add participant
      </Button>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <label className="block text-[0.85rem] text-muted">
          Verified by (name / role)
          <input
            value={verifiedBy}
            onChange={(e) => setVerifiedBy(e.target.value)}
            placeholder="e.g. Supervisor"
            className="mt-1 h-10 w-full rounded-md border border-white/20 bg-navy-950/70 px-3 text-[0.95rem] text-ink placeholder:text-dim focus:border-cyan-glow/60 focus:outline-none"
          />
        </label>
        <label className="block text-[0.85rem] text-muted">
          Date of verification
          <input
            type="date"
            value={verifiedOn}
            onChange={(e) => setVerifiedOn(e.target.value)}
            className="mt-1 h-10 w-full rounded-md border border-white/20 bg-navy-950/70 px-3 text-[0.95rem] text-ink focus:border-cyan-glow/60 focus:outline-none"
          />
        </label>
        <label className="block text-[0.85rem] text-muted">
          Note (optional)
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. one rater, recorded tests"
            className="mt-1 h-10 w-full rounded-md border border-white/20 bg-navy-950/70 px-3 text-[0.95rem] text-ink placeholder:text-dim focus:border-cyan-glow/60 focus:outline-none"
          />
        </label>
      </div>

      <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-amber-glow/40 bg-amber-glow/[0.07] p-3 text-[0.92rem] text-amber-50">
        <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5 size-4 accent-[var(--color-amber-glow)]" />
        I confirm that these are actual, verified pre-test and post-test scores from this study — not examples or estimates.
      </label>

      {errors.length > 0 && (
        <ul className="mt-3 space-y-1 rounded-xl border border-rose-glow/40 bg-rose-glow/[0.08] p-3 text-[0.88rem] text-rose-100" role="alert">
          {errors.slice(0, 6).map((e) => (
            <li key={e}>• {e}</li>
          ))}
          {errors.length > 6 && <li>… and {errors.length - 6} more.</li>}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" onClick={save}>
          <Save className="size-4" /> Save verified results
        </Button>
      </div>
    </section>
  )
}

export function ResultsSection() {
  const { record, source, hasVerifiedResults, saveRecord, resetToFile, exportJson, fileRecord } = useResearchRecord()
  const [editing, setEditing] = useState(false)
  const [preview, setPreview] = useState(false)
  const [importMsg, setImportMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const results = record.results
  const fileHasData = !!fileRecord.results || fileRecord.completedSessions.length > 0

  const onImport = async (file: File) => {
    try {
      const parsed = parseRecord(JSON.parse(await file.text()))
      if (!parsed.record) return setImportMsg({ ok: false, text: parsed.errors.slice(0, 3).join(' ') })
      saveRecord(parsed.record)
      setImportMsg({ ok: true, text: `Imported “${file.name}”.` })
    } catch {
      setImportMsg({ ok: false, text: 'This file is not valid JSON.' })
    }
  }

  return (
    <div>
      <SectionHeader
        eyebrow="Results"
        title="Verified research results"
        actions={
          <div className="flex flex-wrap gap-2">
            <Badge tone={hasVerifiedResults ? 'mint' : 'neutral'}>{hasVerifiedResults ? 'Verified data available' : 'No verified data'}</Badge>
            <Badge tone="neutral">Source: {source === 'file' ? 'project file' : 'this device'}</Badge>
          </div>
        }
      >
        The presentation only shows results that have been entered and confirmed as verified. Example data is always labelled as illustrative.
      </SectionHeader>

      {editing ? (
        <Editor onDone={() => setEditing(false)} />
      ) : hasVerifiedResults && results ? (
        <div className="flex min-h-[44rem] flex-col">
          <ResultsDashboard
            participants={results.participants}
            illustrative={false}
            layout="page"
            footnote={`Verified by ${results.verifiedBy} on ${results.verifiedOn}${results.note ? ` — ${results.note}` : ''}.`}
          />
        </div>
      ) : preview ? (
        <div className="flex min-h-[44rem] flex-col">
          <ResultsDashboard participants={illustrativeParticipants} illustrative layout="page" />
        </div>
      ) : (
        <section className="panel flex flex-col items-center px-6 py-12 text-center">
          <ShieldCheck className="size-10 text-cyan-glow" />
          <h2 className="mt-3 font-display text-[1.4rem] font-semibold">No verified results yet</h2>
          <p className="mt-2 max-w-[40rem] text-[0.95rem] text-muted">
            When the post-test has been completed and the scores have been checked, enter them here (or import a record file). Nothing is shown in the
            presentation until then.
          </p>
        </section>
      )}

      {!editing && (
        <section className="panel mt-5 p-5">
          <h2 className="font-display text-[1.1rem] font-semibold">Manage the research record</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="subtle" onClick={() => setEditing(true)}>
              <Plus className="size-4" /> {hasVerifiedResults ? 'Edit verified results' : 'Enter verified results'}
            </Button>
            {!hasVerifiedResults && (
              <Button variant="secondary" onClick={() => setPreview((p) => !p)}>
                {preview ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                {preview ? 'Hide illustrative preview' : 'Preview with illustrative data'}
              </Button>
            )}
            <Button variant="secondary" onClick={() => downloadText('research-record.json', exportJson())}>
              <Download className="size-4" /> Export record (JSON)
            </Button>
            <Button variant="secondary" onClick={() => fileInput.current?.click()}>
              <FileUp className="size-4" /> Import record
            </Button>
            <input
              ref={fileInput}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) void onImport(f)
                e.target.value = ''
              }}
            />
            {hasVerifiedResults && (
              <Button
                variant="ghost"
                onClick={() => {
                  if (window.confirm('Remove the verified results from this device? Confirmed sessions are kept.')) saveRecord({ ...record, results: null })
                }}
              >
                <Trash className="size-4" /> Remove results
              </Button>
            )}
            {source === 'device' && (
              <Button
                variant="ghost"
                onClick={() => {
                  if (window.confirm('Discard everything entered on this device and use the project file again?')) resetToFile()
                }}
              >
                <RotateCcw className="size-4" /> Use project file{fileHasData ? '' : ' (empty)'}
              </Button>
            )}
          </div>
          {importMsg && (
            <p className={cn('mt-3 flex items-center gap-2 text-[0.9rem]', importMsg.ok ? 'text-emerald-200' : 'text-rose-200')} role="status">
              {!importMsg.ok && <TriangleAlert className="size-4" />}
              {importMsg.text}
            </p>
          )}
          <p className="mt-4 text-[0.85rem] leading-relaxed text-dim">
            Data entered here is stored only in this browser. To make it permanent for every device, export the record, replace{' '}
            <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[0.8rem] text-muted">src/content/research-record.json</code> with it and redeploy
            the site. Completed sessions are confirmed in the{' '}
            <Link to="/explore/timeline" className="text-cyan-100 underline decoration-cyan-glow/40 underline-offset-2">
              timeline
            </Link>
            .
          </p>
        </section>
      )}
    </div>
  )
}
