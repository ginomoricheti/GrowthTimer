import styles from "./Graphs.module.css"
import MainChart from "./ui/MainChart/MainChart";
import SecondaryChart from "./ui/SecondaryChart/SecondaryChart";


export const Graphs = () => {
  return (
    <div className={styles.graphsSection}>
      <MainChart />
      <div className={styles.secondaryGraphsSection}>
        <SecondaryChart />
        <SecondaryChart />
      </div>
    </div>
  )
}