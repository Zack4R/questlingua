import { missions } from './missions'

export const programme = {
  weeks: 8,
  sessionsPerWeek: 2,
  plannedSessions: 16,
  sessionLength: 'One lesson (≈ 40 minutes)',
} as const

export const researchDesign = {
  name: 'One-group pre-test / post-test design',
  type: 'Pre-experimental, mixed methods',
  summary:
    'The same group of students is assessed before and after the eight-week programme. Quantitative rubric scores are combined with qualitative data from observation, interviews and reflections.',
  participants:
    'Students of School No. 14, Taldykorgan, with consent from the school and parents / guardians. The number of participants is reported together with the verified results.',
} as const

export type MethodIconName = 'mic' | 'list' | 'eye' | 'message' | 'pen'

export interface ResearchMethod {
  id: string
  name: string
  icon: MethodIconName
  kind: 'Quantitative' | 'Qualitative' | 'Mixed'
  when: string
  purpose: string
}

export const methods: ResearchMethod[] = [
  {
    id: 'oral-test',
    name: 'Oral pre-test and post-test',
    icon: 'mic',
    kind: 'Quantitative',
    when: 'Before week 1 and after week 8',
    purpose:
      'Measure speaking skills with the same task format and the four-criterion rubric (1–5 per criterion, 20 points in total).',
  },
  {
    id: 'survey',
    name: 'Five-point student survey',
    icon: 'list',
    kind: 'Quantitative',
    when: 'After the programme',
    purpose: 'Record students’ attitudes, motivation and confidence on a scale from 1 (strongly disagree) to 5 (strongly agree).',
  },
  {
    id: 'observation',
    name: 'Structured observation',
    icon: 'eye',
    kind: 'Mixed',
    when: 'During the sessions',
    purpose: 'Use a fixed checklist to note how often students use target phrases, ask questions and respond in English.',
  },
  {
    id: 'interviews',
    name: 'Short interviews',
    icon: 'message',
    kind: 'Qualitative',
    when: 'After the programme',
    purpose: 'Ask a small number of volunteers about their experience, difficulties and suggestions.',
  },
  {
    id: 'reflection',
    name: 'Learner reflection',
    icon: 'pen',
    kind: 'Qualitative',
    when: 'After each mission',
    purpose: 'Students note what they learned, which phrases they used and how confident they felt.',
  },
]

export const oralTestFormat = [
  { part: 'Part 1', name: 'Personal questions', duration: '≈ 1 min', text: 'The examiner asks simple questions about the student’s life and interests.' },
  { part: 'Part 2', name: 'Picture / map task', duration: '≈ 1–2 min', text: 'The student describes a picture or explains a route on a map.' },
  { part: 'Part 3', name: 'Paired role-play', duration: '≈ 2 min', text: 'Two students complete a short role-play that requires asking and answering.' },
] as const

export const procedure = [
  { phase: 'Preparation', text: 'Consent, safe game setup, pre-test and baseline observation.' },
  { phase: 'Weeks 1–8', text: 'One mission per week, two sessions per week (16 sessions in total).' },
  { phase: 'Completion', text: 'Post-test, survey, interviews and data analysis.' },
] as const

export interface Session {
  number: number
  week: number
  part: 'A' | 'B'
  missionNumber: number
  focus: string
}

const sessionFocus = {
  A: 'Mission briefing, vocabulary and guided gameplay',
  B: 'Communication task, speaking practice and reflection',
} as const

export const sessions: Session[] = missions.flatMap((mission) =>
  (['A', 'B'] as const).map((part, i) => ({
    number: (mission.week - 1) * 2 + i + 1,
    week: mission.week,
    part,
    missionNumber: mission.number,
    focus: sessionFocus[part],
  })),
)
