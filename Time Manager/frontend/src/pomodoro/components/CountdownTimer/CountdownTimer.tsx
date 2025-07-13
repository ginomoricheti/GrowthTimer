import styles from './CountdownTimer.module.css'
import { useRef, useState } from 'react';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(3000);
  const intervalRef = useRef<number | null>(null);

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 0) {
          clearInterval(intervalRef.current);
          intervalRef.current = null
          return 0;
        }
        return prevTimeLeft -1
      });
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
  };

  const resetTimer = () => {
    stopTimer();
    setTimeLeft(3000);
  };

  return (
    <>
      <div className={styles.timerBox}>
        <h1>POMODORO TIMER</h1>

        <div className={styles.timerDisplay}>
          <span>{String(Math.floor(timeLeft / 60)).padStart(2, "0")}</span>
          <span>:</span>
          <span>{String(timeLeft % 60).padStart(2, "0")}</span>
        </div>
        <div className={styles.timerButtons}>
          <button
            className={styles.start}
            onClick={startTimer}
          >START</button>
          <button
            className={styles.stop}
            onClick={stopTimer}
            >STOP</button>
          <button
            className={styles.reset}
            onClick={resetTimer}
          >RESET</button>
        </div>
      </div>
    </>
  );
}

export default CountdownTimer;