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
  }, [active, stop]);

  return { secondsLeft, reset, stop };
}
