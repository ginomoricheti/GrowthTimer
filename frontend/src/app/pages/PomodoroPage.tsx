import { useState } from "react";
import CountdownTimer from "../../features/timer/ui/CountdownTimer/CountdownTimer";
import styles from "./PomodoroPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { GoalGet, PomodoroRecordGet, ProjectGet, TaskGet } from "@/shared/types";
import Slider from "@/features/slider/ui/Slider/Slider";
import Card from "@/features/slider/ui/Card/Card";
import { Graphs } from "@/features/graphs/Graphs";

// ------------------------- TEMPORAL -------------------------

const exampleTasks: TaskGet[] = [
  {
    id: 1,
    name: "Leer",
    color: "#AAFFAA",
    totalTimeMinutes: 50
  },
  {
    id: 2,
    name: "Programar",
    color: "#FFAAFF",
    totalTimeMinutes: 50
  },
];

const exampleGoals: GoalGet[] = [
  {
    id: 3,
    title: "Goal 321",
    targetMinutes: 200,
    completedMinutes: 100,
    isCompleted: false,
    createdAt: "string",
    updatedAt: "string",
  },
  {
    id: 3,
    title: "Goal 321",
    targetMinutes: 200,
    completedMinutes: 100,
    isCompleted: false,
    createdAt: "string",
    updatedAt: "string",
  },
];

const examplePomodoroRecords: PomodoroRecordGet[] = [
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
    categoryName: "Pipipi",
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
    categoryName: "Pipipi",
    goals: [],
    pomodoroRecords: [],
    totalTimeMinutes: 0,
    createdAt: "2025-07-10T08:00:00Z",
    updatedAt: "2025-07-20T12:00:00Z",
    color: "#33C1FF",
  },
];
// ------------------------- TEMPORAL -------------------------


const PomodoroPage = () => {
  const [showSecondPage, setShowSecondPage] = useState(false);

  return (
    <div className={styles.viewport}>
      <div
        className={styles.slider}
        style={{
          transform: showSecondPage ? "translateX(-100vw)" : "translateX(0)",
        }}
      >
        {/* First view (Pomodoro) */}
        <div className={styles.page}>
          <CountdownTimer />
          <button onClick={() => setShowSecondPage(true)} className={`${styles.navButton} ${styles.rightButton}`}>
            <FontAwesomeIcon icon={faAnglesRight} />
          </button>
        </div>

        {/* Second view (Resume) */}
        <div className={styles.page}>
          <div className={styles.projectsSection}>
            {exampleProjects.map((el) => (
              <div className={styles.item} key={el.id}><Card data={el} /></div>
            ))}
          </div>
          <div className={styles.chartsSection}>
            <Slider
              slidesPerView={1}
              slidesPerGroup={1}
              spaceBetween={0}
              autoPlay={false}
              autoPlayInterval={2000}
              loop={true}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  slidesPerGroup: 1,
                },
                1366: {
                  slidesPerView: 4,
                  slidesPerGroup: 4,
                  spaceBetween: 18,
                },
                1920: {
                  slidesPerView: 5,
                  slidesPerGroup: 5,
                  spaceBetween: 24,
                }
              }}
            >
              {exampleProjects.map(() => 
                <Graphs />
              )}
            </Slider>
          </div>
          <button onClick={() => setShowSecondPage(false)} className={`${styles.navButton} ${styles.leftButton}`}>
            <FontAwesomeIcon icon={faAnglesLeft} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroPage;
