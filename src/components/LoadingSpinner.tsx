
export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative w-16 h-16">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 dark:border-purple-400/20 animate-pulse"></div>
        {/* Spinning gradient ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 dark:border-t-purple-400 animate-spin"></div>
      </div>
      <p className="text-purple-600 dark:text-purple-400 font-medium animate-pulse tracking-wide text-sm">
        Cargando preguntas...
      </p>
    </div>
  );
}
