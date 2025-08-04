use serde::Serialize;

use crate::models::{
  categories::CategoryDTO,
  goals::GoalDTO,
  pomodoros::PomodoroDTO
};

#[derive(Debug)]
pub struct ProjectEntity {
    pub id: i32,
    pub name: String,
    pub id_category: i32,
    pub total_time_minutes: i32,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize)]
pub struct ProjectDTO {
    pub id: i32,
    pub name: String,
    pub category: CategoryDTO,
    pub goals: Vec<GoalDTO>,
    pub pomodoro_records: Vec<PomodoroDTO>,
    pub total_time_minutes: i32,
    pub created_at: String,
    pub updated_at: String,
    pub color: Option<String>,
}

impl From<(ProjectEntity, CategoryDTO, Vec<GoalDTO>, Vec<PomodoroDTO>)> for ProjectDTO {
    fn from(data: (ProjectEntity, CategoryDTO, Vec<GoalDTO>, Vec<PomodoroDTO>)) -> Self {
        let (entity, category, goals, pomodoros) = data;
        Self {
            id: entity.id,
            name: entity.name,
            category,
            goals,
            pomodoro_records: pomodoros,
            total_time_minutes: entity.total_time_minutes,
            created_at: entity.created_at,
            updated_at: entity.updated_at,
            color: None,
        }
    }
}
