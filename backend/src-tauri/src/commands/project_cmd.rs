use tauri::State;
use std::sync::{Arc, Mutex};
use crate::db::Database;
use crate::services::project_service;
use crate::models::projects::{ProjectDTO, ProjectCreate};

#[tauri::command]
pub fn get_projects(db: State<'_, Arc<Mutex<Database>>>) -> Result<Vec<ProjectDTO>, String> {
    let mut db = db.lock().map_err(|_| "Error locking DB")?;
    project_service::fetch_all_projects(&mut db)
}

#[tauri::command]
pub fn create_project(
    db: State<'_, Arc<Mutex<Database>>>,
    project: ProjectCreate,
) -> Result<(), String> {
    let mut db = db.lock().map_err(|_| "Error locking DB")?;
    project_service::insert_project(&mut db, &project)
        .map_err(|e| format!("Failed to insert project: {}", e))?;

    Ok(())
}

#[tauri::command]
pub fn delete_project(
    db: State<'_, Arc<Mutex<Database>>>,
    project_id: i32,
) -> Result<(), String> {
    let mut db = db.lock().map_err(|_| "Error locking DB")?;
    project_service::delete_project(&mut db, project_id)
        .map_err(|e| format!("Failed to delete project: {}", e))?;

    Ok(())
}