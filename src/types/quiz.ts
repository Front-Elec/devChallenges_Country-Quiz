// types/quiz.ts

export interface CountryRaw {
  name: { common: string; official: string };
  flags: { svg: string; png: string; alt?: string };
  cca3: string;
}

export interface QuizOption {
  label: string; // country common name
  id: string; // cca3 code — stable unique key
}

export interface QuizQuestion {
  countryCode: string;
  flagUrl: string;
  flagAlt: string;
  correctAnswer: string; // common name of the target country
  options: QuizOption[]; // 4 options, shuffled
}

export type AnswerState = 'unanswered' | 'correct' | 'incorrect';

export interface UserAnswer {
  selectedId: string | null; // null = time expired
  state: AnswerState;
}

export interface QuizState {
  questions: QuizQuestion[];
  answers: UserAnswer[]; // parallel array, length === questions.length
  highScore: number;
}
