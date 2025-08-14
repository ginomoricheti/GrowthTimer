import styles from './CountdownTimer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faPause, faPlay, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import usePomodoroTimer from '../../hooks/usePomodoroTimer';
import EndSessionPopup from '../EndSessionPopup/EndSessionPopup';
import SettingsPopup from '../SettingsPopup/SettingsPopup';
import HeatMap from '../../../history/ui/HeatMap/HeatMap';
import { CategoryGet, ProjectGet, TaskGet, PomodoroRecordGet } from '@/shared/types';
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { invoke } from '@tauri-apps/api/core';

interface CountdownTimerProps {
  categories: CategoryGet[],
  tasks: TaskGet[],
  projects: ProjectGet[],
  pomodoros: PomodoroRecordGet[],
}

const CountdownTimer = ({ categories, tasks, projects, pomodoros }: CountdownTimerProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSettingsPopupOpen, setIsSettingsPopupOpen] = useState(false);

  const [workTime, setWorkTime] = useState(25*60);
  const [breakTime, setBreakTime] = useState(5*60);
  
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

  const handleSettingsSave = (newWorkTime: number, newBreakTime: number) => {
    setWorkTime(newWorkTime * 60);
    setBreakTime(newBreakTime * 60);
    
    if (isActive) {
      stop();
      reset();
      toast.info(`Settings update: ${newWorkTime}m work, ${newBreakTime}m break`);
    } else {
      reset();
      toast.success(`Settings update: ${newWorkTime}m work, ${newBreakTime}m break`);
    }
  };

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
            <FontAwesomeIcon icon={faPlay as unknown as IconProp} />
          </button>
          <button
            className={`${!isActive ? styles.inactiveButton : styles.stop}`}
            onClick={stop}
            disabled={!isActive}
          >
            <FontAwesomeIcon icon={faPause as unknown as IconProp} />
          </button>
          <button className={styles.reset} onClick={reset}>
            <FontAwesomeIcon icon={faRotateRight as unknown as IconProp} />
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
          onConfirm={async ({ project, goal, task }) => {
            if (workedSeconds <= 0) {
              toast.error('Work time empty');
              reset();
              return;
            }

            const workedMinutes = Math.floor(workedSeconds / 60);

            try {
              await invoke('create_pomodoro', {
                pomodoro: {
                  minutes: workedMinutes,
                  idProject: project.id,
                  idTask: Number(task),
                  idGoal: goal.id,
                }
              });
              toast.success('Pomodoro save correctly.');
            } catch (error) {
              console.error('Error making pomodoro:', error);
              toast.error('Error saving pomodoro');
            }

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
        
        {/* SettingsPopup */}
        <SettingsPopup
          isOpen={isSettingsPopupOpen}
          onClose={() => setIsSettingsPopupOpen(false)}
          onSave={handleSettingsSave}
          currentWorkTime={workTime/60}
          currentBreakTime={breakTime/60}
        />
      </div>
      <button className={styles.settingsButton} onClick={() => {
        setIsSettingsPopupOpen(true);
      }}>
        <FontAwesomeIcon icon={faGear as unknown as IconProp} />
      </button>
      <h4 className={styles.currentTimeDetails}>You've been worked for <span>{formattedWorkedTime}</span></h4>

      <HeatMap data={pomodoros}/>
    </>
  );
};

export default CountdownTimer;