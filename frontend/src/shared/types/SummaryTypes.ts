
export interface SummaryItem {
  totalMinutes: number;
  uniqueTasks: number;
}

export interface ProjectSummaryItemGet extends SummaryItem {
  projectName: string;
}

export interface CategorySummaryItemGet extends SummaryItem {
  categoryName: string;
}

export interface TaskSummaryItemGet extends SummaryItem {
  taskName: string;
}

export interface ReportGet {
  byProject: ProjectSummaryItemGet[];
  byCategory: CategorySummaryItemGet[];
  byTask: TaskSummaryItemGet[];
}
