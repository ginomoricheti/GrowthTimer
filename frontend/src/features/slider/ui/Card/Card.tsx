import { ProjectGet } from "@/shared/types";
import styles from './Card.module.css';

type CardProps = {
  data: ProjectGet;
};

const Card = ({ data }: CardProps) => {
  if (!data) return null;

  return (
    <div className={styles.cardBox}>
      <h3>{data.name}</h3>
      <div className={styles.details}>
        <p><span>Type:</span> Project</p>
        <p><span>ID:</span> {data.id}</p>
      </div>
    </div>
  );
};

export default Card;
