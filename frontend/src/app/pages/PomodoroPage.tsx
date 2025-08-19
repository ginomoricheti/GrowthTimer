import { useState } from "react";
import CountdownTimer from "../../features/timer/ui/CountdownTimer/CountdownTimer";
import styles from "./PomodoroPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import Card from "@/features/slider/ui/Card/Card";
import { Graphs } from "@/features/graphs/Graphs";
import CustomSidebar from "@/features/sidebar/ui/CustomSidebar/CustomSidebar";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { useProjects } from "@/shared/context/ProjectsContext";
import { useCategories } from "@/shared/context/CategoriesContext";
import { useTasks } from "@/shared/context/TasksContext";
import { usePomodoros } from "@/shared/context/PomodorosContext";
import { useReports } from "@/shared/context/ReportsContext";

const PomodoroPage = () => {
  const [showSecondPage, setShowSecondPage] = useState(false);

  const { projects } = useProjects();
  const { categories } = useCategories();
  const { tasks } = useTasks();
  const { pomodoros } = usePomodoros();
  const { summary } = useReports();

  return (
    <div className={styles.viewport}>
      <div
        className={styles.slider}
        style={{
          transform: showSecondPage ? "translateX(-100vw)" : "translateX(0)",
        }}
      >
        <CustomSidebar />
        {/* First view (Pomodoro) */}
        <div className={styles.page}>
          <CountdownTimer
            categories = {categories}
            tasks = {tasks}
            projects = {projects}
            pomodoros = {pomodoros}
          />
          <button onClick={() => setShowSecondPage(true)} className={`${styles.navButton} ${styles.rightButton}`}>
            <FontAwesomeIcon icon={faAnglesRight as unknown as IconProp} />
          </button>
        </div>

        {/* Second view (Resume) */}
        <div className={styles.page}>
          <div className={styles.projectsSection}>
            {projects.map((el) => (
              <div className={styles.item} key={el.id}><Card projectId={Number(el.id)} /></div>
            ))}
          </div>
          <div className={styles.chartsSection}> 
            <Graphs data={summary}/>
          </div>
          <button onClick={() => setShowSecondPage(false)} className={`${styles.navButton} ${styles.leftButton}`}>
            <FontAwesomeIcon icon={faAnglesLeft as unknown as IconProp} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroPage;
