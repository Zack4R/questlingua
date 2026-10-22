import { useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Check, Search, Volume2 } from 'lucide-react'
import { phraseGroups } from '../content/findYourWay'
import { missions } from '../content/missions'
import {
  methods,
  oralTestFormat,
  procedure,
  programme,
  researchDesign,
  sessions,
} from '../content/methodology'
import { aim, hypothesis, objectives, problem, project } from '../content/project'
import { references, referencesNote } from '../content/references'
import { criteria, scaleLabels, TOTAL_MAX, TOTAL_MIN } from '../content/rubric'
import { safetyItems } from '../content/safety'
import { cn } from '../lib/dom'
import { useResearchRecord } from '../lib/record'
import { speak, useSpeechAvailable } from '../lib/speech'
import { Badge, IconTile } from '../components/ui/primitives'
import { MissionDetail } from '../components/shared/MissionDetail'
import { ProgrammeTimeline, SessionLegend } from '../components/shared/ProgrammeTimeline'
import { criterionColors, RubricExplorer } from '../components/shared/RubricExplorer'
import { methodIcons, safetyIcons } from '../components/shared/icons'
import robloxBanner from '../assets/roblox-banner.webp'
import robloxLogo from '../assets/roblox-logo.png'

export function SectionHeader({ eyebrow, title, children, actions }: { eyebrow: string; title: string; children?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-[52rem]">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-1.5 font-display text-[1.9rem] leading-tight font-semibold tracking-tight sm:text-[2.2rem]">{title}</h1>
        {children && <div className="mt-2 text-[1rem] leading-relaxed text-muted">{children}</div>}
      </div>
      {actions}
    </header>
  )
}

// ── Overview ───────────────────────────────────────────────────────────────
export function OverviewSection() {
  const links = [
    ['missions', 'All eight missions', 'Objectives, phrases and communication tasks'],
    ['vocabulary', 'Vocabulary & phrases', 'Every target phrase, with pronunciation'],
    ['timeline', 'Eight-week timeline', 'Planned vs. confirmed sessions'],
    ['methodology', 'Methodology', 'Design, methods, test format'],
    ['rubric', 'Assessment rubric', 'Four criteria · 1–5 · 20 points'],
    ['instruments', 'Survey & observation', 'Printable research instruments'],
    ['results', 'Verified results', 'Dashboard and data entry'],
    ['safety', 'Safety', 'How students are protected'],
    ['references', 'References', 'Background literature'],
  ] as const
  return (
    <div>
      <SectionHeader eyebrow="Explore Mode" title="Research at a glance">
        Everything behind the presentation, organised for the judging panel.
      </SectionHeader>
      <figure className="panel relative mb-5 overflow-hidden">
        <img src={robloxBanner} alt="Roblox game world with player avatars" className="block h-[14rem] w-full object-cover sm:h-[18rem]" />
        <figcaption className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-navy-950/95 to-transparent px-5 pt-10 pb-4">
          <img src={robloxLogo} alt="Roblox logo" className="size-10 rounded-lg" />
          <span className="text-[0.95rem] text-ink">Game platform used in the research: Roblox</span>
        </figcaption>
      </figure>
      <section className="panel p-6">
        <h2 className="font-display text-[1.45rem] leading-snug font-semibold text-balance">{project.title}</h2>
        <dl className="mt-4 grid gap-4 text-[0.95rem] sm:grid-cols-4">
          {[
            ['Author', `${project.student}, ${project.grade}`],
            ['School', `${project.school}, ${project.city}`],
            ['Supervisor', project.supervisor],
            ['Design', researchDesign.name],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[0.72rem] font-semibold tracking-[0.16em] text-dim uppercase">{k}</dt>
              <dd className="mt-1 text-ink">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-5 grid gap-4 border-t border-line pt-5 md:grid-cols-2">
          <div>
            <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-cyan-glow uppercase">Research question</p>
            <p className="mt-1 font-display text-[1.15rem] leading-snug">“{project.researchQuestion}”</p>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{problem.idea}</p>
          </div>
          <div>
            <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-cyan-glow uppercase">Aim</p>
            <p className="mt-1 text-[0.98rem] leading-relaxed">{aim}</p>
            <p className="mt-3 flex flex-wrap items-center gap-2 text-[0.72rem] font-semibold tracking-[0.16em] text-violet-glow uppercase">
              Hypothesis <Badge tone="amber">To be tested</Badge>
            </p>
            <p className="mt-1 text-[0.95rem] leading-relaxed text-muted">{hypothesis.statement}</p>
          </div>
        </div>
        <div className="mt-5 border-t border-line pt-5">
          <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-dim uppercase">Objectives</p>
          <ol className="mt-2 grid gap-2 md:grid-cols-2">
            {objectives.map((o, i) => (
              <li key={o} className="flex gap-3 text-[0.95rem] leading-snug text-muted">
                <span className="font-display font-semibold text-cyan-glow tabular-nums">{i + 1}.</span>
                {o}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {links.map(([id, title, sub]) => (
          <li key={id}>
            <Link
              to={`/explore/${id}`}
              className="group panel flex items-center justify-between gap-3 p-4 transition hover:border-white/25"
            >
              <span>
                <span className="block font-display text-[1.05rem] font-semibold">{title}</span>
                <span className="block text-[0.85rem] text-muted">{sub}</span>
              </span>
              <ArrowRight className="size-5 text-dim transition group-hover:translate-x-0.5 group-hover:text-cyan-glow" />
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-[0.8rem] leading-relaxed text-dim">
        Roblox is a trademark of Roblox Corporation. This school research project and its illustrations are independent and not affiliated with or
        endorsed by Roblox Corporation.
      </p>
    </div>
  )
}

// ── Missions ───────────────────────────────────────────────────────────────
export function MissionsSection() {
  return (
    <div>
      <SectionHeader eyebrow="Programme" title="The eight missions">
        One mission per week. Each has an objective, target phrases, a communication task and assigned roles.
      </SectionHeader>
      <nav className="mb-5 flex flex-wrap gap-2" aria-label="Jump to mission">
        {missions.map((m) => (
          <a
            key={m.slug}
            href={`#${m.slug}`}
            className="rounded-full border border-line px-3 py-1 text-[0.85rem] text-muted transition hover:border-white/25 hover:text-ink"
          >
            {m.number}. {m.title}
          </a>
        ))}
      </nav>
      <div className="space-y-5">
        {missions.map((m) => (
          <section key={m.slug} id={m.slug} className="panel scroll-mt-24 p-5 sm:p-6">
            <MissionDetail mission={m} />
          </section>
        ))}
      </div>
    </div>
  )
}

// ── Vocabulary ─────────────────────────────────────────────────────────────
export function VocabularySection() {
  const [q, setQ] = useState('')
  const canSpeak = useSpeechAvailable()
  const groups = useMemo(
    () => [
      ...missions.map((m) => ({ id: m.slug, title: `Mission ${m.number} · ${m.title}`, accent: m.accent, items: m.targetPhrases.map((p) => ({ phrase: p, example: '' })) })),
      ...phraseGroups.map((g) => ({ id: `fyw-${g.id}`, title: `Find Your Way demo · ${g.title}`, accent: '#7dd3fc', items: g.phrases })),
    ],
    [],
  )
  const needle = q.trim().toLowerCase()
  const filtered = groups
    .map((g) => ({ ...g, items: g.items.filter((i) => !needle || `${i.phrase} ${i.example}`.toLowerCase().includes(needle)) }))
    .filter((g) => g.items.length)
  const count = filtered.reduce((s, g) => s + g.items.length, 0)

  return (
    <div>
      <SectionHeader eyebrow="Language" title="Vocabulary & phrase examples">
        Target phrases from every mission and the phrase bank used in the live demonstration.
      </SectionHeader>
      <label className="panel mb-5 flex items-center gap-3 px-4 py-2.5">
        <Search className="size-5 text-dim" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search phrases, e.g. “opposite” or “how much”"
          className="w-full bg-transparent text-[1rem] text-ink placeholder:text-dim focus:outline-none"
          aria-label="Search phrases"
        />
        <span className="shrink-0 text-[0.85rem] text-dim tabular-nums">{count} phrases</span>
      </label>
      {filtered.length === 0 && <p className="text-muted">No phrases match “{q}”.</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((g) => (
          <section key={g.id} className="panel p-4">
            <h2 className="flex items-center gap-2 font-display text-[1.02rem] font-semibold">
              <span className="size-2.5 rounded-full" style={{ background: g.accent }} />
              {g.title}
            </h2>
            <ul className="mt-3 space-y-1.5">
              {g.items.map((i) => (
                <li key={i.phrase} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-white/[0.025] px-3 py-2">
                  <span>
                    <span className="font-display text-[1rem] font-medium">{i.phrase}</span>
                    {i.example && i.example !== i.phrase && <span className="block text-[0.85rem] text-dim">e.g. {i.example}</span>}
                  </span>
                  {canSpeak && (
                    <button
                      type="button"
                      onClick={() => speak(i.example || i.phrase)}
                      className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-md text-dim transition hover:bg-white/10 hover:text-ink"
                      aria-label={`Listen: ${i.phrase}`}
                    >
                      <Volume2 className="size-4" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}

// ── Timeline ───────────────────────────────────────────────────────────────
export function TimelineSection() {
  const { record, saveRecord, source } = useResearchRecord()
  const done = new Set(record.completedSessions)
  const toggle = (n: number) => {
    const next = done.has(n) ? record.completedSessions.filter((x) => x !== n) : [...record.completedSessions, n].sort((a, b) => a - b)
    saveRecord({ ...record, completedSessions: next })
  }
  return (
    <div>
      <SectionHeader eyebrow="Programme" title="Eight-week timeline">
        {programme.weeks} weeks × {programme.sessionsPerWeek} sessions = {programme.plannedSessions} planned sessions. A session counts as completed only
        when the presenter confirms that it actually took place.
      </SectionHeader>

      <section className="panel p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <SessionLegend completed={record.completedSessions.length} />
          <Badge tone="neutral">Record source: {source === 'file' ? 'project file' : 'this device'}</Badge>
        </div>
        <ProgrammeTimeline completedSessions={record.completedSessions} onToggleSession={toggle} variant="page" />
        <p className="mt-3 text-[0.85rem] text-amber-100/85">
          Select a session to confirm it as completed (or undo). Only confirm sessions that have really happened.
        </p>
      </section>

      <div className="panel mt-5 overflow-x-auto">
        <table className="w-full min-w-[40rem] text-left text-[0.92rem]">
          <thead className="border-b border-line text-[0.72rem] tracking-[0.14em] text-dim uppercase">
            <tr>
              <th className="px-4 py-3 font-semibold">Session</th>
              <th className="px-4 py-3 font-semibold">Week</th>
              <th className="px-4 py-3 font-semibold">Mission</th>
              <th className="px-4 py-3 font-semibold">Focus</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {sessions.map((s) => {
              const m = missions[s.missionNumber - 1]
              const isDone = done.has(s.number)
              return (
                <tr key={s.number}>
                  <td className="px-4 py-2.5 font-semibold tabular-nums">
                    S{s.number} <span className="font-normal text-dim">({s.part})</span>
                  </td>
                  <td className="px-4 py-2.5 tabular-nums">{s.week}</td>
                  <td className="px-4 py-2.5">{m.title}</td>
                  <td className="px-4 py-2.5 text-muted">{s.focus}</td>
                  <td className="px-4 py-2.5">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => toggle(s.number)}
                        className="size-4 accent-[var(--color-cyan-glow)]"
                      />
                      <span className={isDone ? 'text-cyan-100' : 'text-dim'}>{isDone ? 'Confirmed completed' : 'Planned'}</span>
                    </label>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Methodology ────────────────────────────────────────────────────────────
export function MethodologySection() {
  return (
    <div>
      <SectionHeader eyebrow="Method" title="Research methodology">
        {researchDesign.summary}
      </SectionHeader>
      <div className="grid gap-4 md:grid-cols-3">
        <section className="panel p-5">
          <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-dim uppercase">Design</p>
          <p className="mt-1 font-display text-[1.15rem] font-semibold">{researchDesign.name}</p>
          <p className="mt-1 text-[0.9rem] text-muted">{researchDesign.type}</p>
        </section>
        <section className="panel p-5">
          <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-dim uppercase">Participants</p>
          <p className="mt-1 text-[0.95rem] leading-relaxed text-muted">{researchDesign.participants}</p>
        </section>
        <section className="panel p-5">
          <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-dim uppercase">Variables</p>
          <p className="mt-1 text-[0.9rem] text-muted">
            <span className="font-semibold text-ink">Independent:</span> {hypothesis.variables.independent}
          </p>
          <p className="mt-1 text-[0.9rem] text-muted">
            <span className="font-semibold text-ink">Dependent:</span> {hypothesis.variables.dependent}
          </p>
        </section>
      </div>

      <h2 className="mt-8 mb-3 font-display text-[1.3rem] font-semibold">Procedure</h2>
      <ol className="grid gap-3 md:grid-cols-3">
        {procedure.map((p, i) => (
          <li key={p.phase} className="panel p-5">
            <p className="font-display text-[0.85rem] font-semibold tracking-widest text-cyan-glow uppercase">
              {i + 1} · {p.phase}
            </p>
            <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{p.text}</p>
          </li>
        ))}
      </ol>

      <h2 className="mt-8 mb-3 font-display text-[1.3rem] font-semibold">Research methods</h2>
      <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {methods.map((m) => {
          const Icon = methodIcons[m.icon]
          return (
            <li key={m.id} className="panel p-5">
              <div className="flex items-center gap-3">
                <IconTile className="size-10">
                  <Icon className="size-5" />
                </IconTile>
                <div>
                  <p className="font-display text-[1.05rem] font-semibold">{m.name}</p>
                  <p className="text-[0.82rem] text-dim">
                    {m.kind} · {m.when}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-muted">{m.purpose}</p>
            </li>
          )
        })}
      </ul>

      <h2 className="mt-8 mb-3 font-display text-[1.3rem] font-semibold">Oral test format (pre-test and post-test)</h2>
      <ol className="grid gap-3 md:grid-cols-3">
        {oralTestFormat.map((p) => (
          <li key={p.part} className="panel p-5">
            <p className="text-[0.78rem] font-semibold tracking-widest text-violet-glow uppercase">
              {p.part} · {p.duration}
            </p>
            <p className="mt-1 font-display text-[1.05rem] font-semibold">{p.name}</p>
            <p className="mt-1 text-[0.92rem] text-muted">{p.text}</p>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-[0.9rem] text-muted">
        Both tests use the same format and the same four-criterion rubric ({TOTAL_MIN}–{TOTAL_MAX} points).
      </p>

      <h2 className="mt-8 mb-3 font-display text-[1.3rem] font-semibold">Data analysis</h2>
      <ul className="panel space-y-2 p-5 text-[0.95rem] leading-relaxed text-muted">
        <li>• Compare pre-test and post-test means (and standard deviations) for each criterion and for the total score.</li>
        <li>• Count how many participants scored higher, the same or lower in the post-test.</li>
        <li>• Summarise survey answers as mean agreement per statement (1–5).</li>
        <li>• Group observation notes, interview answers and reflections into recurring themes.</li>
        <li>• Interpret results cautiously: the one-group design does not allow causal conclusions.</li>
      </ul>
    </div>
  )
}

// ── Rubric ─────────────────────────────────────────────────────────────────
export function RubricSection() {
  return (
    <div>
      <SectionHeader eyebrow="Assessment" title="Speaking assessment rubric">
        Four criteria, each scored from 1 to 5. Total: {TOTAL_MIN}–{TOTAL_MAX} points. The same rubric is used for the pre-test and the post-test.
      </SectionHeader>
      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[56rem] border-collapse text-left text-[0.88rem]">
          <thead>
            <tr className="border-b border-line">
              <th className="px-4 py-3 text-[0.72rem] font-semibold tracking-[0.14em] text-dim uppercase">Criterion</th>
              {[5, 4, 3, 2, 1].map((n) => (
                <th key={n} className="px-3 py-3">
                  <span className="font-display text-[1.1rem] font-semibold">{n}</span>{' '}
                  <span className="text-[0.72rem] tracking-wide text-dim uppercase">{scaleLabels[n]}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {criteria.map((c) => (
              <tr key={c.id} className="align-top">
                <th scope="row" className="px-4 py-3">
                  <span className="flex items-center gap-2 font-display text-[1rem] font-semibold">
                    <span className="size-2.5 rounded-full" style={{ background: criterionColors[c.id] }} />
                    {c.name}
                  </span>
                  <span className="mt-1 block text-[0.82rem] font-normal text-dim">{c.question}</span>
                </th>
                {[5, 4, 3, 2, 1].map((n) => (
                  <td key={n} className="px-3 py-3 leading-snug text-muted">
                    {c.descriptors[n - 1]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="mt-8 mb-3 font-display text-[1.3rem] font-semibold">Practise scoring</h2>
      <RubricExplorer />
    </div>
  )
}

// ── Safety ─────────────────────────────────────────────────────────────────
export function SafetySection() {
  return (
    <div>
      <SectionHeader eyebrow="Ethics & safety" title="Safety considerations">
        Game-based lessons are only valuable if students are safe. These rules apply to every session.
      </SectionHeader>
      <ul className="grid gap-3 md:grid-cols-2">
        {safetyItems.map((s) => {
          const Icon = safetyIcons[s.icon]
          return (
            <li key={s.title} className="panel flex gap-4 p-5">
              <IconTile color="#5eead4" className="size-11">
                <Icon className="size-5" />
              </IconTile>
              <div>
                <p className="font-display text-[1.05rem] font-semibold">{s.title}</p>
                <p className="mt-1 text-[0.93rem] leading-relaxed text-muted">{s.text}</p>
              </div>
            </li>
          )
        })}
      </ul>
      <p className="mt-5 flex items-start gap-2 text-[0.9rem] text-muted">
        <Check className="mt-0.5 size-4 shrink-0 text-mint-glow" />
        The live demonstration in this presentation runs entirely in the browser: no game account, chat or personal data is involved.
      </p>
    </div>
  )
}

// ── References ─────────────────────────────────────────────────────────────
export function ReferencesSection() {
  const topics = [...new Set(references.map((r) => r.topic))]
  return (
    <div>
      <SectionHeader eyebrow="Literature" title="Research references">
        {referencesNote}
      </SectionHeader>
      <div className="space-y-5">
        {topics.map((t) => (
          <section key={t} className="panel p-5">
            <h2 className="font-display text-[1.05rem] font-semibold text-cyan-100">{t}</h2>
            <ul className="mt-3 space-y-2.5">
              {references
                .filter((r) => r.topic === t)
                .map((r) => (
                  <li key={r.text} className={cn('pl-6 -indent-6 text-[0.93rem] leading-relaxed text-muted')}>
                    {r.text}
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
