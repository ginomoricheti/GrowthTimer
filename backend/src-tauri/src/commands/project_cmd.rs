use tauri::State;
use std::sync::{Arc, Mutex};
use crate::db::Database;
use crate::services::project_service;
use crate::models::projects::ProjectDTO;

#[tauri::command]
pub fn get_projects(db: State<'_, Arc<Mutex<Database>>>) -> Result<Vec<ProjectDTO>, String> {
  let mut db = db.lock().map_err(|_| "Error locking DB")?;
  project_service::fetch_all_projects(&mut db)
}