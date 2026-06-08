
export interface TimerBarProps {
  secondsLeft: number; // 0-15
  totalSeconds: number; // 15
  isActive: boolean;
}

export default function TimerBar({ secondsLeft, totalSeconds, isActive }: TimerBarProps) {
  const percentage = Math.max(0, Math.min(100, (secondsLeft / totalSeconds) * 100));

  // Determine progress bar color based on time remaining
  let colorClass = 'bg-emerald-500';
  let textClass = 'text-emerald-600 dark:text-emerald-400';
  let pulseClass = '';

  if (secondsLeft <= 5) {
    colorClass = 'bg-rose-500';
    textClass = 'text-rose-600 dark:text-rose-400 font-bold';
    if (isActive && secondsLeft > 0) {
      pulseClass = 'animate-pulse';
    }
  } else if (secondsLeft <= 10) {
    colorClass = 'bg-amber-500';
    textClass = 'text-amber-600 dark:text-amber-400';
  }

  return (
    <div className="w-full flex items-center space-x-4 py-2">
      {/* Clock icon */}
      <svg
        className={`w-5 h-5 shrink-0 ${textClass} ${pulseClass}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>

      {/* Progress Bar Container */}
      <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full ${colorClass} transition-all duration-1000 ease-linear rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Countdown text */}
      <span className={`w-8 text-right font-mono text-sm ${textClass} ${pulseClass}`}>
        {secondsLeft}s
      </span>
    </div>
  );
}
