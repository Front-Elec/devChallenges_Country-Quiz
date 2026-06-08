import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizContext } from '../context/QuizContext';
import ResultsCard from '../components/ResultsCard';

export default function ResultsPage() {
  const { status, answers, highScore, resetQuiz } = useQuizContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (status !== 'finished') {
      navigate('/', { replace: true });
    }
  }, [status, navigate]);

  if (status !== 'finished') {
    return null;
  }

  const correctCount = answers.filter((a) => a.state === 'correct').length;
  const isNewRecord = correctCount > 0 && correctCount === highScore;

  const handlePlayAgain = () => {
    resetQuiz();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-8">
      <ResultsCard
        correctCount={correctCount}
        totalCount={answers.length}
        highScore={highScore}
        isNewRecord={isNewRecord}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  );
}
