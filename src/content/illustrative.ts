import type { ParticipantResult } from '../lib/record'

// ⚠ ILLUSTRATIVE DATA — NOT ACTUAL EXPERIMENTAL RESULTS.
// A made-up example that only shows how the results dashboard will look once
// real scores are entered. It must never be quoted as a finding.

export const ILLUSTRATIVE_LABEL = 'ILLUSTRATIVE DATA — NOT ACTUAL EXPERIMENTAL RESULTS'

const p = (id: string, pre: number[], post: number[]): ParticipantResult => ({
  id,
  pre: { vocabulary: pre[0], grammar: pre[1], fluency: pre[2], interaction: pre[3] },
  post: { vocabulary: post[0], grammar: post[1], fluency: post[2], interaction: post[3] },
})

export const illustrativeParticipants: ParticipantResult[] = [
  p('X01', [3, 2, 2, 3], [3, 3, 3, 3]),
  p('X02', [2, 2, 3, 2], [3, 2, 3, 3]),
  p('X03', [4, 3, 3, 4], [4, 3, 4, 4]),
  p('X04', [3, 3, 2, 2], [3, 3, 2, 3]),
  p('X05', [2, 2, 2, 2], [2, 2, 3, 2]),
  p('X06', [3, 3, 3, 3], [3, 2, 3, 3]),
]
