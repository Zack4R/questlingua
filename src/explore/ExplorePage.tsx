import { useEffect, type ComponentType } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router'
import {
  BookMarked,
  BookOpenText,
  CalendarRange,
  ChartColumn,
  ClipboardList,
  FlaskConical,
  Gauge,
  Home,
  Presentation,
  ShieldCheck,
  Swords,
  type LucideIcon,
} from 'lucide-react'
import { slides } from '../content/slides'
import { cn, isTypingTarget, pad2, shortcutKey } from '../lib/dom'
import { session } from '../lib/storage'
import { LAST_SLIDE_KEY, slidePath } from '../presentation/PresentationPage'
import { InstrumentsSection } from './InstrumentsSection'
import { ResultsSection } from './ResultsSection'
import {
  MethodologySection,
  MissionsSection,
  OverviewSection,
  ReferencesSection,
  RubricSection,
  SafetySection,
  TimelineSection,
  VocabularySection,
} from './sections'

export interface ExploreSectionDef {
  id: string
  label: string
  icon: LucideIcon
  component: ComponentType
}

export const exploreSections: ExploreSectionDef[] = [
  { id: 'overview', label: 'Overview', icon: Home, component: OverviewSection },
  { id: 'missions', label: 'The eight missions', icon: Swords, component: MissionsSection },
  { id: 'vocabulary', label: 'Vocabulary & phrases', icon: BookOpenText, component: VocabularySection },
  { id: 'timeline', label: 'Eight-week timeline', icon: CalendarRange, component: TimelineSection },
  { id: 'methodology', label: 'Methodology', icon: FlaskConical, component: MethodologySection },
  { id: 'rubric', label: 'Assessment rubric', icon: Gauge, component: RubricSection },
  { id: 'instruments', label: 'Survey & observation', icon: ClipboardList, component: InstrumentsSection },
  { id: 'results', label: 'Verified results', icon: ChartColumn, component: ResultsSection },
  { id: 'safety', label: 'Safety', icon: ShieldCheck, component: SafetySection },
  { id: 'references', label: 'References', icon: BookMarked, component: ReferencesSection },
]

export function ExplorePage() {
  const { section = 'overview' } = useParams()
  const navigate = useNavigate()
  const current = exploreSections.find((s) => s.id === section)
  const lastSlide = Math.min(Math.max(Number(session.get(LAST_SLIDE_KEY) ?? 0) || 0, 0), slides.length - 1)
  const back = () => navigate(slidePath(lastSlide))

  useEffect(() => {
    document.documentElement.dataset.mode = 'explore'
  }, [])

  useEffect(() => {
    if (!current) navigate('/explore', { replace: true })
    else document.title = `${current.label} · Explore · QuestLingua`
    window.scrollTo({ top: 0 })
  }, [current, navigate])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target) || e.ctrlKey || e.metaKey || e.altKey) return
      if (shortcutKey(e) === 'e' || e.key === 'Escape') {
        e.preventDefault()
        navigate(slidePath(Number(session.get(LAST_SLIDE_KEY) ?? 0) || 0))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  if (!current) return null
  const Section = current.component

  return (
    <div className="min-h-dvh">
      <header className="no-print sticky top-0 z-30 border-b border-line bg-navy-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-[3.8rem] max-w-[90rem] items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="font-display text-[1rem] font-semibold tracking-[0.25em] uppercase">QuestLingua</span>
            <span className="hidden h-4 w-px bg-white/15 sm:block" />
            <span className="hidden text-[0.9rem] text-dim sm:block">Explore Mode</span>
          </div>
          <button
            type="button"
            onClick={back}
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-cyan-glow/40 bg-cyan-glow/10 px-3 py-2 text-[0.9rem] font-medium text-cyan-50 transition hover:bg-cyan-glow/20"
            title="Return to the presentation (E)"
          >
            <Presentation className="size-4" />
            <span className="hidden sm:inline">Return to slide</span> {pad2(lastSlide + 1)}
            <span className="hidden max-w-[12rem] truncate text-cyan-100/70 md:inline">· {slides[lastSlide].title}</span>
          </button>
        </div>
        {/* mobile section nav */}
        <nav className="flex gap-1.5 overflow-x-auto px-4 pb-2.5 scrollbar-thin lg:hidden" aria-label="Explore sections">
          {exploreSections.map((s) => (
            <NavLink
              key={s.id}
              to={`/explore/${s.id}`}
              className={({ isActive }) =>
                cn(
                  'shrink-0 rounded-full border px-3 py-1 text-[0.82rem] whitespace-nowrap transition',
                  isActive || (s.id === 'overview' && section === 'overview')
                    ? 'border-cyan-glow/50 bg-cyan-glow/15 text-cyan-50'
                    : 'border-line text-muted',
                )
              }
            >
              {s.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <div className="mx-auto flex max-w-[90rem] gap-8 px-4 py-6 sm:px-6 lg:py-8">
        <aside className="no-print sticky top-[5.3rem] hidden h-fit w-[15.5rem] shrink-0 lg:block">
          <nav aria-label="Explore sections" className="space-y-0.5">
            {exploreSections.map((s) => {
              const Icon = s.icon
              const active = s.id === current.id
              return (
                <NavLink
                  key={s.id}
                  to={`/explore/${s.id}`}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.92rem] transition',
                    active ? 'bg-cyan-glow/12 text-ink shadow-[inset_2px_0_0_var(--color-cyan-glow)]' : 'text-muted hover:bg-white/[0.05] hover:text-ink',
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className={cn('size-[1.05rem]', active ? 'text-cyan-glow' : 'text-dim')} />
                  {s.label}
                </NavLink>
              )
            })}
          </nav>
          <p className="mt-6 px-3 text-[0.78rem] leading-relaxed text-dim">
            Press <span className="font-semibold text-muted">E</span> to return to the presentation at the same slide.
          </p>
        </aside>

        <main className="min-w-0 flex-1 animate-fade-in" key={current.id}>
          <Section />
        </main>
      </div>
    </div>
  )
}
