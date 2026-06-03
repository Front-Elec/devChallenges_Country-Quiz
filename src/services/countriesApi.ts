// services/countriesApi.ts

import { fisherYates } from '../utils/shuffle';
import type { CountryRaw, QuizOption, QuizQuestion } from '../types/quiz';

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
  return targets.map((target) => buildQuestion(target, pool));
}

export function buildQuestion(
  target: CountryRaw,
  pool: CountryRaw[],
): QuizQuestion {
  if (pool.length < 4) {
    throw new Error('Pool must contain at least 4 countries to build a question.');
  }

  const distractors = pool
    .filter((c) => c.cca3 !== target.cca3)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const options: QuizOption[] = fisherYates([
    { label: target.name.common, id: target.cca3 },
    ...distractors.map((c) => ({ label: c.name.common, id: c.cca3 })),
  ]);

  return {
    countryCode: target.cca3,
    flagUrl: target.flags.svg || target.flags.png,
    flagAlt: target.flags.alt ?? `Flag of ${target.name.common}`,
    correctAnswer: target.name.common,
    options,
  };
}
