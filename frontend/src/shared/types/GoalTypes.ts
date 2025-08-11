export interface GoalGet {
  id: number;
  title: string;
  targetMinutes: number;
  completedMinutes: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GoalPost {
  title: string;
  idProject: number;
  targetMinutes: number;
}