import styles from "./MainChart.module.css"
import { useGraphContext } from "../../context/GraphContext"

const MainChart = () => {
  const data = useGraphContext();
  return (
    <div className={styles.mainChartBox}>
      {data.name}
    </div>
  )
}

export default MainChart;