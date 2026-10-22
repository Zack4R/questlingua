import { useEffect, type ReactNode } from 'react'
import { Printer } from 'lucide-react'
import {
  interviewQuestions,
  observationFields,
  observationIndicators,
  observationScale,
  reflectionPrompts,
  surveyScale,
  surveyStatements,
} from '../content/instruments'
import { Button } from '../components/ui/primitives'
import { SectionHeader } from './sections'

function printInstrument(id: string | null) {
  document.querySelectorAll('[data-instrument]').forEach((el) => el.classList.toggle('print-target', el.getAttribute('data-instrument') === id))
  if (id) document.body.dataset.printOnly = id
  window.print()
}

function Instrument({ id, title, subtitle, children }: { id: string; title: string; subtitle: string; children: ReactNode }) {
  return (
    <section data-instrument={id} className="panel p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-[1.25rem] font-semibold">{title}</h2>
          <p className="mt-0.5 text-[0.9rem] text-muted">{subtitle}</p>
        </div>
        <Button size="sm" variant="ghost" onClick={() => printInstrument(id)} className="no-print">
          <Printer className="size-4" /> Print
        </Button>
      </div>
      {children}
    </section>
  )
}

const line = 'border-b border-dashed border-white/20'

export function InstrumentsSection() {
  useEffect(() => {
    const clear = () => delete document.body.dataset.printOnly
    window.addEventListener('afterprint', clear)
    return () => window.removeEventListener('afterprint', clear)
  }, [])

  return (
    <div>
      <SectionHeader
        eyebrow="Research instruments"
        title="Survey & observation templates"
        actions={
          <Button variant="secondary" onClick={() => printInstrument(null)} className="no-print">
            <Printer className="size-4" /> Print all
          </Button>
        }
      >
        Templates used to collect data. Students are identified by code (S01, S02 …), never by name.
      </SectionHeader>

      <div className="space-y-5">
        <Instrument id="survey" title="Five-point student survey" subtitle="Circle one number for each statement. Administered after the programme.">
          <div className="mb-3 grid grid-cols-2 gap-3 text-[0.9rem] text-muted sm:grid-cols-3">
            <span>
              Student code: <span className={`inline-block w-24 ${line}`} />
            </span>
            <span>
              Date: <span className={`inline-block w-24 ${line}`} />
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left text-[0.92rem]">
              <thead>
                <tr className="border-b border-line text-[0.72rem] tracking-wide text-dim uppercase">
                  <th className="py-2 pr-3 font-semibold">#</th>
                  <th className="py-2 pr-3 font-semibold">Statement</th>
                  {surveyScale.map((s) => (
                    <th key={s.value} className="w-[4.5rem] px-1 py-2 text-center font-semibold">
                      <span className="block text-[1rem] text-ink">{s.value}</span>
                      <span className="block text-[0.62rem] leading-tight normal-case">{s.label}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {surveyStatements.map((st, i) => (
                  <tr key={st}>
                    <td className="py-2.5 pr-3 text-dim tabular-nums">{i + 1}</td>
                    <td className="py-2.5 pr-3">{st}</td>
                    {surveyScale.map((s) => (
                      <td key={s.value} className="px-1 py-2.5 text-center">
                        <span className="inline-grid size-7 place-items-center rounded-full border border-white/25 text-[0.8rem] text-dim">{s.value}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Instrument>

        <Instrument id="observation" title="Structured observation checklist" subtitle="Completed by the observer during a session. Tick one column per indicator.">
          <div className="mb-4 grid gap-3 text-[0.9rem] text-muted sm:grid-cols-3 lg:grid-cols-5">
            {observationFields.map((f) => (
              <span key={f} className="flex flex-col gap-2">
                {f}
                <span className={`h-5 ${line}`} />
              </span>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left text-[0.92rem]">
              <thead>
                <tr className="border-b border-line text-[0.72rem] tracking-wide text-dim uppercase">
                  <th className="py-2 pr-3 font-semibold">Indicator</th>
                  {observationScale.map((s) => (
                    <th key={s} className="w-[7rem] py-2 text-center font-semibold">
                      {s}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {observationIndicators.map((ind) => (
                  <tr key={ind}>
                    <td className="py-2.5 pr-3">{ind}</td>
                    {observationScale.map((s) => (
                      <td key={s} className="py-2.5 text-center">
                        <span className="inline-block size-5 rounded border border-white/25" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[0.9rem] text-muted">Notes / examples of language used:</p>
          <div className="mt-2 space-y-5">
            <div className={line} />
            <div className={line} />
            <div className={line} />
          </div>
        </Instrument>

        <Instrument id="interview" title="Short interview questions" subtitle="5–7 minutes with volunteers after the programme. Answers are noted anonymously.">
          <ol className="space-y-4">
            {interviewQuestions.map((q, i) => (
              <li key={q}>
                <p className="text-[0.98rem]">
                  <span className="mr-2 font-display font-semibold text-cyan-glow tabular-nums">{i + 1}.</span>
                  {q}
                </p>
                <div className={`mt-4 ml-6 ${line}`} />
              </li>
            ))}
          </ol>
        </Instrument>

        <Instrument id="reflection" title="Learner reflection sheet" subtitle="Completed by each student after every mission.">
          <div className="mb-4 grid grid-cols-2 gap-3 text-[0.9rem] text-muted sm:grid-cols-3">
            <span>
              Student code: <span className={`inline-block w-24 ${line}`} />
            </span>
            <span>
              Mission no.: <span className={`inline-block w-16 ${line}`} />
            </span>
          </div>
          <ul className="space-y-4">
            {reflectionPrompts.map((p) => (
              <li key={p} className="flex items-end gap-3 text-[0.98rem]">
                <span className="shrink-0">{p}</span>
                <span className={`flex-1 ${line}`} />
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[0.95rem]">
            How confident did I feel speaking today?{' '}
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} className="mx-1 inline-grid size-7 place-items-center rounded-full border border-white/25 text-[0.8rem] text-dim">
                {n}
              </span>
            ))}
          </p>
        </Instrument>
      </div>
    </div>
  )
}
