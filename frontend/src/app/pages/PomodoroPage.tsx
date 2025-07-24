import { useState } from "react";
import CountdownTimer from "../../features/timer/ui/CountdownTimer/CountdownTimer";
import styles from "./PomodoroPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { ProjectGet } from "@/shared/types";
import Slider from "@/features/slider/ui/Slider/Slider";
import Card from "@/features/slider/ui/Card/Card";
import { Graphs } from "@/features/graphs/Graphs";

const exampleData: ProjectGet = {
  name: "uhsduhfds",
  code: "udhf",
  goals: [
    {
      name: "uhsduhfds",
      code: "udhf",
      projectCode: "e1",
    }
  ],
  pomodoroRecords: [
    {
      date: new Date(),
      minutes: 300,
      project: "Proyecto ejemplo",
      task: {
        id: 1,
        name: "Estudiar",
      },
    }
  ],
  totalTimeMinutes: 300,
}

const PomodoroPage = () => {
  const [showSecondPage, setShowSecondPage] = useState(false);
  const sliderItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

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
            {sliderItems.map((index) => (
              <div className={styles.item} key={index}><Card data={exampleData} /></div>
            ))}
          </div>
          <div className={styles.chartsSection}>
            <Slider
              slidesPerView={1}
              slidesPerGroup={1}
              spaceBetween={8}
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
              <Graphs data={exampleData}/>
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
