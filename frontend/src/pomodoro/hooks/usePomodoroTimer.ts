import { useCallback, useEffect, useRef, useState } from 'react'

type usePomodoroTimerProps = {
  workTime: number;
  breakTime: number;
  onModeChange?: (isBreak: boolean) => void;
}

const usePomodoroTimer = ({ workTime, breakTime, onModeChange }: usePomodoroTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(workTime);
  const [isBreak, setIsBreak] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const countSecondsRef = useRef(0);

  const runTimerCycle = useCallback((duration: number, breakMode: boolean) => {
    setIsBreak(breakMode);
    onModeChange?.(breakMode);
    setTimeLeft(duration);
    clearInterval(intervalRef.current!);

    intervalRef.current = window.setInterval(() => {
      countSecondsRef.current += 1;
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          
          if (!breakMode) {
            runTimerCycle(breakTime, true);
          } else {
            runTimerCycle(workTime, false);
          }

          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  }, [breakTime, workTime, onModeChange]);

  const start = useCallback(() => {
    document.documentElement.style.backgroundColor = '#53ae5e';

    if (intervalRef.current) return;
    setIsActive(true);

    intervalRef.current = window.setInterval(() => {
      countSecondsRef.current += 1;
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          
          if (!isBreak) {
            runTimerCycle(breakTime, true);
          } else {
            runTimerCycle(workTime, false);
          }

          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  }, [runTimerCycle, workTime, breakTime, isBreak]);

  const stop = useCallback (() => {
    setIsActive(false);
    document.documentElement.style.backgroundColor = '#d90f26'
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [])

  const reset = useCallback(() => {
    stop();
    countSecondsRef.current = 0;
    setIsBreak(false);
    setTimeLeft(workTime);
    document.documentElement.style.backgroundColor = '#242424'
  }, [stop, workTime]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, []);

  return {
    timeLeft,
    isBreak,
    isActive,
    start,
    stop,
    reset,
    workedSeconds: countSecondsRef.current,
  };
}

export default usePomodoroTimer