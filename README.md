# USCIS Civics Test Practice App

A single-page React app for practicing the USCIS 2025 civics question set.

It supports:
- Standard civics test simulation (20 questions, pass target 12)
- 65/20 special consideration simulation (10 questions from starred set, pass target 6)
- Typed-answer grading with flexible matching
- Manual "My answer was close enough" override for edge cases

## Tech Stack

- Vite
- React + TypeScript
- Tailwind CSS (v4)

## Source Data

- PDF source: `2025-Civics-Test-128-Questions-and-Answers.pdf`
- App dataset: `src/data/civicsQuestions.ts`
- Data generator script: `scripts/build-civics-data.mjs`

If you update question data, regenerate with:

```bash
node scripts/build-civics-data.mjs
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Grading Behavior

### Flexible text matching

The grader allows common variations, including:
- Case and punctuation differences
- Leading articles (`the`, `a`, `an`)
- Small wording/stemming differences (e.g. `freed` vs `freeing`)
- Optional parenthesized phrasing from official answers
- Multi-part list answers for prompts like "Name two/three/five"

### Questions with changing/location-specific answers

- Some personal/location-dependent questions remain ungraded by default.
- Current federal-office questions (for example, current President) are graded with current values in code.
- "What is the capital of your state?" can be graded using browser geolocation to determine state, with a hardcoded state-capital map.

For current-official questions, feedback shows both:
- The app's current grading answer(s)
- The USCIS `testupdates` guidance text from the official list

## Project Structure

- `src/App.tsx` - main app UI and exam flow
- `src/lib/quiz.ts` - grading and normalization logic
- `src/data/civicsQuestions.ts` - generated question/answer dataset
- `src/data/usStates.ts` - state/capital lookup data
- `scripts/build-civics-data.mjs` - source-to-dataset generator

## Notes

- This app is for study/practice and not an official USCIS tool.
- Official scoring and accepted phrasing may vary by officer.
