use serde::Serialize;

#[derive(Serialize)]
pub struct SummaryItem {
    pub total_minutes: i64,
    pub unique_tasks: i64,
}

#[derive(Serialize)]
pub struct ProjectSummaryItem {
    pub project_name: String,
    pub total_minutes: i64,
    pub unique_tasks: i64,
}

#[derive(Serialize)]
pub struct CategorySummaryItem {
    pub category_name: String,
    pub total_minutes: i64,
    pub unique_tasks: i64,
}

#[derive(Serialize)]
pub struct TaskSummaryItem {
    pub task_name: String,
    pub total_minutes: i64,
    pub unique_tasks: i64,
}

#[derive(Serialize)]
pub struct SummaryReport {
    pub por_proyecto: Vec<ProjectSummaryItem>,
    pub por_categoria: Vec<CategorySummaryItem>,
    pub por_tarea: Vec<TaskSummaryItem>,
}
