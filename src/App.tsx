import { Routes, Route, Navigate } from 'react-router-dom';
import { QuizProvider } from './context/QuizContext';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import QuizGuard from './pages/QuizGuard';
import ResultsPage from './pages/ResultsPage';

export default function App() {
  return (
    <QuizProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/quiz/:questionIndex"
          element={
            <QuizGuard>
              <QuizPage />
            </QuizGuard>
          }
        />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </QuizProvider>
  );
}
