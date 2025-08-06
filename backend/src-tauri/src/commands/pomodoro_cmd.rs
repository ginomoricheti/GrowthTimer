use tauri::State;
use std::sync::{Arc, Mutex};
use crate::db::Database;
use crate::services::pomodoro_service;
use crate::models::pomodoros::PomodoroDTO;

#[tauri::command]
pub fn get_pomodoros(db: State<'_, Arc<Mutex<Database>>>) -> Result<Vec<PomodoroDTO>, String> {
    let mut db = db.lock().map_err(|_| "Error locking DB")?;
    pomodoro_service::fetch_all_pomodoros(&mut db)
}
