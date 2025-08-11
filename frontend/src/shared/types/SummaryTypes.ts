
export interface SummaryItem {
  total_minutes: number;
  unique_tasks: number;
}

export interface ProjectSummaryItemGet extends SummaryItem {
  project_name: string;
}

export interface CategorySummaryItemGet extends SummaryItem {
  category_name: string;
}

export interface TaskSummaryItemGet extends SummaryItem {
  task_name: string;
}

export interface ReportGet {
  por_proyecto: ProjectSummaryItemGet[];
  por_categoria: CategorySummaryItemGet[];
  por_tarea: TaskSummaryItemGet[];
}
