use serde::Serialize;

#[derive(Debug)]
pub struct CategoryEntity {
  pub id: i32,
  pub name: String,
  pub total_time_minutes: i32,
  pub color: String,
  pub created_at: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CategoryDTO {
  pub id: i32,
  pub name: String,
  pub color: String,
  pub total_time_minutes: i32,
}

impl From<CategoryEntity> for CategoryDTO {
  fn from(entity: CategoryEntity) -> Self {
    Self { 
      id: entity.id,
      name: entity.name,
      total_time_minutes: entity.total_time_minutes,
      color: entity.color
    }
  }
}