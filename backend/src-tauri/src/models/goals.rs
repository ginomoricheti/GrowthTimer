use serde::Serialize;

#[derive(Debug)]
pub struct GoalEntity {
  pub id: i32,
  pub title: String,
  pub id_project: i32,
  pub target_minutes: i32,
  pub completed_minutes: i32,
  pub is_completed: bool,
  pub total_time_minutes: i32,
  pub created_at: String,
  pub updated_at: String,
}

#[derive(Debug, Serialize)]
pub struct GoalDTO {
  pub id: i32,
  pub title: String,
  pub target_minutes: i32,
  pub completed_minutes: i32,
  pub is_completed: bool,
  pub created_at: String,
  pub updated_at: String,
}

impl From<GoalEntity> for GoalDTO {
  fn from(entity: GoalEntity) -> Self {
    Self { 
      id: entity.id,
      title: entity.title,
      target_minutes: entity.target_minutes,
      completed_minutes: entity.completed_minutes,
      is_completed: entity.is_completed,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    }
  }
}