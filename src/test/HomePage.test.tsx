import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QuizContext } from '../context/QuizContext';
import type { UseQuizReturn } from '../hooks/useQuiz';
import HomePage from '../pages/HomePage';

// Helper para renderizar HomePage con un valor de contexto mockeado
function renderHomePage(contextValue: Partial<UseQuizReturn>) {
  const defaultValue: UseQuizReturn = {
    status: 'idle',
    questions: [],
    answers: [],
    highScore: 0,
    loadQuiz: vi.fn(),
    submitAnswer: vi.fn(),
    resetQuiz: vi.fn(),
    ...contextValue,
  };

  return render(
    <MemoryRouter>
      <QuizContext.Provider value={defaultValue}>
        <HomePage />
      </QuizContext.Provider>
    </MemoryRouter>,
  );
}

// Task 10.1 — Estado de carga: fetch pendiente, debe aparecer LoadingSpinner
describe('HomePage – estado de carga (Task 10.1)', () => {
  beforeEach(() => {
    // fetch nunca resuelve (permanece pendiente)
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => {})),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renderiza LoadingSpinner cuando el status es loading', () => {
    renderHomePage({ status: 'loading' });
    expect(screen.getByText(/Cargando preguntas/i)).toBeInTheDocument();
  });
});

// Task 10.2 — Estado de error: fetch retorna 500, deben aparecer ErrorMessage y botón Reintentar
describe('HomePage – estado de error (Task 10.2)', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({ ok: false, status: 500 } as Response),
      ),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renderiza mensaje de error y botón Reintentar cuando el status es error', () => {
    renderHomePage({ status: 'error' });
    expect(screen.getByText(/Ha ocurrido un error/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reintentar/i })).toBeInTheDocument();
  });
});
