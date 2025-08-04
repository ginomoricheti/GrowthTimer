use serde::Serialize;

use crate::models::tasks::TaskDTO;

#[derive(Debug)]
pub struct PomodoroEntity {
  pub id: i32,
  pub minutes: i32,
  pub id_project: i32,
  pub id_goal: i32,
  pub id_task: i32,
  pub target_minutes: i32,
  pub created_at: String,
}

#[derive(Debug, Serialize)]
pub struct PomodoroDTO {
  pub date: String,
  pub minutes: i32,
  pub project: String,
  pub task: TaskDTO,
}

impl PomodoroDTO {
  pub fn from_entity(entity: PomodoroEntity, project_name: String, task: TaskDTO) -> Self {
    Self { 
      date: entity.created_at,
      minutes: entity.minutes,
      project: project_name,
      task: task,
    }
  }
}