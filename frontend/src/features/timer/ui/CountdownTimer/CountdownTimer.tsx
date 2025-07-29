import styles from './CountdownTimer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import usePomodoroTimer from '../../hooks/usePomodoroTimer';
import EndSessionPopup from '../EndSessionPopup/EndSessionPopup';
import { Category, Goal, PomodoroRecord, ProjectGet, Task } from '@/shared/types';
import HeatMap from '../../../history/ui/HeatMap/HeatMap';

// ------------------------- TEMPORAL -------------------------
const exampleCategories: Category[] = [
  { id: 1, name: "Estudio", color: "#FF5733" },
  { id: 2, name: "Trabajo", color: "#33C1FF" },
];

const exampleTasks: Task[] = [
  { id: 1, name: "Leer", color: "#AAFFAA" },
  { id: 2, name: "Programar", color: "#FFAAFF" },
];

const exampleGoals: Goal[] = [
  { id: 1, name: "Completar curso de TypeScript", projectCode: 101 },
  { id: 2, name: "Desarrollar app Pomodoro", projectCode: 101 },
];

const examplePomodoroRecords: PomodoroRecord[] = [
  {
    date: "2025-07-25",
    minutes: 25,
    project: "Estudio Pomodoro",
    task: exampleTasks[0],
  },
  {
    date: "2025-07-26",
    minutes: 50,
    project: "Estudio Pomodoro",
    task: exampleTasks[1],
  },
];

const exampleProjects: ProjectGet[] = [
  {
    id: 101,
    name: "Estudio Pomodoro",
    category: exampleCategories[0],
    goals: exampleGoals,
    pomodoroRecords: examplePomodoroRecords,
    totalTimeMinutes: 75,
    createdAt: "2025-07-01T10:00:00Z",
    updatedAt: "2025-07-20T12:00:00Z",
    color: "#FF5733",
  },
  {
    id: 102,
    name: "Trabajo Freelance",
    category: exampleCategories[1],
    goals: [],
    pomodoroRecords: [],
    totalTimeMinutes: 0,
    createdAt: "2025-07-10T08:00:00Z",
    updatedAt: "2025-07-20T12:00:00Z",
    color: "#33C1FF",
  },
];
// ------------------------- TEMPORAL -------------------------
const categories: Category[] = Array.from(
  new Map(
    exampleProjects.map((p) => [p.category.id, p.category]) // clave única por ID
  ).values()
);


const CountdownTimer = () => {
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

            const category = project.category;

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
          projects={exampleProjects.map(p => ({
            ...p,
            goals: p.goals?.filter(g => g.projectCode === p.id)
          }))}
          categories={categories}
        />
      </div>
      <h4 className={styles.currentTimeDetails}>You've been worked for <span>{formattedWorkedTime}</span></h4>

      <HeatMap />
    </>
  );
};

export default CountdownTimer;
