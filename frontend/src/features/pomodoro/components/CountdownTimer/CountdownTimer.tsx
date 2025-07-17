import styles from './CountdownTimer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import usePomodoroTimer from '../../hooks/usePomodoroTimer';
import EndSessionPopup from '../EndSessionPopup/EndSessionPopup';
import { Category, Goal, Project } from '@/shared/types';
import HeatMap from '../HeatMap/HeatMap';

// --------------------- TEMPORAL HASTA TENER BACKEND --------------------------
const exampleProjects: (Project & { goals: Goal[] })[] = [
  {
    name: 'Fullstack App',
    code: 'proj-001',
    goals: [
      { name: 'Frontend con React', code: 'goal-001', projectCode: 'proj-001' },
      { name: 'Backend con Express', code: 'goal-002', projectCode: 'proj-001' },
    ],
  },
  {
    name: 'Estudio de inglés',
    code: 'proj-002',
    goals: [
      { name: 'Vocabulario', code: 'goal-003', projectCode: 'proj-002' },
      { name: 'Listening', code: 'goal-004', projectCode: 'proj-002' },
      { name: 'Speaking', code: 'goal-005', projectCode: 'proj-002' },
    ],
  },
  {
    name: 'Organización Personal',
    code: 'proj-003',
    goals: [
      { name: 'Planificación semanal', code: 'goal-006', projectCode: 'proj-003' },
      { name: 'Revisión mensual', code: 'goal-007', projectCode: 'proj-003' },
    ],
  },
];

const exampleCategories: Category[] = [
  { code: 'estudiar', name: 'Estudiar' },
  { code: 'codear', name: 'Codear' },
  { code: 'planificar', name: 'Planificar' },
  { code: 'idear', name: 'Idear' },
  { code: 'arreglar', name: 'Arreglar' },
  { code: 'controlar', name: 'Controlar' },
];
// --------------------- TEMPORAL HASTA TENER BACKEND -------------------------

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
        <button className={styles.offButton} onClick={() => setIsPopupOpen(true)}>
          END SESSION
        </button>
        <EndSessionPopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          onConfirm={({ project, goal, category }) => {
            if (workedSeconds <= 0) {
              toast.error('No hubo tiempo trabajado');
              reset();
              return;
            }

            console.log('Al backend voy a mandar:');
            console.log('Proyecto: ', project);
            console.log('Objetivo: ', goal);
            console.log('Categoria: ', category);
            console.log('Segundos trabajados: ', workedSeconds);
            
            // BACKEND CALL HERE OR CUSTOMHOOKCALL;

            reset();
            setIsPopupOpen(false);
          }}
          projects={exampleProjects.map(p => ({
            ...p,
            goals: p.goals?.filter(g => g.projectCode === p.code)
          }))}
          categories={exampleCategories}
        />
      </div>
      <h4 className={styles.currentTimeDetails}>You've been worked for <span>{formattedWorkedTime}</span></h4>

      <HeatMap />
    </>
  );
};

export default CountdownTimer;
