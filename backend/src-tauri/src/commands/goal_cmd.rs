use tauri::State;
use std::sync::{Arc, Mutex};
use crate::db::Database;
use crate::services::goal_service;
use crate::models::goals::GoalCreate;

#[tauri::command]
pub fn create_goal(
    db: State<'_, Arc<Mutex<Database>>>,
    goal: GoalCreate,
) -> Result<(), String> {
    let mut db = db.lock().map_err(|_| "Error locking DB")?;
    goal_service::insert_goal(&mut db, &goal)
        .map_err(|e| format!("Failed to insert goal: {}", e))?;

    Ok(())
}