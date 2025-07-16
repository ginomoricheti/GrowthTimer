import styles from './CountdownTimer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faPause, faPlay, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { toast } from 'react-toastify';
import usePomodoroTimer from '../../hooks/usePomodoroTimer';

type Project = { name: string; code: string };
type Goal = { name: string; code: string; projectCode: string };
type Category = { name: string; code: string };

// TEMPORAL HASTA TENER BACKEND ---------------------------------------
const projects = [
  { name: 'React App', code: 'PR1' },
  { name: 'Backend API', code: 'PR2' },
  { name: 'Portafolio', code: 'PR3' }
];

const goals = [
  { name: 'Terminar login', code: 'G1', projectCode: 'PR1' },
  { name: 'Mejorar UI', code: 'G4', projectCode: 'PR1' },
  { name: 'Integrar base de datos', code: 'G2', projectCode: 'PR2' },
  { name: 'Deploy a Vercel', code: 'G3', projectCode: 'PR3' }
];

const categories = [
  { name: 'Programación', code: 'C1' },
  { name: 'Diseño', code: 'C2' },
  { name: 'Documentación', code: 'C3' }
];
// TEMPORAL HASTA TENER BACKEND ---------------------------------------

const CountdownTimer = () => {
  const workTime = 5;
  const breakTime = 5;

  const {
    timeLeft,
    isBreak,
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

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const endSession = () => {
    if (
      workedSeconds <= 0 ||
      selectedProject == null ||
      selectedGoal == null ||
      selectedCategory == null
    ) {
      toast.error('Faltan campos por enviar');
      reset();
      throw new Error('No está seleccionado todo lo que hace falta para terminar la sesión');
    }
    console.log('Al backend voy a mandar:');
    console.log('Proyecto: ', selectedProject);
    console.log('Objetivo: ', selectedGoal);
    console.log('Categoria: ', selectedCategory);
    console.log('Segundos trabajados: ', workedSeconds);

    reset();
  };

  const filteredGoals = selectedProject
    ? goals.filter((g) => g.projectCode === selectedProject.code)
    : [];

  return (
    <>
      <div className={styles.selectSection}>
        <Dropdown
          value={selectedProject}
          onChange={(e) => {
            setSelectedProject(e.value);
            setSelectedGoal(null);
          }}
          options={projects}
          optionLabel="name"
          placeholder="Projects"
          className={styles.dropdown}
        />
        {selectedProject && (
          <>
            <FontAwesomeIcon icon={faCaretRight} className={`${styles.arrows} ${styles.arrow1}`} />
            <Dropdown
              value={selectedGoal}
              onChange={(e) => setSelectedGoal(e.value)}
              options={filteredGoals}
              optionLabel="name"
              placeholder="Goals"
              className={styles.dropdown}
              disabled={!selectedProject}
            />
            {selectedGoal && (
              <>
                <FontAwesomeIcon icon={faCaretRight} className={`${styles.arrows} ${styles.arrow2}`} id="st" />
                <Dropdown
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.value)}
                  options={categories}
                  optionLabel="name"
                  placeholder="Categories"
                  className={styles.dropdown}
                />
              </>
            )}
          </>
        )}
      </div>

      <div className={styles.timerBox}>
        <div className={styles.timerDisplay}>
          <h1>POMODORO</h1>
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
      </div>

      <div className={styles.offButtonContainer}>
        <button className={styles.offButton} onClick={endSession}>
          END SESSION
        </button>
      </div>

      <div className={styles.progressBarContainer}>
        <div
          className={styles.progressBar}
          style={{
            width: `${(timeLeft / (isBreak ? breakTime : workTime)) * 100}%`
          }}
        />
      </div>
    </>
  );
};

export default CountdownTimer;
