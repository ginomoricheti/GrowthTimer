import { CategoryGet } from "./CategoryTypes";
import type { GoalGet } from "./GoalTypes";
import { PomodoroRecordGet } from "./PomodoroTypes";

export interface ProjectGet {
  id: number;
  name: string;
  category: CategoryGet;
  goals?: GoalGet[];
  pomodoroRecords: PomodoroRecordGet[];
  totalTimeMinutes: number;
  createdAt?: string;
  updatedAt?: string;
  color?: string;
}
