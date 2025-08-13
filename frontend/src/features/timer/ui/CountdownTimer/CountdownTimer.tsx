import styles from './CountdownTimer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import usePomodoroTimer from '../../hooks/usePomodoroTimer';
import EndSessionPopup from '../EndSessionPopup/EndSessionPopup';
import HeatMap from '../../../history/ui/HeatMap/HeatMap';
import { CategoryGet, ProjectGet, TaskGet, PomodoroRecordGet } from '@/shared/types';

interface CountdownTimerProps {
  categories: CategoryGet[],
  tasks: TaskGet[],
  projects: ProjectGet[],
  pomodoros: PomodoroRecordGet[],
}

const CountdownTimer = ({ categories, tasks, projects, pomodoros }: CountdownTimerProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const workTime = 65;
  const breakTime = 10;
  
  const date = new Date();
  const day = date.toLocaleDateString('en-US', { weekday: 'long' });
  const dayOfMonth = String(date.getDate()).padStart(2, '0');
  const nameMont = date.toLocaleString('en-US', { month: 'long' });

  const getTimeWithoutSeconds = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const [ctime, setTime] = useState(getTimeWithoutSeconds());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getTimeWithoutSeconds());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const {
    timeLeft,
    // isBreak,
    isActive,
    start,
    stop,
    reset,
    workedSeconds,
  } = usePomodoroTimer({
    workTime,
    breakTime,
    onModeChange: (breakMode) => {
      document.documentElement.style.backgroundColor = breakMode ? '#4287f5' : '#53ae5e';
    }
  });

  const workedMinTime = Math.floor(workedSeconds / 60);
  const hours = Math.floor(workedMinTime / 60);
  const minutes = workedMinTime % 60;

  const formattedWorkedTime = `${hours}h ${minutes}m`;

  return (
    <>
      <div className={styles.timerBox}>
        <h3 className={styles.dateTitle}>{`${day} ${dayOfMonth} of ${nameMont}`}&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;{`${ctime}`}</h3>
        <div className={styles.timerDisplay}>
          <span>{String(Math.floor(timeLeft / 60)).padStart(2, '0')}</span>
          <span>:</span>
          <span>{String(timeLeft % 60).padStart(2, '0')}</span>
        </div>
        <div className={styles.timerButtons}>
          <button
            className={`${isActive ? styles.inactiveButton : styles.start}`}
            onClick={start}
            disabled={isActive}
          >
            <FontAwesomeIcon icon={faPlay} />
          </button>
          <button
            className={`${!isActive ? styles.inactiveButton : styles.stop}`}
            onClick={stop}
            disabled={!isActive}
          >
            <FontAwesomeIcon icon={faPause} />
          </button>
          <button className={styles.reset} onClick={reset}>
            <FontAwesomeIcon icon={faRotateRight} />
          </button>
        </div>
        <button className={styles.offButton} onClick={() => {
          stop();
          setIsPopupOpen(true);
        } 
        }>
          END SESSION
        </button>
        <EndSessionPopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          onConfirm={({ project, goal, task }) => {
            if (workedSeconds <= 0) {
              toast.error('No hubo tiempo trabajado');
              reset();
              return;
            }

            const category = project.categoryName;

            console.log('Al backend voy a mandar:');
            console.log('Proyecto: ', project);
            console.log('Objetivo: ', goal);
            console.log('Tarea: ', task);
            console.log('Categoria: ', category);
            console.log('Segundos trabajados: ', workedSeconds);
            
            // BACKEND CALL HERE OR CUSTOMHOOKCALL;

            reset();
            setIsPopupOpen(false);
          }}
          projects={projects.map(p => ({
            ...p,
            goals: p.goals?.filter(g => g.id === p.id)
          }))}
          categories={categories}
          tasks={tasks}
        />
      </div>
      <h4 className={styles.currentTimeDetails}>You've been worked for <span>{formattedWorkedTime}</span></h4>

      <HeatMap data={pomodoros}/>
    </>
  );
};

export default CountdownTimer;
