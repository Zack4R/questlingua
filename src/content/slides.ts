// Slide order, titles, suggested timing and speaker notes.
// Suggested durations add up to ≈ 7½ minutes; the presenter timer scales them
// to the target length chosen in the toolbar (5–8 minutes).

export type SlideId =
  | 'title'
  | 'problem'
  | 'aim'
  | 'methodology'
  | 'missions'
  | 'demo'
  | 'assessment'
  | 'results'
  | 'conclusion'
  | 'questions'

export interface SlideMeta {
  id: SlideId
  title: string
  kicker: string
  summary: string
  seconds: number
  notes: string[]
}

export const slides: SlideMeta[] = [
  {
    id: 'title',
    title: 'Title',
    kicker: 'Research defense',
    summary: 'Research title, author and supervisor',
    seconds: 20,
    notes: [
      'Greet the judges and introduce yourself: name, grade, school.',
      'Read the research title slowly and clearly.',
      'Mention your supervisor, Aliyeva Zuhra.',
    ],
  },
  {
    id: 'problem',
    title: 'Research Problem',
    kicker: '01 · Problem',
    summary: 'Why speaking practice matters and the research question',
    seconds: 40,
    notes: [
      'Many students know words and rules but are afraid to speak.',
      'Lessons give each student little speaking time and few real reasons to talk.',
      'Read the research question aloud.',
    ],
  },
  {
    id: 'aim',
    title: 'Aim, Objectives & Hypothesis',
    kicker: '02 · Purpose',
    summary: 'What the research wants to find out',
    seconds: 45,
    notes: [
      'State the aim in one sentence.',
      'Name the objectives briefly — do not read every word.',
      'Stress that the hypothesis is something to test, not a proven result.',
    ],
  },
  {
    id: 'methodology',
    title: 'Research Methodology',
    kicker: '03 · Method',
    summary: 'Eight-week programme and five research methods',
    seconds: 50,
    notes: [
      'One-group pre-test / post-test design.',
      'Eight weeks × two sessions = sixteen planned sessions.',
      'Point at the counter: only sessions marked as completed are confirmed.',
      'Five methods: oral tests, survey, observation, interviews, reflection.',
    ],
  },
  {
    id: 'missions',
    title: 'The Eight Missions',
    kicker: '04 · Programme',
    summary: 'One communicative mission per week',
    seconds: 50,
    notes: [
      'Each mission has an objective, target phrases and a communication task.',
      'Open one card (e.g. “Escape Room Challenge”) to show the details.',
      'The missions move from simple greetings to a complex team quest.',
    ],
  },
  {
    id: 'demo',
    title: 'Live Demonstration',
    kicker: '05 · Demonstration',
    summary: 'Mission 2 “Find Your Way”, played live',
    seconds: 120,
    notes: [
      'Explain: this is a browser demonstration of the teaching method, not proof of improvement.',
      'Briefing → Vocabulary → Guide the teammate with 4–6 commands → Stop.',
      'If time is short, press “Show model route”.',
      'Finish with one follow-up question and the reflection step.',
    ],
  },
  {
    id: 'assessment',
    title: 'Speaking Assessment',
    kicker: '06 · Assessment',
    summary: 'Four criteria, 1–5 scale, 20 points',
    seconds: 40,
    notes: [
      'Four criteria, each scored from 1 to 5.',
      'The maximum total is 20 points; the minimum is 4.',
      'The same rubric is used in the pre-test and the post-test.',
    ],
  },
  {
    id: 'results',
    title: 'Results',
    kicker: '07 · Results',
    summary: 'Verified pre-test and post-test comparison',
    seconds: 40,
    notes: [
      'Only verified data are shown here.',
      'Play the “Сауалнама” video for the jury (Play button, or click the video and press Space; sound on).',
      'Any example chart is clearly marked as illustrative.',
    ],
  },
  {
    id: 'conclusion',
    title: 'Conclusion & Limitations',
    kicker: '08 · Conclusion',
    summary: 'Supported conclusions, limitations and practical value',
    seconds: 45,
    notes: [
      'Only conclude what the evidence supports.',
      'Name the main limitation: no control group, so the game alone cannot be proven to cause change.',
      'Highlight the practical value: the eight-mission package and assessment tools.',
    ],
  },
  {
    id: 'questions',
    title: 'Questions & Answers',
    kicker: '09 · Q&A',
    summary: 'Thank you — questions',
    seconds: 0,
    notes: [
      'Thank the judges for their attention.',
      'Use the overview (O) to jump to any slide when answering questions.',
      'Explore Mode (E) shows instruments, rubric, safety and references in detail.',
    ],
  },
]

export const TOTAL_SLIDES = slides.length
export const plannedSeconds = slides.reduce((s, x) => s + x.seconds, 0)
