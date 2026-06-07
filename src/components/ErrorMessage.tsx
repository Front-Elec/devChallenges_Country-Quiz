import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto my-4 bg-red-50/80 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl shadow-sm backdrop-blur-sm">
      <div className="w-12 h-12 flex items-center justify-center bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full mb-4">
        {/* Warning Icon */}
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
        Ha ocurrido un error
      </h3>
      <p className="text-red-600 dark:text-red-400 text-sm mb-6 font-medium">
        {message}
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 dark:bg-red-700 dark:hover:bg-red-600 dark:active:bg-red-800 text-white font-medium text-sm rounded-xl transition-all duration-200 hover:shadow-md active:scale-95"
      >
        Reintentar
      </button>
    </div>
  );
}
