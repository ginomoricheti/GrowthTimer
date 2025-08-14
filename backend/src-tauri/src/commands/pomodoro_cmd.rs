use tauri::State;
use std::sync::{Arc, Mutex};
use crate::db::Database;
use crate::services::pomodoro_service;
use crate::models::pomodoros::{PomodoroDTO, PomodoroCreate};

#[tauri::command]
pub fn get_pomodoros(db: State<'_, Arc<Mutex<Database>>>) -> Result<Vec<PomodoroDTO>, String> {
    let mut db = db.lock().map_err(|_| "Error locking DB")?;
    pomodoro_service::fetch_all_pomodoros(&mut db)
}

#[tauri::command]
pub fn create_pomodoro(
    db: State<'_, Arc<Mutex<Database>>>,
    pomodoro: PomodoroCreate,
) -> Result<(), String> {
    let mut db = db.lock().map_err(|_| "Error locking DB")?;
    pomodoro_service::insert_pomodoro(&mut db, &pomodoro)
        .map_err(|e| format!("Failed to insert pomodoro: {}", e))?;

    Ok(())
}

#[tauri::command]
pub fn delete_pomodoro(
    db: State<'_, Arc<Mutex<Database>>>,
    pomodoro_id: i32,
) -> Result<(), String> {
    let mut db = db.lock().map_err(|_| "Error locking DB")?;
    pomodoro_service::delete_pomodoro(&mut db, pomodoro_id)
        .map_err(|e| format!("Failed to delete pomodoro: {}", e))?;

    Ok(())
}