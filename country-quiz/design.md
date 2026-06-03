# Technical Design — Country Quiz App

## Overview

Single-page application built with **Vite + React 18 + TypeScript**, using **React Router v6** for URL-driven navigation and **Tailwind CSS** (dark mode via class strategy) for styling. The app fetches country data from the REST Countries API, generates 10 randomized quiz questions, and guides the user through a timed question flow with audio feedback, high score persistence, and a results screen.

---

## Architecture

The architecture follows the **container–presentational** pattern, keeping data logic in custom hooks and pure rendering in components. There are no external state libraries — React's own `useState`/`useReducer`/`useContext` is sufficient for this scope.

```
src/
├── main.tsx                  # React root, Router wrapper
├── App.tsx                   # Route definitions, ThemeProvider
├── assets/
│   └── sounds/
│       ├── correct.mp3
│       └── incorrect.mp3
├── components/               # Presentational (UI only)
│   ├── LoadingSpinner.tsx
│   ├── ErrorMessage.tsx
│   ├── QuestionCard.tsx
│   ├── OptionButton.tsx
│   ├── TimerBar.tsx
│   ├── QuestionNav.tsx
│   ├── ResultsCard.tsx
│   └── ThemeToggle.tsx
├── hooks/                    # Logic containers
│   ├── useQuiz.ts            # Quiz state machine
│   ├── useTimer.ts           # Countdown per question
│   └── useTheme.ts           # Dark/light + localStorage
├── pages/                    # Route-level containers
│   ├── HomePage.tsx          # / — fetch + loading/error
│   ├── QuizPage.tsx          # /quiz/:questionIndex
│   └── ResultsPage.tsx       # /results
├── services/
│   └── countriesApi.ts       # fetch wrapper + question builder
├── utils/
│   ├── shuffle.ts            # Fisher-Yates shuffle
│   └── storage.ts            # localStorage helpers
└── types/
    └── quiz.ts               # Shared TypeScript interfaces
```

---

## Data Models

```typescript
// types/quiz.ts

export interface CountryRaw {
  name: { common: string; official: string };
  flags: { svg: string; png: string; alt?: string };
  cca3: string;
}

export interface QuizOption {
  label: string;   // country common name
  id: string;      // cca3 code — stable unique key
}

export interface QuizQuestion {
  countryCode: string;
  flagUrl: string;
  flagAlt: string;
  correctAnswer: string;        // common name of the target country
  options: QuizOption[];        // 4 options, shuffled
}

export type AnswerState = 'unanswered' | 'correct' | 'incorrect';

export interface UserAnswer {
  selectedId: string | null;    // null = time expired
  state: AnswerState;
}

export interface QuizState {
  questions: QuizQuestion[];
  answers: UserAnswer[];        // parallel array, length === questions.length
  highScore: number;
}
```

---

## Component Interfaces

### `OptionButton`
```typescript
interface OptionButtonProps {
  label: string;
  isCorrect: boolean;
  isSelected: boolean;
  isAnswered: boolean;          // disables all options once true
  onClick: () => void;
}
```

Visual states (mutually exclusive):
| Condition | Style |
|-----------|-------|
| `!isAnswered` | neutral (no feedback) |
| `isAnswered && isCorrect` | green + check icon |
| `isAnswered && isSelected && !isCorrect` | red + X icon |
| `isAnswered && !isSelected && !isCorrect` | neutral, opacity-50 |

### `TimerBar`
```typescript
interface TimerBarProps {
  secondsLeft: number;          // 0–15
  totalSeconds: number;         // 15
  isActive: boolean;
}
```

### `QuestionNav`
```typescript
interface QuestionNavProps {
  total: number;                // 10
  currentIndex: number;         // 0-based
  answers: UserAnswer[];
  onNavigate: (index: number) => void;
}
```

Each dot is colored: unanswered = neutral, correct = green, incorrect = red, current = highlighted ring.

### `ResultsCard`
```typescript
interface ResultsCardProps {
  correctCount: number;
  totalCount: number;           // 10
  highScore: number;
  isNewRecord: boolean;
  onPlayAgain: () => void;
}
```

---

## Custom Hooks

### `useQuiz`

Manages the full quiz state. Exposed API:

```typescript
interface UseQuizReturn {
  status: 'idle' | 'loading' | 'error' | 'active' | 'finished';
  questions: QuizQuestion[];
  answers: UserAnswer[];
  highScore: number;
  loadQuiz: () => void;
  submitAnswer: (questionIndex: number, selectedId: string | null) => void;
  resetQuiz: () => void;
}
```

State transitions:
```
idle → loading → active  (on fetch success, navigate to /quiz/0)
               → error   (on fetch failure)
active → finished        (when answers.every(a => a.state !== 'unanswered'))
finished → loading       (on resetQuiz → loadQuiz)
```

High score logic lives inside `submitAnswer`: after recording the answer, if all questions are answered and `correctCount > highScore`, update localStorage and the in-memory value.

### `useTimer`

```typescript
interface UseTimerReturn {
  secondsLeft: number;
  reset: () => void;
  stop: () => void;
}

function useTimer(
  durationSeconds: number,
  onExpire: () => void,
  active: boolean         // false when question is already answered
): UseTimerReturn
```

Implementation detail: uses `useRef` for the interval ID to avoid stale closure issues. `reset()` clears the interval and restarts from `durationSeconds`. `stop()` clears without restarting.

### `useTheme`

```typescript
function useTheme(): {
  theme: 'light' | 'dark';
  toggle: () => void;
}
```

On mount: reads `countryQuiz_theme` from localStorage; falls back to `window.matchMedia('(prefers-color-scheme: dark)')`. Applies/removes the `dark` class on `document.documentElement`. On toggle: flips theme, writes to localStorage, updates the class.

---

## Services

### `countriesApi.ts`

```typescript
const API_URL = 'https://restcountries.com/v3.1/all?fields=name,flags,cca3';

export async function fetchQuestions(): Promise<QuizQuestion[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data: CountryRaw[] = await res.json();
  return buildQuestions(data, 10);
}

function buildQuestions(pool: CountryRaw[], count: number): QuizQuestion[] {
  const shuffled = fisherYates([...pool]);
  const targets = shuffled.slice(0, count);
  return targets.map(target => buildQuestion(target, pool));
}

function buildQuestion(target: CountryRaw, pool: CountryRaw[]): QuizQuestion {
  const distractors = pool
    .filter(c => c.cca3 !== target.cca3)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const options: QuizOption[] = fisherYates([
    { label: target.name.common, id: target.cca3 },
    ...distractors.map(c => ({ label: c.name.common, id: c.cca3 })),
  ]);
  return {
    countryCode: target.cca3,
    flagUrl: target.flags.svg || target.flags.png,
    flagAlt: target.flags.alt ?? `Flag of ${target.name.common}`,
    correctAnswer: target.name.common,
    options,
  };
}
```

The `?fields=name,flags,cca3` query parameter reduces payload size significantly.

---

## Routing

```typescript
// App.tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route
      path="/quiz/:questionIndex"
      element={<QuizGuard><QuizPage /></QuizGuard>}
    />
    <Route path="/results" element={<ResultsPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
</BrowserRouter>
```

`QuizGuard` is a wrapper component that checks if `useQuiz` has loaded questions. If `status !== 'active'`, it redirects to `/` (requirement 9.4). This prevents direct URL access to `/quiz/5` without data.

`HomePage` calls `loadQuiz()` on mount. When status transitions to `'active'`, it calls `navigate('/quiz/0', { replace: true })`.

`QuizPage` reads `:questionIndex` from `useParams`, converts to 0-based integer, and validates it against `questions.length`. Out-of-range index redirects to `/quiz/0`.

`ResultsPage` redirects to `/` if `status !== 'finished'`.

---

## State Context

`QuizContext` wraps the whole app and exposes `useQuiz` return value. This avoids prop drilling between pages and components.

```typescript
// context/QuizContext.tsx
const QuizContext = createContext<UseQuizReturn | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const quiz = useQuiz();
  return <QuizContext.Provider value={quiz}>{children}</QuizContext.Provider>;
}

export function useQuizContext(): UseQuizReturn {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error('useQuizContext must be used within QuizProvider');
  return ctx;
}
```

---

## Audio Feedback

```typescript
// utils/audio.ts
const sounds = {
  correct: new Audio('/sounds/correct.mp3'),
  incorrect: new Audio('/sounds/incorrect.mp3'),
};

export function playSound(type: 'correct' | 'incorrect'): void {
  sounds[type].currentTime = 0;
  sounds[type].play().catch(() => {
    // Browser autoplay policy — silently ignore if not yet interacted
  });
}
```

Called inside `submitAnswer` in `useQuiz` immediately after determining correctness.

---

## localStorage Helpers

```typescript
// utils/storage.ts
const KEYS = {
  highScore: 'countryQuiz_highScore',
  theme: 'countryQuiz_theme',
} as const;

export function getHighScore(): number {
  const raw = localStorage.getItem(KEYS.highScore);
  return raw ? parseInt(raw, 10) : 0;
}

export function setHighScore(score: number): void {
  localStorage.setItem(KEYS.highScore, String(score));
}

export function getTheme(): 'light' | 'dark' | null {
  const v = localStorage.getItem(KEYS.theme);
  return v === 'light' || v === 'dark' ? v : null;
}

export function setTheme(theme: 'light' | 'dark'): void {
  localStorage.setItem(KEYS.theme, theme);
}
```

---

## Utility: Fisher-Yates Shuffle

```typescript
// utils/shuffle.ts
export function fisherYates<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
```

Pure function — returns a new array, never mutates input.

---

## Error Handling

| Failure Point | Behavior |
|---------------|----------|
| `fetch` throws (network offline) | `useQuiz` catches, sets `status: 'error'`, stores message |
| HTTP ≥ 400 response | Same — `throw new Error(\`HTTP \${res.status}\`)` |
| Pool < 4 countries | Guard in `buildQuestion` — throws, caught by hook |
| Direct URL access with no data | `QuizGuard` redirects to `/` |
| Audio autoplay blocked | `play()` promise rejection silently caught |
| localStorage unavailable | Wrapped in try/catch; defaults to 0 / system theme |

---

## Testing Strategy

**Framework**: Vitest + React Testing Library + `@testing-library/user-event`.

4 required unit tests mapped to acceptance criteria:

| Test | File | Covers |
|------|------|--------|
| Loading state renders spinner | `HomePage.test.tsx` | Req 1.3 |
| Error state renders retry button | `HomePage.test.tsx` | Req 1.4 |
| Selecting an option applies correct feedback | `QuizPage.test.tsx` | Req 3.1, 3.2, 3.4 |
| Timer renders initial 15s countdown | `QuizPage.test.tsx` | Req 4.1 |

Tests mock `fetch` via `vi.stubGlobal('fetch', vi.fn())` and use `vi.useFakeTimers()` for the timer test.

---

## Build & Tooling

```json
// vite.config.ts essentials
{
  "plugins": ["@vitejs/plugin-react"],
  "test": {
    "environment": "jsdom",
    "globals": true,
    "setupFiles": ["./src/test/setup.ts"]
  }
}
```

```json
// tailwind.config.ts
{
  "darkMode": "class",
  "content": ["./index.html", "./src/**/*.{ts,tsx}"]
}
```

```json
// .eslintrc essentials
{
  "plugins": ["react", "react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Distractor uniqueness invariant

*For any* target country and *any* pool of countries, the four generated options must contain the target exactly once, contain no duplicate country IDs, and have a length of exactly 4.

**Validates: Requirements 1.2, 1.6**

---

### Property 2: Shuffle is a permutation

*For any* array of elements, applying `fisherYates` must return an array that contains all original elements and only those elements (same multiset), with the same length.

**Validates: Requirements 1.6**

---

### Property 3: Option count invariant

*For any* `QuizQuestion` generated by `buildQuestion`, the `options` array must contain exactly 4 entries.

**Validates: Requirements 2.2**

---

### Property 4: Feedback state correctness

*For any* question and *any* selected option ID, after calling `submitAnswer`:
- The correct option must have `isCorrect = true` in the rendered output.
- If the selected option was wrong, it must receive the error indicator.
- All remaining options must be neither correct-highlighted nor error-highlighted.
- All 4 option buttons must be disabled.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

---

### Property 5: Timer inactivity on answered questions

*For any* answered question (state !== 'unanswered'), `useTimer` must be called with `active = false`, meaning `secondsLeft` must not decrement over time.

**Validates: Requirements 4.5**

---

### Property 6: High score monotonicity

*For any* completed round with `currentScore` and *any* previously stored `highScore`, after the round ends the value in localStorage must equal `Math.max(currentScore, highScore)`.

**Validates: Requirements 7.1, 7.2**

---

### Property 7: High score persistence across reset

*For any* high score value recorded before "Play Again", after `resetQuiz()` is called the value read from localStorage must be equal to the pre-reset value.

**Validates: Requirements 7.4**

---

### Property 8: Answers array parallel structure invariant

*For any* quiz session, `answers.length` must always equal `questions.length`, and every `answers[i]` must correspond to `questions[i]` throughout the entire session lifecycle.

**Validates: Requirements 2.5, 3.1**
