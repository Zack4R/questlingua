import { useEffect, useRef } from 'react'
import {
  ArrowUp,
  CornerUpLeft,
  CornerUpRight,
  Eye,
  EyeOff,
  MessageCircle,
  OctagonX,
  Play,
  RotateCcw,
  Undo2,
  Volume2,
} from 'lucide-react'
import { landmarks, phraseGroups, reflectionStatements, scenarios } from '../../content/findYourWay'
import { cn, formatClock } from '../../lib/dom'
import { speak, useSpeechAvailable } from '../../lib/speech'
import { Badge, Button } from '../ui/primitives'
import { buildSentences, landmarkById } from './engine'
import { derive, mission, type MissionState } from './missionStore'

function Listen({ text, voice = 0, className }: { text: string; voice?: number; className?: string }) {
  const can = useSpeechAvailable()
  if (!can) return null
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        speak(text, { voiceIndex: voice })
      }}
      className={cn('grid size-7 shrink-0 cursor-pointer place-items-center rounded-md text-dim transition hover:bg-white/10 hover:text-ink', className)}
      aria-label={`Listen: ${text}`}
      title="Listen"
    >
      <Volume2 className="size-[0.95rem]" />
    </button>
  )
}

const H = ({ children }: { children: string }) => (
  <h4 className="text-[0.75rem] font-semibold tracking-[0.18em] text-dim uppercase">{children}</h4>
)

// ── 1. Briefing ─────────────────────────────────────────────────────────────
export function BriefingStep({ s }: { s: MissionState }) {
  const d = derive(s)
  return (
    <div className="space-y-4">
      <div>
        <H>Choose a route</H>
        <div className="mt-2 flex flex-wrap gap-2">
          {scenarios.map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => mission.setScenario(sc.id)}
              className={cn(
                'cursor-pointer rounded-lg border px-3 py-1.5 text-[0.9rem] transition',
                sc.id === s.scenarioId ? 'border-cyan-glow/60 bg-cyan-glow/15 text-cyan-50' : 'border-line text-muted hover:text-ink',
              )}
            >
              {sc.title}
            </button>
          ))}
        </div>
      </div>
      <p className="text-[1.02rem] leading-relaxed text-ink lg:text-[1.08rem]">{d.scenario.briefing}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="panel-quiet p-3">
          <Badge tone="cyan">You · Guide</Badge>
          <p className="mt-2 text-[0.92rem] leading-snug text-muted">You see the map and give directions in English.</p>
        </div>
        <div className="panel-quiet p-3">
          <Badge tone="violet">Teammate · Explorer</Badge>
          <p className="mt-2 text-[0.92rem] leading-snug text-muted">Follows only your words and asks questions.</p>
        </div>
      </div>
      <div>
        <H>Success criteria</H>
        <ul className="mt-2 space-y-1 text-[0.95rem] text-muted">
          <li>• The Explorer reaches the {d.destination.name.toLowerCase()} and stops there.</li>
          <li>• You use direction phrases and at least one landmark.</li>
          <li>• You check that your teammate understood.</li>
        </ul>
      </div>
    </div>
  )
}

// ── 2. Vocabulary ───────────────────────────────────────────────────────────
export function VocabularyStep({ s }: { s: MissionState }) {
  return (
    <div className="space-y-4">
      {phraseGroups.map((g) => (
        <div key={g.id}>
          <H>{g.title}</H>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {g.phrases.map((p) => (
              <li key={p.phrase} className="flex items-center gap-0.5 rounded-lg border border-line bg-white/[0.03] py-1 pr-1 pl-3" title={p.example}>
                <span className="font-display text-[0.95rem] font-medium lg:text-[1rem]">{p.phrase}</span>
                <Listen text={p.example} />
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div>
        <H>Landmarks — select to find on the map</H>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {landmarks.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => mission.highlight(s.highlight === l.id ? null : l.id)}
                onMouseEnter={() => mission.highlight(l.id)}
                onMouseLeave={() => mission.highlight(null)}
                className={cn(
                  'flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.85rem] transition',
                  s.highlight === l.id ? 'border-white/40 bg-white/10 text-ink' : 'border-line text-muted hover:text-ink',
                )}
              >
                <span className="size-2 rounded-full" style={{ background: l.color }} />
                {l.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ── 3. Guide ────────────────────────────────────────────────────────────────
export function GuideStep({ s }: { s: MissionState }) {
  const d = derive(s)
  const sentences = buildSentences(s.log, d.destination)
  const listRef = useRef<HTMLOListElement>(null)
  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView({ block: 'nearest' })
  }, [sentences.length])

  const pad = [
    { cmd: 'left' as const, label: 'Turn left', Icon: CornerUpLeft },
    { cmd: 'straight' as const, label: 'Go straight', Icon: ArrowUp },
    { cmd: 'right' as const, label: 'Turn right', Icon: CornerUpRight },
  ]
  const locked = d.completed || s.autoplay

  return (
    <div className="flex h-full flex-col gap-3">
      {/* teammate radio */}
      <div
        className={cn(
          'flex min-h-[4.2rem] items-start gap-3 rounded-xl border px-3 py-2.5 transition-colors',
          s.reply?.tone === 'warn' && 'border-amber-glow/50 bg-amber-glow/10',
          s.reply?.tone === 'success' && 'border-mint-glow/50 bg-mint-glow/10',
          (!s.reply || s.reply.tone === 'info') && 'border-violet-glow/35 bg-violet-glow/[0.08]',
        )}
        aria-live="polite"
      >
        <MessageCircle className="mt-0.5 size-5 shrink-0 text-violet-glow" />
        <div className="min-w-0 flex-1">
          <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-dim uppercase">Explorer says</p>
          <p className="text-[0.98rem] leading-snug text-ink lg:text-[1.05rem]">
            {s.reply?.text ?? `I’m at the ${landmarkById(d.scenario.fromLandmark).name.toLowerCase()}. How do I get to the ${d.destination.name.toLowerCase()}?`}
          </p>
        </div>
        {s.reply && <Listen text={s.reply.text} voice={1} />}
      </div>

      {/* command pad */}
      <div className="grid grid-cols-4 gap-2">
        {pad.map(({ cmd, label, Icon }) => (
          <button
            key={cmd}
            type="button"
            disabled={locked}
            onClick={() => mission.command(cmd)}
            className="flex cursor-pointer flex-col items-center gap-1 rounded-xl border border-cyan-glow/30 bg-cyan-glow/[0.08] px-1.5 py-2 font-display text-[0.9rem] leading-tight font-semibold text-cyan-50 transition hover:bg-cyan-glow/20 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 lg:text-[0.95rem]"
          >
            <Icon className="size-[1.3rem]" />
            {label}
          </button>
        ))}
        <button
          type="button"
          disabled={locked}
          onClick={() => mission.command('stop')}
          className={cn(
            'flex cursor-pointer flex-col items-center gap-1 rounded-xl border px-1.5 py-2 font-display text-[0.9rem] leading-tight font-semibold transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 lg:text-[0.95rem]',
            d.arrived && !d.completed
              ? 'border-mint-glow/70 bg-mint-glow/20 text-emerald-50 shadow-[0_0_1.6rem_-0.4rem_rgb(94_234_212/0.8)]'
              : 'border-line bg-white/[0.04] text-ink hover:bg-white/[0.08]',
          )}
        >
          <OctagonX className="size-[1.3rem]" /> Stop here
        </button>
      </div>

      {/* transcript */}
      <div className="panel-quiet flex min-h-[7rem] flex-1 flex-col p-3">
        <div className="flex items-center justify-between">
          <H>Your directions</H>
          {d.completed && <Badge tone="mint">Mission complete · {formatClock((s.completedAt ?? 0) - (s.startedAt ?? s.completedAt ?? 0))}</Badge>}
        </div>
        {sentences.length === 0 ? (
          <p className="mt-2 text-[0.9rem] text-dim">Use the buttons to guide your teammate. Your instructions will appear here as English sentences.</p>
        ) : (
          <ol ref={listRef} className="mt-2 max-h-[11rem] space-y-1 overflow-y-auto scrollbar-thin lg:max-h-none lg:flex-1">
            {sentences.map((t, i) => (
              <li key={`${i}-${t}`} className={cn('flex items-start gap-2 rounded-md px-1.5 py-1', i === sentences.length - 1 && 'bg-white/[0.05]')}>
                <span className="mt-[0.2em] font-display text-[0.8rem] font-semibold text-cyan-glow tabular-nums">{i + 1}.</span>
                <span className="flex-1 text-[0.98rem] leading-snug lg:text-[1.02rem]">{t}</span>
                <Listen text={t} />
              </li>
            ))}
          </ol>
        )}
        {d.completed && <p className="mt-2 text-[0.88rem] text-emerald-100/90">{d.scenario.destinationHint}</p>}
      </div>

      <div className="flex flex-wrap gap-x-1 gap-y-1">
        <Button size="sm" variant="ghost" onClick={mission.undo} disabled={!s.log.length || s.autoplay}>
          <Undo2 className="size-4" /> Undo
        </Button>
        <Button size="sm" variant="ghost" onClick={mission.resetRoute} disabled={!s.log.length && !s.reply}>
          <RotateCcw className="size-4" /> Reset
        </Button>
        <Button size="sm" variant="ghost" onClick={mission.toggleModel} title="Show or hide the shortest route">
          {s.showModel ? <EyeOff className="size-4" /> : <Eye className="size-4" />} {s.showModel ? 'Hide route' : 'Model route'}
        </Button>
        <Button size="sm" variant="ghost" onClick={s.autoplay ? mission.stopAutoplay : mission.playModel} title="Play the model route step by step">
          <Play className="size-4" /> {s.autoplay ? 'Stop' : 'Auto-play'}
        </Button>
      </div>
    </div>
  )
}

// ── 4. Follow-up questions ─────────────────────────────────────────────────
export function QuestionsStep({ s }: { s: MissionState }) {
  const { scenario } = derive(s)
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[0.95rem] text-muted">The Explorer asks follow-up questions. Answer aloud, then reveal a model answer.</p>
        <Button size="sm" variant="ghost" onClick={() => mission.revealAll(scenario.followUp.length)}>
          Reveal all
        </Button>
      </div>
      {scenario.followUp.map((q, i) => {
        const open = s.revealed.includes(i)
        return (
          <div key={q.question} className={cn('rounded-xl border transition', open ? 'border-cyan-glow/35 bg-cyan-glow/[0.06]' : 'border-line bg-white/[0.03]')}>
            <button type="button" onClick={() => mission.reveal(i)} className="flex w-full cursor-pointer items-start gap-3 px-3.5 py-3 text-left" aria-expanded={open}>
              <span className="mt-0.5 font-display text-[0.85rem] font-semibold text-violet-glow">Q{i + 1}</span>
              <span className="flex-1 font-display text-[1.02rem] font-medium lg:text-[1.08rem]">{q.question}</span>
              <span className="text-[0.75rem] text-dim">{open ? 'Hide' : 'Model answer'}</span>
            </button>
            {open && (
              <div className="flex items-start gap-2 border-t border-line px-3.5 py-2.5 pl-[2.9rem]">
                <p className="flex-1 text-[0.98rem] leading-snug text-cyan-50">{q.answer}</p>
                <Listen text={q.answer} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── 5. Sample dialogue ──────────────────────────────────────────────────────
export function DialogueStep({ s }: { s: MissionState }) {
  const { scenario } = derive(s)
  const lines = scenario.dialogue
  const shown = Math.min(s.dialogueShown, lines.length)
  return (
    <div className="flex h-full flex-col gap-3">
      <ol className="space-y-2">
        {lines.slice(0, shown).map((l, i) => {
          const guide = l.speaker === 'Guide'
          return (
            <li key={i} className={cn('flex animate-pop items-end gap-2', guide ? 'justify-start' : 'justify-end')}>
              <div
                className={cn(
                  'max-w-[85%] rounded-2xl border px-3.5 py-2',
                  guide ? 'rounded-bl-md border-cyan-glow/35 bg-cyan-glow/[0.09]' : 'rounded-br-md border-violet-glow/35 bg-violet-glow/[0.09]',
                )}
              >
                <p className={cn('text-[0.68rem] font-semibold tracking-[0.18em] uppercase', guide ? 'text-cyan-glow' : 'text-violet-glow')}>{l.speaker}</p>
                <p className="text-[0.98rem] leading-snug lg:text-[1.03rem]">{l.text}</p>
              </div>
              <Listen text={l.text} voice={guide ? 0 : 1} />
            </li>
          )
        })}
      </ol>
      <div className="mt-auto flex flex-wrap gap-2">
        <Button size="sm" variant="subtle" onClick={() => mission.showLines(shown + 1)} disabled={shown >= lines.length}>
          Next line ({shown}/{lines.length})
        </Button>
        <Button size="sm" variant="ghost" onClick={() => mission.showLines(lines.length)} disabled={shown >= lines.length}>
          Show all
        </Button>
        <Button size="sm" variant="ghost" onClick={() => mission.showLines(1)} disabled={shown <= 1}>
          <RotateCcw className="size-4" /> Restart
        </Button>
      </div>
    </div>
  )
}

// ── 6. Reflection ───────────────────────────────────────────────────────────
export function ReflectionStep({ s }: { s: MissionState }) {
  const d = derive(s)
  const phrases = ['Go straight', 'Turn left / right', 'Go past the …', 'It’s next to …', 'It’s opposite …', 'Did you say left or right?']
  const sentences = buildSentences(s.log, d.destination)
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <H>How did it go? (1 = not yet, 5 = very well)</H>
        {reflectionStatements.map((st, i) => (
          <div key={st} className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[0.95rem] text-ink">{st}</span>
            <div className="flex gap-1" role="radiogroup" aria-label={st}>
              {[1, 2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={s.ratings[i] === v}
                  onClick={() => mission.rate(i, v)}
                  className={cn(
                    'size-8 cursor-pointer rounded-lg border text-[0.9rem] font-semibold tabular-nums transition',
                    s.ratings[i] !== null && v <= (s.ratings[i] ?? 0)
                      ? 'border-cyan-glow/60 bg-cyan-glow/20 text-cyan-50'
                      : 'border-line text-dim hover:text-ink',
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div>
        <H>The most useful phrase today</H>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {phrases.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => mission.pickPhrase(s.usefulPhrase === p ? null : p)}
              className={cn(
                'cursor-pointer rounded-full border px-3 py-1 text-[0.88rem] transition',
                s.usefulPhrase === p ? 'border-violet-glow/60 bg-violet-glow/20 text-violet-50' : 'border-line text-muted hover:text-ink',
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <label className="block">
        <H>Next time I will …</H>
        <input
          value={s.note}
          onChange={(e) => mission.setNote(e.target.value)}
          placeholder="e.g. check that my partner understood"
          className="mt-2 w-full rounded-lg border border-line bg-navy-950/60 px-3 py-2 text-[0.95rem] text-ink placeholder:text-dim focus:border-cyan-glow/60 focus:outline-none"
        />
      </label>
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { v: d.completed ? 'Yes' : 'Not yet', l: 'Destination reached' },
          { v: String(sentences.length), l: 'Instructions given' },
          { v: s.startedAt ? formatClock((s.completedAt ?? Date.now()) - s.startedAt) : '—', l: 'Time on mission' },
        ].map((x) => (
          <div key={x.l} className="panel-quiet px-2 py-2.5">
            <p className="font-display text-[1.3rem] font-semibold">{x.v}</p>
            <p className="text-[0.75rem] text-dim">{x.l}</p>
          </div>
        ))}
      </div>
      <p className="text-[0.8rem] text-dim">Reflection answers stay in this browser tab only. They are a classroom routine, not research data.</p>
    </div>
  )
}
