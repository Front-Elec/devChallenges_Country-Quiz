import React, { createContext, useContext, ReactNode } from 'react';
import { useQuiz, UseQuizReturn } from '../hooks/useQuiz';

const QuizContext = createContext<UseQuizReturn | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const quiz = useQuiz();
  return <QuizContext.Provider value={quiz}>{children}</QuizContext.Provider>;
}

export function useQuizContext(): UseQuizReturn {
  const ctx = useContext(QuizContext);
  if (!ctx) {
    throw new Error('useQuizContext must be used within QuizProvider');
  }
  return ctx;
}
