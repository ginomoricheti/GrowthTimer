import { Category } from "./CategoryTypes";
import type { Goal } from "./GoalTypes";
import { PomodoroRecord } from "./PomodoroTypes";

export interface ProjectGet {
  name: string;
  code: string;
  category?: Category,
  goals?: Goal[];
  pomodoroRecords: PomodoroRecord[];
  totalTimeMinutes: number;

  createdAt?: string;
  updatedAt?: string;
  color?: string;
}
