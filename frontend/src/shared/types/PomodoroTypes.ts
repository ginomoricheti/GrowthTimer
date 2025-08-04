import { TaskGet } from "./TaskTypes";

export interface PomodoroRecordGet {
  date: Date | string;
  minutes: number;
  project: string;
  task?: TaskGet;
}

export interface PomodoroRecordPost {
  minutes: number;
  id_project: number;
  id_task: number;
  id_goal: number;
}
