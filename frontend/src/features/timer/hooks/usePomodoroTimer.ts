import { useCallback, useEffect, useRef, useState } from 'react';

type usePomodoroTimerProps = {
  workTime: number;
  breakTime: number;
  onModeChange?: (isBreak: boolean) => void;
};

const usePomodoroTimer = ({ workTime, breakTime, onModeChange }: usePomodoroTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(workTime);
  const [isBreak, setIsBreak] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [workedSeconds, setWorkedSeconds] = useState(0);
  const countSecondsRef = useRef(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive && timeLeft === 0) {
      setTimeLeft(isBreak ? breakTime : workTime);
    }
  }, [workTime, breakTime, isBreak, isActive, timeLeft]);

  const switchMode = useCallback(() => {
    setIsBreak(prev => {
      const newIsBreak = !prev;
      onModeChange?.(newIsBreak);
      setTimeLeft(newIsBreak ? breakTime : workTime);
      return newIsBreak;
    });
  }, [workTime, breakTime, onModeChange]);

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          switchMode();
          return 0;
        }
        return prev - 1;
      });

      countSecondsRef.current += 1;
      setWorkedSeconds(countSecondsRef.current);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, switchMode]);

  const start = useCallback(() => {
    if (!isActive) {
      setIsActive(true);
      document.documentElement.style.backgroundColor = '#53ae5e';
    }
  }, [isActive]);

  const stop = useCallback(() => {
    setIsActive(false);
    document.documentElement.style.backgroundColor = '#d90f26';
  }, []);

  const reset = useCallback(() => {
    stop();
    setIsBreak(false);
    setTimeLeft(workTime);
    document.documentElement.style.backgroundColor = '#242424';
  }, [stop, workTime]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    timeLeft,
    isBreak,
    isActive,
    start,
    stop,
    reset,
    workedSeconds,
  };
};

export default usePomodoroTimer;
