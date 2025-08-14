import { useEffect, useState } from "react";
import CountdownTimer from "../../features/timer/ui/CountdownTimer/CountdownTimer";
import styles from "./PomodoroPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import Card from "@/features/slider/ui/Card/Card";
import { Graphs } from "@/features/graphs/Graphs";
import useGetAllData from "@/shared/hooks/useGetAllData";
import CustomSidebar from "@/features/sidebar/ui/CustomSidebar/CustomSidebar";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const PomodoroPage = () => {
  const [showSecondPage, setShowSecondPage] = useState(false);
  const { data, fetchAllData } = useGetAllData();

  useEffect(() => {
    fetchAllData();
  }, []);

  console.log(data.pomodoros)
  
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
            categories = {data.categories}
            tasks = {data.tasks}
            projects = {data.projects}
            pomodoros = {data.pomodoros}
          />
          <button onClick={() => setShowSecondPage(true)} className={`${styles.navButton} ${styles.rightButton}`}>
            <FontAwesomeIcon icon={faAnglesRight as unknown as IconProp} />
          </button>
        </div>

        {/* Second view (Resume) */}
        <div className={styles.page}>
          <div className={styles.projectsSection}>
            {data.projects.map((el) => (
              <div className={styles.item} key={el.id}><Card data={el} /></div>
            ))}
          </div>
          <div className={styles.chartsSection}> 
            <Graphs data={data.summary}/>
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
