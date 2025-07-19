import { useState } from "react";
import CountdownTimer from "./components/CountdownTimer/CountdownTimer";
import styles from "./PomodoroPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";

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
          <h2>Resumen</h2>
          <p>Estadisticas</p>
          <button onClick={() => setShowSecondPage(false)} className={`${styles.navButton} ${styles.leftButton}`}>
            <FontAwesomeIcon icon={faAnglesLeft} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroPage;
