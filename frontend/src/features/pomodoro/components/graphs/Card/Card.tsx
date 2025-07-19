import { Category, Goal, Project } from "@/shared/types";
import styles from './Card.module.css';

type CardProps = {
  data: Project | Goal | Category | null;
};

const Card = ({ data }: CardProps) => {
  if (!data) return null;

  const isProject = (d: any): d is Project => 'goals' in d || 'code' in d && 'name' in d;
  const isGoal = (d: any): d is Goal => 'projectCode' in d;
  const isCategory = (d: any): d is Category => !('projectCode' in d) && !('goals' in d);

  return (
    <div className={styles.cardBox}>
      <h3>{data.name}</h3>
      <div className={styles.details}>
        {isProject(data) && (
          <>
            <p><span>Type:</span> Project</p>
            <p><span>Code:</span> {data.code}</p>
            <p><span>Goals:</span> {Array.isArray(data.goals) && data.goals.length > 0}</p>
          </>
        )}
        {isGoal(data) && (
          <>
            <p><span>Type:</span> Goal</p>
            <p><span>Code:</span> {data.code}</p>
            <p><span>Project Code:</span> {data.projectCode}</p>
          </>
        )}
        {isCategory(data) && (
          <>
            <p><span>Type:</span> Category</p>
            <p><span>Code:</span> {data.code}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Card;
