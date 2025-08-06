use crate::db::category_queries;
use crate::db::database::Database;
use crate::models::categories::{CategoryDTO};

pub fn fetch_all_categories(db: &mut Database) -> Result<Vec<CategoryDTO>, String> {
  let conn = db.get_conn();

  let entities = category_queries::get_all_categories(conn)
    .map_err(|e| e.to_string())?;

  let dtos = entities.into_iter()
    .map(CategoryDTO::from)
    .collect();

  Ok(dtos)
}