import { criteria, type CriterionId } from '../content/rubric'
import type { ParticipantResult, Scores } from './record'

export const total = (s: Scores) => criteria.reduce((sum, c) => sum + s[c.id], 0)

export const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0)

/** Sample standard deviation (n − 1). Returns 0 for fewer than two values. */
export function sd(xs: number[]) {
  if (xs.length < 2) return 0
  const m = mean(xs)
  return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1))
}

export function median(xs: number[]) {
  if (!xs.length) return 0
  const s = [...xs].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

export interface CriterionSummary {
  id: CriterionId
  name: string
  short: string
  preMean: number
  postMean: number
  preSd: number
  postSd: number
  change: number
}

export interface ResultsSummary {
  n: number
  criteria: CriterionSummary[]
  totalPreMean: number
  totalPostMean: number
  totalPreSd: number
  totalPostSd: number
  meanChange: number
  medianChange: number
  improved: number
  unchanged: number
  declined: number
  /** criteria sharing the largest positive mean change (several when tied) */
  largestChange: CriterionSummary[]
  participants: { id: string; pre: number; post: number; change: number }[]
}

export function summarise(participants: ParticipantResult[]): ResultsSummary {
  const crit = criteria.map((c) => {
    const pre = participants.map((p) => p.pre[c.id])
    const post = participants.map((p) => p.post[c.id])
    return {
      id: c.id,
      name: c.name,
      short: c.short,
      preMean: mean(pre),
      postMean: mean(post),
      preSd: sd(pre),
      postSd: sd(post),
      change: mean(post) - mean(pre),
    }
  })
  const rows = participants.map((p) => {
    const pre = total(p.pre)
    const post = total(p.post)
    return { id: p.id, pre, post, change: post - pre }
  })
  const changes = rows.map((r) => r.change)
  const maxChange = Math.max(...crit.map((c) => c.change))
  const largest = maxChange > 0 ? crit.filter((c) => Math.abs(c.change - maxChange) < 1e-9) : []
  return {
    n: participants.length,
    criteria: crit,
    totalPreMean: mean(rows.map((r) => r.pre)),
    totalPostMean: mean(rows.map((r) => r.post)),
    totalPreSd: sd(rows.map((r) => r.pre)),
    totalPostSd: sd(rows.map((r) => r.post)),
    meanChange: mean(changes),
    medianChange: median(changes),
    improved: changes.filter((c) => c > 0).length,
    unchanged: changes.filter((c) => c === 0).length,
    declined: changes.filter((c) => c < 0).length,
    largestChange: largest,
    participants: rows,
  }
}

export const fmt = (n: number, digits = 1) => n.toFixed(digits)
export const signed = (n: number, digits = 1) => `${n > 0 ? '+' : n < 0 ? '−' : '±'}${Math.abs(n).toFixed(digits)}`
