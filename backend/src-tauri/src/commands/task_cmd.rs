use tauri::State;
use std::sync::{Arc, Mutex};
use crate::db::Database;
use crate::services::task_service;
use crate::models::tasks::TaskDTO;

#[tauri::command]
pub fn get_tasks(db: State<'_, Arc<Mutex<Database>>>) -> Result<Vec<TaskDTO>, String> {
  let mut db = db.lock().map_err(|_| "Error locking DB")?;
  task_service::fetch_all_tasks(&mut db)
}