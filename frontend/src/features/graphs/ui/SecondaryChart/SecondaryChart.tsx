import styles from "./SecondaryChart.module.css"
import { useGraphContext } from "../../context/GraphContext"

const SecondaryChart = () => {
  const data = useGraphContext();
  return (
    <div className={styles.secondaryChartBox}>
      {data.pomodoroRecords.map((el) => el.task.name)}
    </div>
  )
}

export default SecondaryChart;