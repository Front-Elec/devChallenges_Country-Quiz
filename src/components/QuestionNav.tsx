import React from 'react';
import { UserAnswer } from '../types/quiz';

export interface QuestionNavProps {
  total: number;
  currentIndex: number;
  answers: UserAnswer[];
  onNavigate: (index: number) => void;
}

export default function QuestionNav({
  total,
  currentIndex,
  answers,
  onNavigate,
}: QuestionNavProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5 py-4">
      {Array.from({ length: total }).map((_, index) => {
        const answer = answers[index];
        const isCurrent = index === currentIndex;
        
        let dotClasses = 'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200 focus:outline-none ';
        
        // Determine color based on answer state
        if (!answer || answer.state === 'unanswered') {
          // Unanswered
          dotClasses += 'bg-gray-100 text-gray-500 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700';
        } else if (answer.state === 'correct') {
          // Correct
          dotClasses += 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm';
        } else {
          // Incorrect
          dotClasses += 'bg-rose-500 text-white hover:bg-rose-600 shadow-sm';
        }

        // Highlight if current
        if (isCurrent) {
          dotClasses += ' ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-gray-900 ring-offset-1 scale-110';
        }

        return (
          <button
            key={index}
            onClick={() => onNavigate(index)}
            className={dotClasses}
            aria-label={`Ir a la pregunta ${index + 1}`}
            aria-current={isCurrent ? 'step' : undefined}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
}
