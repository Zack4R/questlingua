import type { ComponentType } from 'react'
import type { SlideId } from '../content/slides'
import { AimSlide } from './AimSlide'
import { AssessmentSlide } from './AssessmentSlide'
import { ConclusionSlide } from './ConclusionSlide'
import { DemoSlide } from './DemoSlide'
import { MethodologySlide } from './MethodologySlide'
import { MissionsSlide } from './MissionsSlide'
import { ProblemSlide } from './ProblemSlide'
import { QuestionsSlide } from './QuestionsSlide'
import { ResultsSlide } from './ResultsSlide'
import { TitleSlide } from './TitleSlide'

export const slideComponents: Record<SlideId, ComponentType> = {
  title: TitleSlide,
  problem: ProblemSlide,
  aim: AimSlide,
  methodology: MethodologySlide,
  missions: MissionsSlide,
  demo: DemoSlide,
  assessment: AssessmentSlide,
  results: ResultsSlide,
  conclusion: ConclusionSlide,
  questions: QuestionsSlide,
}
