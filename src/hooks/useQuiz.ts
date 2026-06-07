import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuestions } from '../services/countriesApi';
import type { QuizQuestion, UserAnswer, AnswerState } from '../types/quiz';
import { playSound } from '../utils/audio';
import { getHighScore, setHighScore } from '../utils/storage';

export interface UseQuizReturn {
  status: 'idle' | 'loading' | 'error' | 'active' | 'finished';
  questions: QuizQuestion[];
  answers: UserAnswer[];
  highScore: number;
  loadQuiz: () => void;
  submitAnswer: (questionIndex: number, selectedId: string | null) => void;
  resetQuiz: () => void;
}

export function useQuiz(): UseQuizReturn {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'active' | 'finished'>('idle');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [highScore, setHighScoreState] = useState<number>(getHighScore());
  const navigate = useNavigate();

  const loadQuiz = useCallback(async () => {
    setStatus('loading');
    try {
      const data = await fetchQuestions();
      setQuestions(data);
      setAnswers(data.map(() => ({ selectedId: null, state: 'unanswered' })));
      setStatus('active');
      navigate('/quiz/0', { replace: true });
    } catch (error) {
      setStatus('error');
    }
  }, [navigate]);

  const submitAnswer = useCallback((questionIndex: number, selectedId: string | null) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      const question = questions[questionIndex];
      let state: AnswerState = 'incorrect';

      if (selectedId !== null) {
        const selectedOption = question.options.find((opt) => opt.id === selectedId);
        if (selectedOption && selectedOption.label === question.correctAnswer) {
          state = 'correct';
        }
      }

      newAnswers[questionIndex] = { selectedId, state };

      playSound(state);

      if (newAnswers.every((a) => a.state !== 'unanswered')) {
        setStatus('finished');
        const correctCount = newAnswers.filter((a) => a.state === 'correct').length;
        setHighScoreState((prevScore) => {
          const newHigh = Math.max(prevScore, correctCount);
          setHighScore(newHigh);
          return newHigh;
        });
      }

      return newAnswers;
    });
  }, [questions]);

  const resetQuiz = useCallback(() => {
    setStatus('idle');
    setQuestions([]);
    setAnswers([]);
    loadQuiz();
  }, [loadQuiz]);

  return { status, questions, answers, highScore, loadQuiz, submitAnswer, resetQuiz };
}
