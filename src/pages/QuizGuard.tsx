import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useQuizContext } from '../context/QuizContext';

interface QuizGuardProps {
  children: ReactNode;
}

export default function QuizGuard({ children }: QuizGuardProps) {
  const { status } = useQuizContext();

  if (status !== 'active') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
