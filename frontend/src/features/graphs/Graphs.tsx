import { ReportGet } from "@/shared/types";
import styles from "./Graphs.module.css"
import MainChart from "./ui/MainChart/MainChart";
import SecondaryChart from "./ui/SecondaryChart/SecondaryChart";

interface GraphsProps {
  data: ReportGet,
}

export const Graphs = ({ data }: GraphsProps) => {

  return (
    <div className={styles.graphsSection}>
      <MainChart data={data.byProject}/>
      <div className={styles.secondaryGraphsSection}>
        <SecondaryChart data={data.byCategory} chartKey="byCat"/>
        <SecondaryChart data={data.byTask} chartKey="byTask"/>
      </div>
    </div>
  )
}