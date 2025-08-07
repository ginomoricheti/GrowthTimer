import { TaskGet } from "./TaskTypes";

export interface PomodoroRecordGet {
  date: Date | string;
  minutes: number;
  project: string;
  task?: TaskGet;
}

export interface PomodoroRecordPost {
  minutes: number;
  idProject: number;
  idTask: number;
  idGoal: number;
}
