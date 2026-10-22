export type SafetyIconName = 'lock' | 'user' | 'mic-off' | 'shield' | 'coins' | 'clock' | 'file' | 'heart'

export interface SafetyItem {
  icon: SafetyIconName
  title: string
  text: string
}

export const safetyItems: SafetyItem[] = [
  {
    icon: 'lock',
    title: 'Private, teacher-controlled game space',
    text: 'Missions take place in a private server or experience that only the class can join, set up and supervised by the teacher.',
  },
  {
    icon: 'mic-off',
    title: 'Speaking happens face to face',
    text: 'Students speak to each other in the classroom. In-game text and voice chat with strangers are not needed and should be switched off.',
  },
  {
    icon: 'user',
    title: 'No personal information online',
    text: 'Students use nicknames that do not reveal their full name, school or location, and never share passwords or contact details.',
  },
  {
    icon: 'shield',
    title: 'Age guidelines & parental controls',
    text: 'The teacher follows the platform’s current age guidelines and parental-control settings; parents and guardians are informed before the programme starts.',
  },
  {
    icon: 'coins',
    title: 'No purchases required',
    text: 'All missions use free content. Students are never asked to buy virtual currency or items.',
  },
  {
    icon: 'clock',
    title: 'Limited screen time',
    text: 'Gameplay is only one part of each lesson and is followed by speaking and reflection tasks away from the screen.',
  },
  {
    icon: 'file',
    title: 'Consent & anonymised data',
    text: 'Participation is voluntary, with consent from the school and parents / guardians. Results are stored under codes (S01, S02 …), not names.',
  },
  {
    icon: 'heart',
    title: 'Respectful behaviour rules',
    text: 'Clear class rules for kind communication; students know how to report a problem to the teacher immediately.',
  },
]
