export const surveyScale = [
  { value: 1, label: 'Strongly disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Not sure' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly agree' },
] as const

export const surveyStatements = [
  'I enjoyed speaking English during the game missions.',
  'I feel more confident speaking English with my classmates.',
  'The missions helped me learn new English words and phrases.',
  'I was less afraid of making mistakes during the missions.',
  'Working in a team encouraged me to speak more.',
  'The mission tasks were clear and easy to follow.',
  'I mostly used English, not another language, during the missions.',
  'I would like to have game-based speaking activities in future English lessons.',
] as const

export const observationScale = ['Not observed', 'Sometimes', 'Often'] as const

export const observationIndicators = [
  'Uses the mission’s target phrases',
  'Starts a conversation without being asked',
  'Asks questions to teammates',
  'Responds to a partner in English',
  'Asks for clarification or repetition in English',
  'Self-corrects mistakes',
  'Switches to another language instead of English',
  'Stays on task and cooperates with the team',
] as const

export const observationFields = ['Date', 'Session no.', 'Mission', 'Group / student code', 'Observer'] as const

export const interviewQuestions = [
  'What did you like most about the game missions? Why?',
  'Which mission helped you speak English the most? Why?',
  'Did you feel more or less confident when speaking English during the missions? Can you give an example?',
  'What was difficult for you during the missions?',
  'What would you change to make the activities better?',
] as const

export const reflectionPrompts = [
  'Today I learned …',
  'The phrase I used most was …',
  'I felt confident when …',
  'It was difficult for me to …',
  'Next time I want to improve …',
] as const
