// ─────────────────────────────────────────────────────────────────────────────
// Core research content. This file is the single source of truth for the
// wording shown in the presentation. Edit text here, never inside components.
// ─────────────────────────────────────────────────────────────────────────────

export const project = {
  brand: 'QuestLingua',
  title: 'The Impact of Roblox-Based Game Activities on Students’ English Speaking Skills',
  shortTitle: 'Roblox-Based Game Activities & English Speaking Skills',
  student: 'Yersary Ilyas',
  grade: 'Grade 9',
  school: 'School No. 14',
  supervisor: 'Aliyeva Zuhra',
  city: 'Taldykorgan',
  researchQuestion: 'How can guided Roblox-based game activities support students’ English-speaking skills?',
} as const

export const problem = {
  lead:
    'Students often know English words and grammar rules, yet hesitate when they have to speak spontaneously.',
  whySpeakingMatters: [
    {
      title: 'Real communication',
      text: 'Speaking is the skill students need most when they use English outside the classroom.',
    },
    {
      title: 'Limited practice time',
      text: 'In a full class, each student has only a few minutes to speak during a typical lesson.',
    },
    {
      title: 'Fear of mistakes',
      text: 'Many learners feel anxious speaking in front of others, so they stay silent.',
    },
    {
      title: 'Few real contexts',
      text: 'Textbook dialogues rarely give students a genuine reason to communicate.',
    },
  ],
  gap: {
    from: 'Knows words & rules',
    to: 'Speaks with confidence',
    bridge: ['Purpose', 'Roles', 'Teamwork', 'Safe practice'],
  },
  idea:
    'Game worlds create a shared goal and a reason to talk. This research investigates whether guided, teacher-designed missions in Roblox can turn that motivation into structured speaking practice.',
} as const

export const aim =
  'To investigate the impact of guided Roblox-based game activities on students’ English speaking skills and to develop an eight-mission speaking programme that teachers can use in the classroom.'

export const objectives = [
  'Review the literature on game-based and task-based approaches to developing speaking skills.',
  'Design eight guided Roblox-based speaking missions with clear objectives, target phrases and communication tasks.',
  'Assess students’ speaking skills before and after the eight-week programme using a four-criterion oral rubric.',
  'Collect students’ opinions through a five-point survey, short interviews and learner reflections.',
  'Analyse the results and formulate practical recommendations, taking the limitations of the design into account.',
] as const

export const hypothesis = {
  statement:
    'If students take part in an eight-week programme of guided Roblox-based speaking missions, their oral test scores in vocabulary, grammatical accuracy, fluency & pronunciation and interactive communication will be higher in the post-test than in the pre-test.',
  status: 'To be tested — this is an assumption under investigation, not a result.',
  variables: {
    independent: 'Guided Roblox-based speaking missions (8 weeks, 16 sessions)',
    dependent: 'Oral speaking score on the four-criterion rubric (4–20 points)',
  },
} as const

export const practicalValue = [
  {
    title: 'Ready-to-use teaching package',
    text: 'Eight missions with objectives, target phrases and communication tasks that a teacher can run in sequence.',
  },
  {
    title: 'Transparent assessment',
    text: 'A four-criterion rubric (1–5 per criterion, 20 points in total) that can be reused for any speaking task.',
  },
  {
    title: 'Research instruments',
    text: 'Survey, observation checklist, interview questions and reflection sheets that other students and teachers can adapt.',
  },
  {
    title: 'Motivating context',
    text: 'A way to connect a game environment students already enjoy with structured speaking practice in the classroom.',
  },
] as const

export const limitations = [
  {
    title: 'No control group',
    text: 'A one-group pre-test/post-test design cannot separate the effect of the missions from other influences.',
  },
  {
    title: 'Other factors',
    text: 'Regular English lessons, maturation and private study may also change scores during eight weeks.',
  },
  {
    title: 'Testing effect',
    text: 'Students may perform better in the post-test simply because the test format is already familiar.',
  },
  {
    title: 'Small sample & short period',
    text: 'One school and eight weeks limit how far the findings can be generalised.',
  },
  {
    title: 'Rater subjectivity',
    text: 'Oral scoring involves judgement; a second independent rater would make scores more reliable.',
  },
  {
    title: 'Novelty effect',
    text: 'A new and exciting format may raise motivation temporarily.',
  },
] as const

export const expectedOutcomes = [
  'Students may use mission target phrases more readily in spoken tasks.',
  'Students may report more confidence and less anxiety when speaking with classmates.',
  'Interactive communication (asking, responding, clarifying) may improve through team tasks.',
  'Teachers obtain a tested sequence of eight missions with assessment tools.',
] as const

export const futureSteps = [
  'Complete all 16 sessions and record which sessions actually took place.',
  'Administer the oral post-test with the same rubric and conditions as the pre-test.',
  'Compare pre-test and post-test scores and analyse survey, observation and interview data.',
  'In future research: add a control group, a second rater and a longer programme.',
] as const
