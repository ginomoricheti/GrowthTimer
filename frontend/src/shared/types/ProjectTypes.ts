import type { Goal } from "./GoalTypes";

export interface Project {
  name: string;
  code: string;
  goals?: Goal[];
  // amountOfMinutes: number;
}
