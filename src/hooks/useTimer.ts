import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseTimerReturn {
  secondsLeft: number;
  reset: () => void;
  stop: () => void;
}

export function useTimer(
  durationSeconds: number,
  onExpire: () => void,
  active: boolean
): UseTimerReturn {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  // resetKey forces the interval effect to re-run when reset() is called,
  // even if `active` hasn't changed (e.g. navigating between unanswered questions).
  const [resetKey, setResetKey] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    setSecondsLeft(durationSeconds);
    // Incrementing resetKey triggers the interval effect to restart.
    setResetKey((k) => k + 1);
  }, [durationSeconds, stop]);

  useEffect(() => {
    if (!active) {
      stop();
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          stop();
          onExpireRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => stop();
  // resetKey is intentionally included: it forces a full interval restart on reset().
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, stop, resetKey]);

  return { secondsLeft, reset, stop };
}
