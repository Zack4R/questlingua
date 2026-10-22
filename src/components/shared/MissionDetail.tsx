import { MessageSquareQuote, Target, Users, Volume2 } from 'lucide-react'
import type { Mission } from '../../content/missions'
import { speak, useSpeechAvailable } from '../../lib/speech'
import { Badge, IconTile } from '../ui/primitives'
import { missionIcons } from './icons'

export function MissionDetail({ mission, large = false }: { mission: Mission; large?: boolean }) {
  const Icon = missionIcons[mission.icon]
  const canSpeak = useSpeechAvailable()
  return (
    <article className="grid gap-5 lg:grid-cols-[1fr_1.05fr] lg:gap-7">
      <div>
        <div className="flex items-center gap-4">
          <IconTile color={mission.accent} className={large ? 'size-[3.6rem]' : 'size-[3rem]'}>
            <Icon className={large ? 'size-[1.8rem]' : 'size-[1.5rem]'} />
          </IconTile>
          <div>
            <p className="eyebrow" style={{ color: mission.accent }}>
              Mission {String(mission.number).padStart(2, '0')} · Week {mission.week}
            </p>
            <h3 className={`font-display font-semibold ${large ? 'text-[2rem]' : 'text-[1.6rem]'} leading-tight`}>{mission.title}</h3>
          </div>
        </div>

        <section className="mt-5">
          <h4 className="flex items-center gap-2 text-[0.8rem] font-semibold tracking-[0.18em] text-dim uppercase">
            <Target className="size-4" /> Objective
          </h4>
          <p className={`mt-1.5 leading-relaxed text-ink ${large ? 'text-[1.2rem]' : 'text-[1.05rem]'}`}>{mission.objective}</p>
        </section>

        <section className="mt-5">
          <h4 className="flex items-center gap-2 text-[0.8rem] font-semibold tracking-[0.18em] text-dim uppercase">
            <Users className="size-4" /> Communication task
          </h4>
          <p className={`mt-1.5 leading-relaxed text-muted ${large ? 'text-[1.1rem]' : 'text-[1rem]'}`}>{mission.communicationTask}</p>
        </section>

        <div className="mt-5 flex flex-wrap gap-2">
          {mission.roles.map((r) => (
            <Badge key={r} tone="neutral">
              Role · {r}
            </Badge>
          ))}
          <Badge tone="violet">{mission.languageFocus}</Badge>
          <Badge tone="neutral">Setting · {mission.gameSetting}</Badge>
        </div>
      </div>

      <section className="panel-quiet p-4 lg:p-5">
        <h4 className="flex items-center gap-2 text-[0.8rem] font-semibold tracking-[0.18em] text-dim uppercase">
          <MessageSquareQuote className="size-4" /> Target phrases
        </h4>
        <ul className="mt-3 grid gap-2">
          {mission.targetPhrases.map((p) => (
            <li
              key={p}
              className="flex items-center justify-between gap-3 rounded-lg border border-line bg-white/[0.03] px-3.5 py-2.5"
              style={{ boxShadow: `inset 3px 0 0 ${mission.accent}` }}
            >
              <span className={`font-display font-medium ${large ? 'text-[1.2rem]' : 'text-[1.05rem]'}`}>{p}</span>
              {canSpeak && (
                <button
                  type="button"
                  onClick={() => speak(p)}
                  className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-md text-dim transition hover:bg-white/10 hover:text-ink"
                  aria-label={`Listen: ${p}`}
                  title="Listen"
                >
                  <Volume2 className="size-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
