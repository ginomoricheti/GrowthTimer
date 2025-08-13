use serde::Serialize;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SummaryItem {
    pub total_minutes: i64,
    pub unique_tasks: i64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ProjectSummaryItem {
    pub project_name: String,
    pub total_minutes: i64,
    pub unique_tasks: i64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CategorySummaryItem {
    pub category_name: String,
    pub total_minutes: i64,
    pub unique_tasks: i64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TaskSummaryItem {
    pub task_name: String,
    pub total_minutes: i64,
    pub unique_tasks: i64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SummaryReport {
    pub by_project: Vec<ProjectSummaryItem>,
    pub by_category: Vec<CategorySummaryItem>,
    pub by_task: Vec<TaskSummaryItem>,
}
