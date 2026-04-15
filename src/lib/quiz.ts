import type { CivicsQuestion } from '../types'
import { STATE_TO_CAPITAL } from '../data/usStates'

export const UNGRADED_QUESTION_IDS = new Set<number>([
  // Location-dependent (varies by user)
  23, // one of your state's U.S. senators
  29, // your U.S. representative
  61, // governor of your state
  // Keep district/state-executive questions ungraded by default
])

export function isUngradedQuestion(question: Pick<CivicsQuestion, 'id'>): boolean {
  return UNGRADED_QUESTION_IDS.has(question.id)
}

const OFFICIAL_ANSWER_OVERRIDES: Partial<Record<number, string[]>> = {
  // As of 2026-04-15 (today)
  30: ['Mike Johnson'],
  38: ['Donald Trump', 'Trump'],
  39: ['JD Vance', 'J.D. Vance', 'Vance'],
  57: ['John Roberts', 'John G. Roberts', 'John G. Roberts, Jr.', 'Roberts'],
}

export function shuffle<T>(items: T[]): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

export function normalizeAnswer(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.]/g, '')
    .trim()
}

function canonicalizeForMatch(s: string): string {
  return normalizeAnswer(s)
    .replace(/^[\s]*(the|a|an)\s+/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const STOP_WORDS = new Set([
  'the',
  'a',
  'an',
  'of',
  'to',
  'for',
  'in',
  'on',
  'and',
  'or',
])

const IRREGULAR_STEMS: Record<string, string> = {
  freed: 'free',
  freeing: 'free',
  fought: 'fight',
}

function stemToken(token: string): string {
  const irregular = IRREGULAR_STEMS[token]
  if (irregular) return irregular

  if (token.length > 5 && token.endsWith('ing')) return token.slice(0, -3)
  if (token.length > 4 && token.endsWith('ed')) return token.slice(0, -2)
  if (token.length > 4 && token.endsWith('es')) return token.slice(0, -2)
  if (token.length > 3 && token.endsWith('s')) return token.slice(0, -1)
  return token
}

function tokenSignature(s: string): string {
  return canonicalizeForMatch(s)
    .split(' ')
    .filter(Boolean)
    .filter((t) => !STOP_WORDS.has(t))
    .map(stemToken)
    .sort()
    .join(' ')
}

/** Any choice matching one of the acceptable answers (normalized) is correct */
export function isCorrectChoice(
  question: CivicsQuestion,
  choice: string,
  ctx?: { stateName?: string },
): boolean {
  const requiredCount = getRequiredItemCount(question.question)
  if (requiredCount > 1) {
    const allowed = getAcceptableAnswersForQuestion(question, ctx)
    const userParts = splitUserListAnswer(choice)
    const matched = new Set<number>()

    for (const part of userParts) {
      for (let i = 0; i < allowed.length; i++) {
        if (matched.has(i)) continue
        if (isTextMatch(part, allowed[i]!)) {
          matched.add(i)
          break
        }
      }
    }

    return matched.size >= requiredCount
  }

  const allowed = getAcceptableAnswersForQuestion(question, ctx)
  return allowed.some((a) => isTextMatch(choice, a))
}

function getAcceptableAnswersForQuestion(
  question: CivicsQuestion,
  ctx?: { stateName?: string },
): string[] {
  // State-specific grading (hardcoded list)
  if (question.id === 62) {
    const state = ctx?.stateName?.toLowerCase().trim()
    const capital = state ? STATE_TO_CAPITAL.get(state) : undefined
    return capital ? [capital] : []
  }

  const overridden = OFFICIAL_ANSWER_OVERRIDES[question.id]
  if (overridden?.length) {
    return overridden
  }

  return question.acceptableAnswers
}

export function getAcceptableAnswersForDisplay(
  question: CivicsQuestion,
  ctx?: { stateName?: string },
): string[] {
  const gradingAnswers = getAcceptableAnswersForQuestion(question, ctx)
  const out: string[] = []
  const seen = new Set<string>()

  const pushUnique = (value: string) => {
    const key = value.trim().toLowerCase()
    if (!key || seen.has(key)) return
    seen.add(key)
    out.push(value)
  }

  for (const a of gradingAnswers) pushUnique(a)
  for (const a of question.acceptableAnswers) pushUnique(a)

  return out
}

function getRequiredItemCount(questionText: string): number {
  const q = questionText.toLowerCase()
  if (/\b(name|what are)\s+five\b/.test(q)) return 5
  if (/\b(name|what are)\s+three\b/.test(q)) return 3
  if (/\b(name|what are)\s+two\b/.test(q)) return 2
  return 1
}

function splitUserListAnswer(input: string): string[] {
  return input
    .replace(/\s+and\s+/gi, ',')
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function isTextMatch(choice: string, acceptable: string): boolean {
  const n = normalizeAnswer(choice)
  const c = canonicalizeForMatch(choice)
  const sig = tokenSignature(choice)

  for (const variant of acceptableVariants(acceptable)) {
    const normalized = normalizeAnswer(variant)
    if (normalized === n) return true
    if (canonicalizeForMatch(variant) === c) return true
    if (tokenSignature(variant) === sig) return true
  }

  return false
}

function acceptableVariants(acceptable: string): string[] {
  const out = new Set<string>()
  out.add(acceptable)

  // Parenthesized text in USCIS answer keys is often optional phrasing.
  // Example: "(Because there were) 13 original colonies" should accept "13 original colonies".
  const withoutParen = acceptable.replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim()
  if (withoutParen.length > 0) out.add(withoutParen)

  return [...out]
}

const FALLBACK_DISTRACTORS = [
  'The mayor writes federal laws.',
  'The Constitution has 10 amendments.',
  'The judicial branch declares war.',
  'U.S. senators serve two-year terms.',
  'The capital of the United States is New York City.',
  'The Civil War was fought in the 1700s.',
]

export function buildMultipleChoice(
  question: CivicsQuestion,
  pool: CivicsQuestion[],
): { options: string[]; correctIndex: number } {
  const correct =
    question.acceptableAnswers[Math.floor(Math.random() * question.acceptableAnswers.length)]!

  const acceptableNorm = new Set(question.acceptableAnswers.map(normalizeAnswer))

  const candidates: string[] = []
  for (const other of pool) {
    if (other.id === question.id) continue
    for (const ans of other.acceptableAnswers) {
      if (acceptableNorm.has(normalizeAnswer(ans))) continue
      if (normalizeAnswer(ans) === normalizeAnswer(correct)) continue
      candidates.push(ans)
    }
  }

  const seen = new Set<string>()
  const unique: string[] = []
  for (const c of shuffle(candidates)) {
    const key = normalizeAnswer(c)
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(c)
    }
  }

  const wrong: string[] = unique.slice(0, 3)
  let fb = 0
  while (wrong.length < 3) {
    const d = FALLBACK_DISTRACTORS[fb % FALLBACK_DISTRACTORS.length]!
    fb++
    if (!wrong.includes(d) && normalizeAnswer(d) !== normalizeAnswer(correct)) {
      wrong.push(d)
    }
  }

  const options = shuffle([correct, ...wrong])
  const correctIndex = options.findIndex((o) => normalizeAnswer(o) === normalizeAnswer(correct))
  return { options, correctIndex }
}

export function filterPool(questions: CivicsQuestion[], only6520: boolean): CivicsQuestion[] {
  return only6520 ? questions.filter((q) => q.is6520) : questions
}
