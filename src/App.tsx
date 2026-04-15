import { useCallback, useMemo, useState } from 'react'
import { CIVICS_QUESTIONS } from './data/civicsQuestions'
import {
  getAcceptableAnswersForDisplay,
  isCorrectChoice,
  isUngradedQuestion,
  normalizeAnswer,
  shuffle,
} from './lib/quiz'
import type { AppView, CivicsQuestion } from './types'

type ExamKind = 'standard' | '6520'

function HeaderBar({
  title,
  onBack,
}: {
  title: string
  onBack: () => void
}) {
  return (
    <header className="border-b border-white/10 bg-navy-900/80 px-4 py-4 backdrop-blur-md sm:px-8">
      <div className="mx-auto flex max-w-3xl items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-white/20 px-3 py-1.5 text-sm font-medium text-parchment/90 transition hover:bg-white/10"
        >
          ← Home
        </button>
        <h1 className="text-lg font-semibold tracking-tight text-parchment">{title}</h1>
      </div>
    </header>
  )
}

function Home({
  onExam,
}: {
  onExam: (kind: ExamKind) => void
}) {
  return (
    <div className="min-h-svh bg-linear-to-b from-navy-950 via-navy-900 to-navy-950 text-parchment">
      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-16 sm:px-8">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-parchment/60">
            USCIS Civics Test (2025 list)
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Citizenship Civics Test Practice
          </h1>
          <div className="mx-auto mt-4 max-w-xl text-pretty text-parchment/80">
            <p>
              The USCIS officer may ask up to 20 questions from the official list. This app simulates that experience using typed answers.
            </p>
            <p className="mt-3 text-sm text-parchment/70">
              <span className="font-semibold text-parchment/85">65/20 special consideration:</span>{' '}
              If you are <span className="font-semibold">65+</span> and have been a lawful permanent resident for{' '}
              <span className="font-semibold">20+ years</span>, USCIS may administer the civics test using only the 20 asterisk questions (asked 10; pass 6).
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onExam('standard')}
            className="rounded-2xl border border-white/10 bg-navy-800/60 p-6 text-left shadow-lg transition hover:border-accent/40 hover:bg-navy-800"
          >
            <h2 className="text-xl font-semibold">Standard civics test</h2>
            <p className="mt-2 text-sm text-parchment/75">
              20 questions from the full 128-question list. Passing target: 12 correct.
            </p>
          </button>
          <button
            type="button"
            onClick={() => onExam('6520')}
            className="rounded-2xl border border-accent/30 bg-navy-800/60 p-6 text-left shadow-lg transition hover:border-accent/50 hover:bg-navy-800"
          >
            <h2 className="text-xl font-semibold">65/20 special consideration</h2>
            <p className="mt-2 text-sm text-parchment/75">
              10 questions from the 20 asterisk questions only. Passing target: 6 correct. Available for eligible applicants (65+ and 20+ years as an LPR).
            </p>
          </button>
        </div>

        <p className="text-center text-xs text-parchment/50">
          Some answers change with elections. Check{' '}
          <a
            className="underline decoration-parchment/30 underline-offset-2 hover:text-parchment"
            href="https://www.uscis.gov/citizenship/testupdates"
            target="_blank"
            rel="noreferrer"
          >
            uscis.gov/citizenship/testupdates
          </a>{' '}
          before your interview.
        </p>
      </div>
    </div>
  )
}

function ExamView({
  onBack,
  questions,
  kind,
  userStateName,
  onResolveState,
}: {
  onBack: () => void
  questions: CivicsQuestion[]
  kind: ExamKind
  userStateName: string | null
  onResolveState: () => Promise<void>
}) {
  const totalAsk = kind === '6520' ? 10 : 20
  const passNeed = kind === '6520' ? 6 : 12

  const basePool = useMemo(
    () => (kind === '6520' ? questions.filter((q) => q.is6520) : questions),
    [questions, kind],
  )

  const [examQs, setExamQs] = useState<CivicsQuestion[]>(() =>
    shuffle(basePool).slice(0, Math.min(totalAsk, basePool.length)),
  )
  const [round, setRound] = useState(0)
  const [draft, setDraft] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null)
  const [answers, setAnswers] = useState<(boolean | null)[]>(() =>
    Array.from({ length: examQs.length }, () => null),
  )
  const [overrides, setOverrides] = useState<boolean[]>(() =>
    Array.from({ length: examQs.length }, () => false),
  )
  const [done, setDone] = useState(false)

  const q = examQs[round]!
  const displayAnswers = getAcceptableAnswersForDisplay(q, {
    stateName: userStateName ?? undefined,
  })
  const ungraded = isUngradedQuestion(q)
  const needsStateForGrading = q.id === 62
  const hasState = Boolean(userStateName)
  const effectiveUngraded = ungraded || (needsStateForGrading && !hasState)
  const correctSoFar = answers.filter((a) => a === true).length

  const startOver = () => {
    const next = shuffle(basePool).slice(0, Math.min(totalAsk, basePool.length))
    setExamQs(next)
    setRound(0)
    setAnswers(Array.from({ length: next.length }, () => null))
    setOverrides(Array.from({ length: next.length }, () => false))
    setDraft('')
    setSubmitted(false)
    setWasCorrect(null)
    setDone(false)
  }

  const submit = () => {
    if (submitted || done) return
    if (effectiveUngraded) {
      setWasCorrect(null)
      setSubmitted(true)
      setAnswers((prev) => {
        const n = [...prev]
        n[round] = null
        return n
      })
      return
    }
    const ok = isCorrectChoice(q, draft, { stateName: userStateName ?? undefined })
    setWasCorrect(ok)
    setSubmitted(true)
    setAnswers((prev) => {
      const n = [...prev]
      n[round] = ok
      return n
    })
    setOverrides((prev) => {
      const n = [...prev]
      n[round] = false
      return n
    })
  }

  const acceptCloseEnough = () => {
    if (!submitted || effectiveUngraded) return
    if (wasCorrect !== false) return
    setWasCorrect(true)
    setAnswers((prev) => {
      const n = [...prev]
      n[round] = true
      return n
    })
    setOverrides((prev) => {
      const n = [...prev]
      n[round] = true
      return n
    })
  }

  const advance = () => {
    if (round + 1 >= examQs.length) {
      setDone(true)
      setDraft('')
      setSubmitted(false)
      setWasCorrect(null)
      return
    }
    setRound(round + 1)
    setDraft('')
    setSubmitted(false)
    setWasCorrect(null)
  }

  const finalCorrect = answers.filter((a) => a === true).length
  const gradedTotal = answers.filter((a) => a !== null).length
  const overrideCount = overrides.filter(Boolean).length
  const passed = finalCorrect >= passNeed

  return (
    <div className="min-h-svh bg-linear-to-b from-navy-950 via-navy-900 to-navy-950 text-parchment">
      <HeaderBar
        title={kind === '6520' ? '65/20 civics test (practice)' : 'Standard civics test (practice)'}
        onBack={onBack}
      />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
        {!done ? (
          <>
            <p className="text-sm text-parchment/70">
              Question {round + 1} of {examQs.length} · Need {passNeed} correct to pass
            </p>
            <p className="mt-1 text-xs text-parchment/50">
              Answered correctly so far: {correctSoFar}
            </p>

            <p className="mt-6 text-xs font-medium uppercase tracking-wide text-accent/90">
              {q.section}
            </p>
            <h2 className="mt-2 text-xl font-semibold leading-snug sm:text-2xl">{q.question}</h2>
            {(ungraded || (needsStateForGrading && !hasState)) && (
              <p className="mt-2 text-sm text-parchment/70">
                {needsStateForGrading && !hasState ? (
                  <>
                    To grade this question, we need your <span className="font-semibold">state</span>.
                  </>
                ) : (
                  <>
                    This question depends on your location or can change over time, so it’s{' '}
                    <span className="font-semibold">not graded</span>.
                  </>
                )}
              </p>
            )}

            {needsStateForGrading && (
              <div className="mt-4 rounded-2xl border border-white/10 bg-navy-800/30 p-4">
                <p className="text-sm font-medium text-parchment/85">
                  Your state: <span className="font-semibold">{userStateName ?? 'Not set'}</span>
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={onResolveState}
                    className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium hover:bg-white/10"
                  >
                    Use my location
                  </button>
                </div>
                <p className="mt-2 text-xs text-parchment/55">
                  Ungraded until your state is set.
                </p>
              </div>
            )}

            <div className="mt-8 rounded-2xl border border-white/10 bg-navy-800/40 p-5">
              <label className="text-sm font-medium text-parchment/90">Your answer</label>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submit()
                }}
                disabled={submitted}
                placeholder="Type your answer…"
                className="mt-2 w-full rounded-xl border border-white/15 bg-navy-950/40 px-4 py-3 text-sm text-parchment placeholder:text-parchment/40 outline-none focus:border-accent/60 sm:text-base"
              />
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={submit}
                  disabled={submitted || normalizeAnswer(draft).length === 0}
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-muted disabled:opacity-40"
                >
                  {effectiveUngraded ? 'Continue (ungraded)' : 'Submit'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDraft(q.acceptableAnswers[0] ?? '')
                  }}
                  disabled={submitted}
                  className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium hover:bg-white/10 disabled:opacity-40"
                >
                  Use first official answer
                </button>
                {submitted && (
                  <button
                    type="button"
                    onClick={advance}
                    className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium hover:bg-white/10"
                  >
                    {round + 1 >= examQs.length ? 'See results' : 'Next'}
                  </button>
                )}
              </div>

              {submitted && (
                <div className="mt-5">
                  {effectiveUngraded ? (
                    <p className="text-sm font-semibold text-parchment/85">Not graded.</p>
                  ) : (
                    <p
                      className={`text-sm font-semibold ${wasCorrect ? 'text-emerald-300' : 'text-red-300'}`}
                    >
                      {wasCorrect ? 'Correct.' : 'Incorrect.'}
                    </p>
                  )}
                  {!effectiveUngraded && submitted && wasCorrect === false && (
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={acceptCloseEnough}
                        className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium hover:bg-white/10"
                      >
                        My answer was close enough
                      </button>
                      <p className="mt-2 text-xs text-parchment/55">
                        Use this if your wording should reasonably count as correct.
                      </p>
                    </div>
                  )}
                  <p className="mt-3 text-xs font-medium uppercase tracking-wide text-parchment/60">
                    Acceptable answers
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-parchment/90">
                    {displayAnswers.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-8 text-center">
            <h2 className="text-2xl font-bold">Results</h2>
            <p className="mt-4 text-lg">
              {finalCorrect} / {gradedTotal} correct
            </p>
            <p
              className={`mt-4 text-xl font-semibold ${passed ? 'text-emerald-300' : 'text-red-300'}`}
            >
              {passed ? 'Pass' : 'Not a passing score'}
            </p>
            <p className="mt-2 text-xs text-parchment/55">
              Ungraded questions (location-dependent or change over time) don’t count toward your score.
            </p>
            {overrideCount > 0 && (
              <p className="mt-2 text-xs text-parchment/55">
                You manually accepted {overrideCount} answer{overrideCount === 1 ? '' : 's'} as correct.
              </p>
            )}
            <p className="mt-2 text-sm text-parchment/65">
              Official oral test scoring may differ; this app is for practice only.
            </p>
            <button
              type="button"
              onClick={startOver}
              className="mt-8 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-muted"
            >
              New exam
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default function App() {
  const [view, setView] = useState<AppView>('home')
  const [examKind, setExamKind] = useState<ExamKind>('standard')
  const [userStateName, setUserStateName] = useState<string | null>(() => {
    const v = localStorage.getItem('civics_user_state')?.trim()
    return v ? v : null
  })

  const resolveStateFromLocation = useCallback(async () => {
    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) reject(new Error('Geolocation not supported in this browser.'))
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 10000,
      })
    })

    const { latitude, longitude } = pos.coords
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${encodeURIComponent(
      latitude,
    )}&longitude=${encodeURIComponent(longitude)}&localityLanguage=en`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Reverse geocoding failed.')
    const data = (await res.json()) as { principalSubdivision?: string }
    const state = data.principalSubdivision?.trim()
    if (!state) throw new Error('Could not determine your state.')
    setUserStateName(state)
    localStorage.setItem('civics_user_state', state)
  }, [])

  if (view === 'exam') {
    return (
      <ExamView
        onBack={() => setView('home')}
        questions={CIVICS_QUESTIONS}
        kind={examKind}
        userStateName={userStateName}
        onResolveState={resolveStateFromLocation}
      />
    )
  }

  return (
    <Home
      onExam={(k) => {
        setExamKind(k)
        setView('exam')
      }}
    />
  )
}
