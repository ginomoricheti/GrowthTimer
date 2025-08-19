import { useCallback, useEffect, useRef, useState } from 'react';
import sound from '@/assets/sounds/sound_6.mp3'

type usePomodoroTimerProps = {
  workTime: number;
  breakTime: number;
  onModeChange?: (isBreak: boolean) => void;
};

const usePomodoroTimer = ({ workTime, breakTime, onModeChange }: usePomodoroTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(workTime * 60);
  const [isBreak, setIsBreak] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [workedSeconds, setWorkedSeconds] = useState(0);

  const countSecondsRef = useRef(0);
  const intervalRef = useRef<number | null>(null);

  const prevWorkTimeRef = useRef(workTime);
  const prevBreakTimeRef = useRef(breakTime);

  useEffect(() => {
    if (!isActive) {
      if (prevWorkTimeRef.current !== workTime || prevBreakTimeRef.current !== breakTime) {
        setTimeLeft(isBreak ? breakTime * 60 : workTime * 60);
        prevWorkTimeRef.current = workTime;
        prevBreakTimeRef.current = breakTime;
      }
    }
  }, [workTime, breakTime, isBreak, isActive]);

  const switchMode = useCallback(() => {
    const alarm = new Audio(sound);
    alarm.volume = 0.07;
    alarm.play().catch(() => { console.log('No se pudo reproducir el sonido'); });

    setIsBreak(prev => {
      const newIsBreak = !prev;
      onModeChange?.(newIsBreak);
      setTimeLeft(newIsBreak ? breakTime * 60 : workTime * 60);
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
        if (prev <= 0) {
          switchMode();
          return 0;
        }
        return prev - 1;
      });

      // Incrementar workedSeconds solo si no es break
      setWorkedSeconds(prev => (!isBreak ? prev + 1 : prev));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, switchMode, isBreak]);


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
    setTimeLeft(workTime * 60);
    countSecondsRef.current = 0;
    setWorkedSeconds(0);
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