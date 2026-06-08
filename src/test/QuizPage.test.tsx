import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QuizContext } from '../context/QuizContext';
import type { UseQuizReturn } from '../hooks/useQuiz';
import type { QuizQuestion, UserAnswer } from '../types/quiz';
import QuizPage from '../pages/QuizPage';

// ──────────────────────────────────────────────
// Datos de prueba: 1 pregunta con 4 opciones
// ──────────────────────────────────────────────
const MOCK_QUESTION: QuizQuestion = {
  countryCode: 'COL',
  flagUrl: 'https://example.com/col.svg',
  flagAlt: 'Flag of Colombia',
  correctAnswer: 'Colombia',
  options: [
    { id: 'COL', label: 'Colombia' },
    { id: 'VEN', label: 'Venezuela' },
    { id: 'ECU', label: 'Ecuador' },
    { id: 'PER', label: 'Peru' },
  ],
};

const UNANSWERED: UserAnswer = { selectedId: null, state: 'unanswered' };

// Helper para renderizar QuizPage con un contexto mockeado
function renderQuizPage(contextValue: Partial<UseQuizReturn>, questionIndex = 0) {
  const submitAnswer = vi.fn();
  const defaultValue: UseQuizReturn = {
    status: 'active',
    questions: [MOCK_QUESTION],
    answers: [UNANSWERED],
    highScore: 0,
    loadQuiz: vi.fn(),
    submitAnswer,
    resetQuiz: vi.fn(),
    ...contextValue,
  };

  render(
    <MemoryRouter initialEntries={[`/quiz/${questionIndex}`]}>
      <QuizContext.Provider value={defaultValue}>
        <Routes>
          <Route path="/quiz/:questionIndex" element={<QuizPage />} />
        </Routes>
      </QuizContext.Provider>
    </MemoryRouter>,
  );

  return { submitAnswer: defaultValue.submitAnswer as ReturnType<typeof vi.fn> };
}

// ──────────────────────────────────────────────
// Task 10.3 — Selección de opción correcta e incorrecta
// ──────────────────────────────────────────────
describe('QuizPage – feedback de selección (Task 10.3)', () => {
  it('opción correcta queda en estado success (verde) y opción incorrecta seleccionada en error (rojo) luego de responder', () => {
    // Simular que ya se respondió: Colombia (COL) es correcta, se seleccionó Venezuela (VEN)
    const answeredContext: Partial<UseQuizReturn> = {
      answers: [{ selectedId: 'VEN', state: 'incorrect' }],
    };
    renderQuizPage(answeredContext);

    // Opción correcta → clases de emerald (verde)
    const correctBtn = screen.getByRole('button', { name: /Colombia/i });
    expect(correctBtn.className).toMatch(/emerald/);

    // Opción seleccionada incorrecta → clases de rose (rojo)
    const wrongBtn = screen.getByRole('button', { name: /Venezuela/i });
    expect(wrongBtn.className).toMatch(/rose/);

    // Todos los botones deben estar deshabilitados
    const allButtons = screen.getAllByRole('button');
    const optionButtons = allButtons.filter((btn) =>
      ['Colombia', 'Venezuela', 'Ecuador', 'Peru'].some((label) =>
        btn.textContent?.includes(label),
      ),
    );
    optionButtons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });
});

// ──────────────────────────────────────────────
// Task 10.4 — Timer muestra 15 en la carga inicial
// ──────────────────────────────────────────────
describe('QuizPage – timer inicial (Task 10.4)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('TimerBar muestra 15 segundos en el render inicial de una pregunta sin responder', () => {
    renderQuizPage({});
    // El componente TimerBar renderiza "{secondsLeft}s"
    expect(screen.getByText('15s')).toBeInTheDocument();
  });
});
