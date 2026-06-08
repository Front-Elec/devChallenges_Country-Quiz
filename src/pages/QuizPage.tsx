import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuizContext } from '../context/QuizContext';
import { useTimer } from '../hooks/useTimer';
import OptionButton from '../components/OptionButton';
import TimerBar from '../components/TimerBar';
import QuestionNav from '../components/QuestionNav';

const TIMER_DURATION = 15;

export default function QuizPage() {
  const { questionIndex: rawParam } = useParams<{ questionIndex: string }>();
  const navigate = useNavigate();
  const { questions, answers, submitAnswer } = useQuizContext();

  const index = parseInt(rawParam ?? '0', 10);
  const isValidIndex = !isNaN(index) && index >= 0 && index < questions.length;

  // Redirect out-of-range indexes
  useEffect(() => {
    if (questions.length > 0 && !isValidIndex) {
      navigate('/quiz/0', { replace: true });
    }
  }, [questions.length, isValidIndex, navigate]);

  const question = isValidIndex ? questions[index] : null;
  const answer = isValidIndex ? answers[index] : null;
  const isAnswered = answer?.state !== 'unanswered';

  const handleExpire = useCallback(() => {
    if (!isAnswered && isValidIndex) {
      submitAnswer(index, null);
    }
  }, [isAnswered, isValidIndex, submitAnswer, index]);

  const { secondsLeft, reset } = useTimer(TIMER_DURATION, handleExpire, !isAnswered);

  // Reset timer whenever we navigate to a new question
  useEffect(() => {
    reset();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const allAnswered = answers.length > 0 && answers.every((a) => a.state !== 'unanswered');
  const isLastQuestion = index === questions.length - 1;

  const handleNavigate = (targetIndex: number) => {
    navigate(`/quiz/${targetIndex}`);
  };

  if (!question) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl">
        {/* Question counter */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
            Country Quiz
          </span>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {index + 1} / {questions.length}
          </span>
        </div>

        {/* Flag */}
        <div className="w-full flex justify-center mb-6">
          <div className="relative w-72 h-48 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
            <img
              src={question.flagUrl}
              alt={question.flagAlt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Question */}
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 text-center mb-6">
          ¿De qué país es esta bandera?
        </h1>

        {/* Timer */}
        <div className="mb-6">
          <TimerBar
            secondsLeft={secondsLeft}
            totalSeconds={TIMER_DURATION}
            isActive={!isAnswered}
          />
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3 mb-8">
          {question.options.map((option) => {
            const isCorrect = option.label === question.correctAnswer;
            const isSelected = answer?.selectedId === option.id;
            return (
              <OptionButton
                key={option.id}
                label={option.label}
                isCorrect={isCorrect}
                isSelected={isSelected}
                isAnswered={!!isAnswered}
                onClick={() => submitAnswer(index, option.id)}
              />
            );
          })}
        </div>

        {/* "Ver Resultados" on last question when all answered */}
        {isLastQuestion && allAnswered && (
          <button
            onClick={() => navigate('/results')}
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold rounded-2xl shadow-lg shadow-purple-200 dark:shadow-none transition-all duration-200 active:scale-[0.98] hover:shadow-xl mb-6"
          >
            Ver Resultados →
          </button>
        )}

        {/* Question navigation */}
        <QuestionNav
          total={questions.length}
          currentIndex={index}
          answers={answers}
          onNavigate={handleNavigate}
        />
      </div>
    </div>
  );
}
