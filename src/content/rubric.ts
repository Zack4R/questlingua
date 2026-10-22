export type CriterionId = 'vocabulary' | 'grammar' | 'fluency' | 'interaction'

export interface Criterion {
  id: CriterionId
  name: string
  short: string
  question: string
  /** descriptors[0] = score 1 … descriptors[4] = score 5 */
  descriptors: [string, string, string, string, string]
}

export const SCORE_MIN = 1
export const SCORE_MAX = 5
export const TOTAL_MIN = 4
export const TOTAL_MAX = 20

export const scaleLabels: Record<number, string> = {
  1: 'Very limited',
  2: 'Limited',
  3: 'Adequate',
  4: 'Good',
  5: 'Very good',
}

export const criteria: Criterion[] = [
  {
    id: 'vocabulary',
    name: 'Vocabulary',
    short: 'Vocab',
    question: 'Does the student have the words they need?',
    descriptors: [
      'Very limited vocabulary; isolated words; meaning is often unclear.',
      'Limited vocabulary; frequent gaps and wrong word choices sometimes block meaning.',
      'Adequate vocabulary for familiar topics; some repetition and errors, but meaning is mostly clear.',
      'Good range of topic vocabulary; occasional word-choice errors do not affect meaning.',
      'Wide range of vocabulary used accurately and flexibly; can paraphrase when a word is missing.',
    ],
  },
  {
    id: 'grammar',
    name: 'Grammatical Accuracy',
    short: 'Grammar',
    question: 'Are sentences built correctly?',
    descriptors: [
      'Little control of basic structures; errors prevent communication.',
      'Frequent errors even in simple sentences; meaning is sometimes unclear.',
      'Reasonable control of simple structures; noticeable errors, but meaning is generally clear.',
      'Good control of simple structures; some errors in more complex sentences.',
      'Simple and some complex structures are used accurately; errors are rare.',
    ],
  },
  {
    id: 'fluency',
    name: 'Fluency & Pronunciation',
    short: 'Fluency',
    question: 'Is speech smooth and easy to understand?',
    descriptors: [
      'Speech is very fragmented; pronunciation is often difficult to understand.',
      'Frequent long pauses; pronunciation errors sometimes cause misunderstanding.',
      'Noticeable pauses and self-correction; pronunciation is mostly understandable.',
      'Speaks with some hesitation; pronunciation is generally clear with minor errors.',
      'Speaks smoothly at a natural pace; pronunciation is clear and easy to understand.',
    ],
  },
  {
    id: 'interaction',
    name: 'Interactive Communication',
    short: 'Interaction',
    question: 'Does the student start, keep and develop a conversation?',
    descriptors: [
      'Rarely responds or takes part; communication breaks down.',
      'Limited participation; relies heavily on prompts from a partner or the teacher.',
      'Takes part and responds relevantly, but answers are brief and some prompting is needed.',
      'Keeps the interaction going with little support; responds appropriately.',
      'Starts, maintains and develops interaction naturally; asks follow-up questions.',
    ],
  },
]
