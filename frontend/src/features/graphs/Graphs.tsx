import styles from "./Graphs.module.css"
import { GraphContext } from "./context/GraphContext";
import MainChart from "./ui/MainChart/MainChart";
import SecondaryChart from "./ui/SecondaryChart/SecondaryChart";
import { ProjectGet } from "@/shared/types";

type GraphProps = {
  data: ProjectGet;
};

export const Graphs = ({ data }: GraphProps) => {
  return (
    <GraphContext.Provider value={data}>
      <div className={styles.graphsSection}>
        <MainChart />
        <div className={styles.secondaryGraphsSection}>
          <SecondaryChart />
          <SecondaryChart />
        </div>
      </div>
    </GraphContext.Provider>
  )
}