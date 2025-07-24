import { Category, Goal, Project } from "@/shared/types";
import styles from './Card.module.css';

type CardProps = {
  data: Project | Goal | Category | null;
};

const Card = ({ data }: CardProps) => {
  if (!data) return null;

  return (
    <div className={styles.cardBox}>
      <h3>{data.name}</h3>
      <div className={styles.details}>
        <p><span>Type:</span> Project</p>
        <p><span>Code:</span> {data.code}</p>
      </div>
    </div>
  );
};

export default Card;
