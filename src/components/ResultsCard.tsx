import React from 'react';

export interface ResultsCardProps {
  correctCount: number;
  totalCount: number;
  highScore: number;
  isNewRecord: boolean;
  onPlayAgain: () => void;
}

export default function ResultsCard({
  correctCount,
  totalCount,
  highScore,
  isNewRecord,
  onPlayAgain,
}: ResultsCardProps) {
  // Calculate percentage of correct answers
  const scorePercentage = (correctCount / totalCount) * 100;
  
  // Custom feedback message based on score
  let title = '¡Buen intento!';
  let description = 'Sigue practicando para conocer más sobre el mundo.';

  if (scorePercentage === 100) {
    title = '¡Puntuación Perfecta! 🎉';
    description = '¡Eres un experto absoluto en geografía mundial!';
  } else if (scorePercentage >= 70) {
    title = '¡Excelente trabajo! 🌟';
    description = 'Tienes un conocimiento muy sólido de los países.';
  } else if (scorePercentage >= 40) {
    title = '¡Vas por buen camino!';
    description = '¡Sigue jugando para mejorar tu puntuación!';
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700/80 text-center transition-all duration-300">
      {/* Trophy / Medal SVG Icon with custom colors */}
      <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center bg-purple-50 dark:bg-purple-950/35 rounded-full">
        {isNewRecord ? (
          <svg className="w-16 h-16 text-yellow-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        ) : (
          <svg className="w-16 h-16 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        )}
      </div>

      {/* New record highlight badge */}
      {isNewRecord && (
        <div className="inline-block bg-amber-100 dark:bg-amber-950/65 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-3 animate-pulse">
          🏆 ¡Nuevo Récord Personal!
        </div>
      )}

      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        {title}
      </h2>

      {/* Description */}
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-xs mx-auto">
        {description}
      </p>

      {/* Scores presentation */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Correct Answers */}
        <div className="bg-purple-50/50 dark:bg-purple-950/10 rounded-2xl p-4 border border-purple-100/50 dark:border-purple-900/20">
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider mb-1">
            Respuestas
          </p>
          <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">
            {correctCount} <span className="text-base font-normal text-gray-400">/ {totalCount}</span>
          </p>
        </div>

        {/* High Score */}
        <div className="bg-amber-50/50 dark:bg-amber-950/10 rounded-2xl p-4 border border-amber-100/50 dark:border-amber-900/20">
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider mb-1">
            Mejor Racha
          </p>
          <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-500">
            {highScore} <span className="text-base font-normal text-gray-400">pts</span>
          </p>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onPlayAgain}
        className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold rounded-2xl shadow-lg shadow-purple-200 dark:shadow-none transition-all duration-200 active:scale-[0.98] hover:shadow-xl"
      >
        Volver a Jugar
      </button>
    </div>
  );
}
