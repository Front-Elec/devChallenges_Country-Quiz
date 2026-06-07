import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizContext } from '../context/QuizContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function HomePage() {
  const { status, loadQuiz } = useQuizContext();
  const navigate = useNavigate();

  useEffect(() => {
    loadQuiz();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === 'active') {
      navigate('/quiz/0', { replace: true });
    }
  }, [status, navigate]);

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <ErrorMessage
          message="No se pudo cargar el quiz. Verificá tu conexión e intentá de nuevo."
          onRetry={loadQuiz}
        />
      </div>
    );
  }

  return null;
}
