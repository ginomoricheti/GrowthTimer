use tauri::State;
use std::sync::{Arc, Mutex};
use crate::db::Database;
use crate::services::category_service;
use crate::models::categories::CategoryDTO;

#[tauri::command]
pub fn get_categories(db: State<'_, Arc<Mutex<Database>>>) -> Result<Vec<CategoryDTO>, String> {
  let mut db = db.lock().map_err(|_| "Error locking DB")?;
  category_service::fetch_all_categories(&mut db)
}