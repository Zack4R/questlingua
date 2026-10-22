import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import fileRecordJson from '../content/research-record.json'
import { criteria, SCORE_MAX, SCORE_MIN, type CriterionId } from '../content/rubric'
import { programme } from '../content/methodology'
import { storage } from './storage'

export type Scores = Record<CriterionId, number>

export interface ParticipantResult {
  id: string
  pre: Scores
  post: Scores
}

export interface VerifiedResults {
  verified: true
  verifiedBy: string
  verifiedOn: string
  note?: string
  participants: ParticipantResult[]
}

export interface ResearchRecord {
  completedSessions: number[]
  results: VerifiedResults | null
  updatedAt?: string
}

export type RecordSource = 'file' | 'device'

const STORAGE_KEY = 'questlingua.record.v1'

// ── Validation ────────────────────────────────────────────────────────────────

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)

function parseScores(v: unknown, where: string, errors: string[]): Scores | null {
  if (!isObj(v)) {
    errors.push(`${where}: scores are missing.`)
    return null
  }
  const out = {} as Scores
  for (const c of criteria) {
    const n = v[c.id]
    if (typeof n !== 'number' || !Number.isInteger(n) || n < SCORE_MIN || n > SCORE_MAX) {
      errors.push(`${where}: “${c.name}” must be a whole number from ${SCORE_MIN} to ${SCORE_MAX}.`)
      return null
    }
    out[c.id] = n
  }
  return out
}

export function parseRecord(input: unknown): { record: ResearchRecord | null; errors: string[] } {
  const errors: string[] = []
  if (!isObj(input)) return { record: null, errors: ['The record must be a JSON object.'] }

  const rawSessions = Array.isArray(input.completedSessions) ? input.completedSessions : []
  const completedSessions = [...new Set(rawSessions)]
    .filter((n): n is number => typeof n === 'number' && Number.isInteger(n) && n >= 1 && n <= programme.plannedSessions)
    .sort((a, b) => a - b)
  if (rawSessions.length !== completedSessions.length) errors.push(`Completed sessions must be unique numbers from 1 to ${programme.plannedSessions}.`)

  let results: VerifiedResults | null = null
  if (input.results != null) {
    const r = input.results
    if (!isObj(r)) errors.push('“results” must be an object or null.')
    else if (r.verified !== true) errors.push('Results are only accepted when “verified” is true.')
    else if (!Array.isArray(r.participants) || r.participants.length === 0) errors.push('Results need at least one participant.')
    else {
      const participants: ParticipantResult[] = []
      const ids = new Set<string>()
      r.participants.forEach((p, idx) => {
        const where = `Participant ${idx + 1}`
        if (!isObj(p) || typeof p.id !== 'string' || !p.id.trim()) {
          errors.push(`${where}: a participant code is required.`)
          return
        }
        if (ids.has(p.id.trim())) errors.push(`${where}: the code “${p.id}” is used twice.`)
        ids.add(p.id.trim())
        const pre = parseScores(p.pre, `${p.id} pre-test`, errors)
        const post = parseScores(p.post, `${p.id} post-test`, errors)
        if (pre && post) participants.push({ id: p.id.trim(), pre, post })
      })
      if (typeof r.verifiedBy !== 'string' || !r.verifiedBy.trim()) errors.push('Enter who verified the scores (verifiedBy).')
      if (typeof r.verifiedOn !== 'string' || !r.verifiedOn.trim()) errors.push('Enter the date of verification (verifiedOn).')
      if (!errors.length)
        results = {
          verified: true,
          verifiedBy: String(r.verifiedBy).trim(),
          verifiedOn: String(r.verifiedOn).trim(),
          note: typeof r.note === 'string' && r.note.trim() ? r.note.trim() : undefined,
          participants,
        }
    }
  }

  if (errors.length) return { record: null, errors }
  return {
    record: { completedSessions, results, updatedAt: typeof input.updatedAt === 'string' ? input.updatedAt : undefined },
    errors,
  }
}

const parsedFile = parseRecord(fileRecordJson)
if (parsedFile.errors.length) console.error('research-record.json is invalid:', parsedFile.errors)
const fileRecord: ResearchRecord = parsedFile.record ?? { completedSessions: [], results: null }

function readDeviceRecord(): ResearchRecord | null {
  const raw = storage.get(STORAGE_KEY)
  if (!raw) return null
  try {
    return parseRecord(JSON.parse(raw)).record
  } catch {
    return null
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

interface RecordContextValue {
  record: ResearchRecord
  source: RecordSource
  hasVerifiedResults: boolean
  saveRecord: (next: ResearchRecord) => void
  resetToFile: () => void
  exportJson: () => string
  fileRecord: ResearchRecord
}

const RecordContext = createContext<RecordContextValue | null>(null)

export function ResearchRecordProvider({ children }: { children: ReactNode }) {
  const [deviceRecord, setDeviceRecord] = useState<ResearchRecord | null>(() => readDeviceRecord())

  // keep several open windows (presentation + presenter view) in sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setDeviceRecord(readDeviceRecord())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const saveRecord = useCallback((next: ResearchRecord) => {
    const stamped = { ...next, updatedAt: new Date().toISOString() }
    storage.set(STORAGE_KEY, JSON.stringify(stamped))
    setDeviceRecord(stamped)
  }, [])

  const resetToFile = useCallback(() => {
    storage.remove(STORAGE_KEY)
    setDeviceRecord(null)
  }, [])

  const record = deviceRecord ?? fileRecord
  const source: RecordSource = deviceRecord ? 'device' : 'file'

  const value = useMemo<RecordContextValue>(
    () => ({
      record,
      source,
      hasVerifiedResults: !!record.results && record.results.verified && record.results.participants.length > 0,
      saveRecord,
      resetToFile,
      exportJson: () =>
        JSON.stringify(
          {
            _readme:
              'Verified research record exported from QuestLingua. Replace src/content/research-record.json with this file and redeploy to make it permanent.',
            ...record,
          },
          null,
          2,
        ),
      fileRecord,
    }),
    [record, source, saveRecord, resetToFile],
  )

  return <RecordContext.Provider value={value}>{children}</RecordContext.Provider>
}

export function useResearchRecord() {
  const ctx = useContext(RecordContext)
  if (!ctx) throw new Error('useResearchRecord must be used inside ResearchRecordProvider')
  return ctx
}
