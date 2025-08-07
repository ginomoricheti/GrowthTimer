import type { GoalGet } from "./GoalTypes";
import { PomodoroRecordGet } from "./PomodoroTypes";

export interface ProjectGet {
  id: number;
  name: string;
  categoryName: string;
  goals?: GoalGet[];
  pomodoroRecords: PomodoroRecordGet[];
  totalTimeMinutes: number;
  createdAt?: string;
  updatedAt?: string;
  color?: string;
}

export interface ProjectPost {
  name: string;
  idCategory: number;
  color: string;
}