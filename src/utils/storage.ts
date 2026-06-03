// utils/storage.ts

const KEYS = {
  highScore: 'countryQuiz_highScore',
  theme: 'countryQuiz_theme',
} as const;

export function getHighScore(): number {
  try {
    const raw = localStorage.getItem(KEYS.highScore);
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

export function setHighScore(score: number): void {
  try {
    localStorage.setItem(KEYS.highScore, String(score));
  } catch {
    // localStorage unavailable — silently ignore
  }
}

export function getTheme(): 'light' | 'dark' | null {
  try {
    const v = localStorage.getItem(KEYS.theme);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

export function setTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(KEYS.theme, theme);
  } catch {
    // localStorage unavailable — silently ignore
  }
}
