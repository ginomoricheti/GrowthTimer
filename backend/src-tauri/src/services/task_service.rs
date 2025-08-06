use crate::db::task_queries;
use crate::db::database::Database;
use crate::models::tasks::{TaskDTO};

pub fn fetch_all_tasks(db: &mut Database) -> Result<Vec<TaskDTO>, String> {
  let conn = db.get_conn();

  let entities = task_queries::get_all_tasks(conn)
    .map_err(|e| e.to_string())?;

  let dtos = entities.into_iter()
    .map(TaskDTO::from)
    .collect();

  Ok(dtos)
}