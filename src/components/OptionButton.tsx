import React from 'react';

export interface OptionButtonProps {
  label: string;
  isCorrect: boolean;
  isSelected: boolean;
  isAnswered: boolean;
  onClick: () => void;
}

export default function OptionButton({
  label,
  isCorrect,
  isSelected,
  isAnswered,
  onClick,
}: OptionButtonProps) {
  // Determine styles based on answered state
  let buttonClasses = 'w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-200 font-medium text-base ';
  let icon = null;

  if (!isAnswered) {
    buttonClasses += 'border-gray-200 dark:border-gray-700 bg-white hover:bg-purple-50 hover:border-purple-300 dark:bg-gray-800 dark:hover:bg-gray-700/50 dark:hover:border-purple-500/50 text-gray-700 dark:text-gray-200 shadow-sm hover:shadow active:scale-[0.99]';
  } else {
    if (isCorrect) {
      // Correct answer state (always green)
      buttonClasses += 'border-emerald-500 bg-emerald-500 text-white shadow-emerald-200/50 dark:shadow-none';
      icon = (
        <svg className="w-5.5 h-5.5 text-white shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      );
    } else if (isSelected) {
      // Wrong selected answer state (red)
      buttonClasses += 'border-rose-500 bg-rose-500 text-white shadow-rose-200/50 dark:shadow-none';
      icon = (
        <svg className="w-5.5 h-5.5 text-white shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    } else {
      // Unselected other incorrect answer state (opacity-50)
      buttonClasses += 'border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40 text-gray-400 dark:text-gray-500 opacity-50 cursor-not-allowed';
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={isAnswered}
      className={buttonClasses}
    >
      <span className="truncate pr-2">{label}</span>
      {icon}
    </button>
  );
}
