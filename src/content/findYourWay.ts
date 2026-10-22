// Content for the live "Find Your Way" demonstration (Mission 2).
// The city is a grid: vertical streets i = 0…4, horizontal streets j = 0…3,
// and 4 × 3 blocks between them. A node (i, j) is the crossing of street i and street j.

export type Heading = 'N' | 'E' | 'S' | 'W'
export type LandmarkIcon =
  | 'school'
  | 'library'
  | 'cafe'
  | 'hospital'
  | 'park'
  | 'supermarket'
  | 'museum'
  | 'cinema'
  | 'bus'
  | 'bank'
  | 'post'
  | 'sports'

export interface Landmark {
  id: string
  name: string
  /** block coordinates: bx 0…3, by 0…2 */
  bx: number
  by: number
  icon: LandmarkIcon
  color: string
}

export const verticalStreets = ['West Avenue', 'Park Avenue', 'King Street', 'River Street', 'East Avenue'] as const
export const horizontalStreets = ['Hill Street', 'High Street', 'Green Street', 'Station Road'] as const

export const GRID = { cols: verticalStreets.length, rows: horizontalStreets.length } as const

export const landmarks: Landmark[] = [
  { id: 'school', name: 'School', bx: 0, by: 0, icon: 'school', color: '#7dd3fc' },
  { id: 'library', name: 'Library', bx: 1, by: 0, icon: 'library', color: '#a5b4fc' },
  { id: 'cafe', name: 'Café', bx: 2, by: 0, icon: 'cafe', color: '#fcd34d' },
  { id: 'hospital', name: 'Hospital', bx: 3, by: 0, icon: 'hospital', color: '#fda4af' },
  { id: 'park', name: 'Park', bx: 0, by: 1, icon: 'park', color: '#6ee7b7' },
  { id: 'supermarket', name: 'Supermarket', bx: 1, by: 1, icon: 'supermarket', color: '#fdba74' },
  { id: 'museum', name: 'Museum', bx: 2, by: 1, icon: 'museum', color: '#c4b5fd' },
  { id: 'cinema', name: 'Cinema', bx: 3, by: 1, icon: 'cinema', color: '#f0abfc' },
  { id: 'bus', name: 'Bus Station', bx: 0, by: 2, icon: 'bus', color: '#5eead4' },
  { id: 'bank', name: 'Bank', bx: 1, by: 2, icon: 'bank', color: '#93c5fd' },
  { id: 'post', name: 'Post Office', bx: 2, by: 2, icon: 'post', color: '#fca5a5' },
  { id: 'sports', name: 'Sports Centre', bx: 3, by: 2, icon: 'sports', color: '#86efac' },
]

export interface Segment {
  a: [number, number]
  b: [number, number]
}

export interface QA {
  question: string
  answer: string
}

export interface DialogueLine {
  speaker: 'Guide' | 'Explorer'
  text: string
}

export interface Scenario {
  id: string
  title: string
  fromLandmark: string
  toLandmark: string
  start: { node: [number, number]; heading: Heading }
  closed: Segment[]
  briefing: string
  destinationHint: string
  followUp: QA[]
  dialogue: DialogueLine[]
}

export const scenarios: Scenario[] = [
  {
    id: 'station-museum',
    title: 'Bus Station → Museum',
    fromLandmark: 'bus',
    toLandmark: 'museum',
    start: { node: [1, 3], heading: 'N' },
    closed: [{ a: [1, 2], b: [2, 2] }],
    briefing:
      'Your teammate has just arrived at the Bus Station and wants to join the class tour at the Museum. They cannot see the map — only your words can guide them. Watch out: part of Green Street is closed.',
    destinationHint: 'It’s between the Supermarket and the Cinema, opposite the Café.',
    followUp: [
      { question: 'Is the museum far from the bus station?', answer: 'No, it isn’t far. It’s only about three blocks away.' },
      { question: 'What is next to the museum?', answer: 'The museum is between the supermarket and the cinema.' },
      { question: 'What is opposite the museum?', answer: 'The café is opposite the museum, across High Street.' },
      {
        question: 'Green Street is closed. Is there another way?',
        answer: 'Yes. Turn right onto Station Road, then turn left onto King Street and go straight. The museum is on your right.',
      },
    ],
    dialogue: [
      { speaker: 'Guide', text: 'Hi! Where are you now?' },
      { speaker: 'Explorer', text: 'I’m at the bus station. How do I get to the museum?' },
      { speaker: 'Guide', text: 'Go straight along Park Avenue for two blocks, past the bank and the supermarket.' },
      { speaker: 'Explorer', text: 'OK. Should I turn at the supermarket?' },
      { speaker: 'Guide', text: 'Yes. Turn right onto High Street.' },
      { speaker: 'Explorer', text: 'Turning right… I can see a library on my left.' },
      { speaker: 'Guide', text: 'Great! Go straight. The museum is on your right, opposite the café.' },
      { speaker: 'Explorer', text: 'I found it! Thank you for your help.' },
    ],
  },
  {
    id: 'school-hospital',
    title: 'School → Hospital',
    fromLandmark: 'school',
    toLandmark: 'hospital',
    start: { node: [0, 1], heading: 'E' },
    closed: [{ a: [2, 1], b: [3, 1] }],
    briefing:
      'Your teammate is standing in front of the School and needs to bring a parcel to the Hospital. Guide them there with clear directions. High Street is closed between the Museum and the Cinema.',
    destinationHint: 'It’s on the corner of Hill Street and River Street, opposite the Cinema.',
    followUp: [
      { question: 'Which street is the hospital on?', answer: 'It’s on the corner of Hill Street and River Street.' },
      { question: 'What is opposite the hospital?', answer: 'The cinema is opposite the hospital, across High Street.' },
      { question: 'Is the hospital near the café?', answer: 'Yes. It’s next to the café, just across River Street.' },
      {
        question: 'High Street is closed near the museum. What should I do?',
        answer: 'Turn left onto King Street, then turn right onto Hill Street. The hospital is on your right.',
      },
    ],
    dialogue: [
      { speaker: 'Guide', text: 'Hi! Can you hear me? Where are you?' },
      { speaker: 'Explorer', text: 'I’m in front of the school. How do I get to the hospital?' },
      { speaker: 'Guide', text: 'Go straight along High Street, past the park and the supermarket.' },
      { speaker: 'Explorer', text: 'OK… Oh no, the road is closed near the museum!' },
      { speaker: 'Guide', text: 'No problem. Turn left onto King Street and go straight to Hill Street.' },
      { speaker: 'Explorer', text: 'I’m on Hill Street now. The café is on my right.' },
      { speaker: 'Guide', text: 'Turn right. The hospital is on your right, next to the café.' },
      { speaker: 'Explorer', text: 'I can see it! Thanks a lot.' },
    ],
  },
  {
    id: 'park-post',
    title: 'Park → Post Office',
    fromLandmark: 'park',
    toLandmark: 'post',
    start: { node: [0, 2], heading: 'E' },
    closed: [{ a: [1, 2], b: [2, 2] }],
    briefing:
      'Your teammate is next to the Park and has to send a letter at the Post Office before it closes. Give directions they can follow. Green Street is closed after the Bank.',
    destinationHint: 'It’s between the Bank and the Sports Centre, opposite the Museum.',
    followUp: [
      { question: 'Is the post office near the bus station?', answer: 'Yes, it’s quite close — only two blocks away.' },
      { question: 'What is next to the post office?', answer: 'It’s between the bank and the sports centre.' },
      { question: 'What is opposite the post office?', answer: 'The museum is opposite the post office, across Green Street.' },
      {
        question: 'Green Street is closed. Which way should I go?',
        answer: 'Turn right onto Park Avenue, then turn left onto Station Road. The post office is on your left.',
      },
    ],
    dialogue: [
      { speaker: 'Guide', text: 'Hello! Where are you standing?' },
      { speaker: 'Explorer', text: 'I’m next to the park, on Green Street. How do I get to the post office?' },
      { speaker: 'Guide', text: 'Go straight along Green Street, past the bus station.' },
      { speaker: 'Explorer', text: 'Can I go straight on after that?' },
      { speaker: 'Guide', text: 'No, the road is closed. Turn right onto Park Avenue.' },
      { speaker: 'Explorer', text: 'OK, I’m on Station Road now.' },
      { speaker: 'Guide', text: 'Turn left and go straight. The post office is on your left.' },
      { speaker: 'Explorer', text: 'Is it next to the bank? … Yes, I’m here. Thank you!' },
    ],
  },
]

export interface Phrase {
  phrase: string
  example: string
}

export const phraseGroups: { id: string; title: string; phrases: Phrase[] }[] = [
  {
    id: 'directions',
    title: 'Giving directions',
    phrases: [
      { phrase: 'Go straight (on).', example: 'Go straight along Park Avenue.' },
      { phrase: 'Turn left / right.', example: 'Turn right onto High Street.' },
      { phrase: 'Go past the …', example: 'Go past the bank.' },
      { phrase: 'Take the second turning on the left.', example: 'Take the second turning on the left.' },
      { phrase: 'Stop here.', example: 'Stop here. You’re there!' },
    ],
  },
  {
    id: 'location',
    title: 'Describing location',
    phrases: [
      { phrase: 'It’s next to …', example: 'It’s next to the café.' },
      { phrase: 'It’s opposite …', example: 'It’s opposite the cinema.' },
      { phrase: 'It’s between … and …', example: 'It’s between the bank and the sports centre.' },
      { phrase: 'It’s on the corner of …', example: 'It’s on the corner of Hill Street and River Street.' },
      { phrase: 'It’s on your left / right.', example: 'The museum is on your right.' },
    ],
  },
  {
    id: 'checking',
    title: 'Asking & checking',
    phrases: [
      { phrase: 'How do I get to …?', example: 'Excuse me, how do I get to the museum?' },
      { phrase: 'Is it far from here?', example: 'Is it far from here?' },
      { phrase: 'Where are you now?', example: 'Where are you now?' },
      { phrase: 'Did you say left or right?', example: 'Sorry, did you say left or right?' },
      { phrase: 'Can you say that again, please?', example: 'Can you say that again, please?' },
    ],
  },
]

export const reflectionStatements = [
  'I gave clear, step-by-step directions.',
  'I used landmarks and place phrases (past, next to, opposite).',
  'I checked that my teammate understood me.',
] as const
