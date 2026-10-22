export type MissionIconName =
  | 'hand'
  | 'map'
  | 'cart'
  | 'key'
  | 'blocks'
  | 'siren'
  | 'flag'
  | 'trophy'

export interface Mission {
  number: number
  week: number
  slug: string
  title: string
  tagline: string
  icon: MissionIconName
  /** Accent hue used for the card glow (CSS color). */
  accent: string
  objective: string
  targetPhrases: string[]
  communicationTask: string
  roles: string[]
  languageFocus: string
  gameSetting: string
}

export const missions: Mission[] = [
  {
    number: 1,
    week: 1,
    slug: 'welcome-to-the-world',
    title: 'Welcome to the World',
    tagline: 'Greet, introduce, connect',
    icon: 'hand',
    accent: '#5ee7ff',
    objective: 'Greet teammates, introduce yourself and ask simple personal questions.',
    targetPhrases: [
      'Hi, my name is …',
      'Nice to meet you!',
      'Where are you from?',
      'What do you like doing?',
      'I’m good at …',
      'Can you help me, please?',
    ],
    communicationTask:
      'In the starting lobby, each student introduces their avatar to two teammates, asks three questions and then tells the class one fact about a partner.',
    roles: ['Newcomer', 'Host'],
    languageFocus: 'Present simple, question forms',
    gameSetting: 'Starting lobby',
  },
  {
    number: 2,
    week: 2,
    slug: 'find-your-way',
    title: 'Find Your Way',
    tagline: 'Ask for and give directions',
    icon: 'map',
    accent: '#7dd3fc',
    objective: 'Ask for and give clear directions using landmarks and prepositions of place.',
    targetPhrases: [
      'How do I get to …?',
      'Go straight on.',
      'Turn left / right at …',
      'Go past the …',
      'It’s next to / opposite / between …',
      'You can’t miss it.',
    ],
    communicationTask:
      'The Guide sees the map and gives step-by-step directions; the Explorer cannot see the route and must reach the destination by listening. Then the students swap roles.',
    roles: ['Guide', 'Explorer'],
    languageFocus: 'Imperatives, prepositions of place',
    gameSetting: 'City map',
  },
  {
    number: 3,
    week: 3,
    slug: 'the-budget-shop',
    title: 'The Budget Shop',
    tagline: 'Buy, compare, negotiate',
    icon: 'cart',
    accent: '#a5b4fc',
    objective: 'Ask about prices, compare items and agree on a team shopping list within a budget.',
    targetPhrases: [
      'How much is / are …?',
      'It costs … coins.',
      'That’s too expensive.',
      'It’s cheaper than …',
      'Can I have …, please?',
      'I’ll take it.',
    ],
    communicationTask:
      'The team has 100 virtual coins to buy equipment for a quest. Students discuss options with the shopkeeper, compare prices and justify their final list.',
    roles: ['Shopkeeper', 'Customers'],
    languageFocus: 'Comparatives, polite requests, numbers',
    gameSetting: 'Market place',
  },
  {
    number: 4,
    week: 4,
    slug: 'escape-room-challenge',
    title: 'Escape Room Challenge',
    tagline: 'Share clues, solve together',
    icon: 'key',
    accent: '#c4b5fd',
    objective: 'Exchange information, make suggestions and agree or disagree politely to solve puzzles.',
    targetPhrases: [
      'What does your clue say?',
      'I think we should …',
      'Let’s try …',
      'Maybe it’s …',
      'I agree. / I’m not sure.',
      'What about …?',
    ],
    communicationTask:
      'Each teammate holds a different clue. Only by describing their clues aloud can the team open the door before the timer ends.',
    roles: ['Clue holders', 'Team leader'],
    languageFocus: 'Suggestions, modal verbs (might, could, should)',
    gameSetting: 'Escape room',
  },
  {
    number: 5,
    week: 5,
    slug: 'build-and-describe',
    title: 'Build and Describe',
    tagline: 'Describe precisely, rebuild accurately',
    icon: 'blocks',
    accent: '#67e8f9',
    objective: 'Describe shapes, colours, sizes and positions precisely enough for a partner to rebuild an object.',
    targetPhrases: [
      'There is a … on top of …',
      'On the left side, there are …',
      'It’s made of …',
      'It looks like …',
      'It’s bigger / smaller than …',
      'Put the blue block next to …',
    ],
    communicationTask:
      'One student builds a structure, then describes it so that a partner can rebuild it without looking. The pair compares the two builds and explains the differences.',
    roles: ['Builder', 'Describer'],
    languageFocus: 'There is / there are, prepositions, adjectives',
    gameSetting: 'Building area',
  },
  {
    number: 6,
    week: 6,
    slug: 'emergency-mission',
    title: 'Emergency Mission',
    tagline: 'Report, explain, coordinate',
    icon: 'siren',
    accent: '#f0abfc',
    objective: 'Report a problem, explain what happened and give clear instructions under time pressure.',
    targetPhrases: [
      'Help! There’s a problem!',
      'What happened?',
      'The bridge is broken.',
      'First …, then …, finally …',
      'Be careful! / Hurry up!',
      'We need to …',
    ],
    communicationTask:
      'A fictional emergency (a broken bridge or a flood) appears in the game world. The team reports it to the “rescue centre”, describes the situation and agrees on a rescue plan.',
    roles: ['Reporter', 'Rescue coordinator'],
    languageFocus: 'Past simple, sequencing words, imperatives',
    gameSetting: 'Rescue scenario',
  },
  {
    number: 7,
    week: 7,
    slug: 'become-a-tour-guide',
    title: 'Become a Tour Guide',
    tagline: 'Present a place, answer questions',
    icon: 'flag',
    accent: '#93c5fd',
    objective: 'Present a place in the game world, describe its features and answer the audience’s questions.',
    targetPhrases: [
      'Welcome to …!',
      'On your left, you can see …',
      'This place is famous for …',
      'It was built …',
      'I recommend …',
      'Does anyone have any questions?',
    ],
    communicationTask:
      'Each student prepares a one- to two-minute guided tour of a location for classmates. The “tourists” must ask at least two follow-up questions.',
    roles: ['Tour guide', 'Tourists'],
    languageFocus: 'Superlatives, simple passive, presentation language',
    gameSetting: 'Landmark tour',
  },
  {
    number: 8,
    week: 8,
    slug: 'the-final-team-quest',
    title: 'The Final Team Quest',
    tagline: 'Plan, negotiate, complete, reflect',
    icon: 'trophy',
    accent: '#5eead4',
    objective: 'Combine all mission skills to plan and complete a multi-stage quest and report on it.',
    targetPhrases: [
      'Our plan is to …',
      'Who will …?',
      'I can do it.',
      'Let’s split up.',
      'Well done, team!',
      'Next time, we should …',
    ],
    communicationTask:
      'Teams complete a quest that combines directions, shopping, problem-solving and describing, then give a short spoken team report about what they did and learned.',
    roles: ['Team leader', 'Navigator', 'Speaker'],
    languageFocus: 'Future forms (will / going to), review',
    gameSetting: 'Multi-stage quest',
  },
]
