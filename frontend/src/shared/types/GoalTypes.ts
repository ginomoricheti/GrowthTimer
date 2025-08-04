export interface GoalGet {
  id: number;
  title: string;
  target_minutes: number;
  completed_minutes: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}