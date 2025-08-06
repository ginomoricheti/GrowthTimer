use serde::Serialize;

#[derive(Debug)]
pub struct TaskEntity {
  pub id: i32,
  pub name: String,
  pub total_time_minutes: i32,
  pub color: String,
  pub created_at: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TaskDTO {
  pub name: String,
  pub total_time_minutes: i32,
  pub color: String,
}

impl From<TaskEntity> for TaskDTO {
  fn from(entity: TaskEntity) -> Self {
    Self { 
      name: entity.name,
      total_time_minutes: entity.total_time_minutes,
      color: entity.color
    }
  }
}