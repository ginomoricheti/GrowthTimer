use crate::db::Database;
use crate::db::queries;
use crate::models::categories::Category;
use crate::models::projects::Project;
use crate::models::tasks::Task;
use tauri::State;
use std::sync::Arc;
use rusqlite;

/// Listar todas las categorías
#[tauri::command]
pub fn list_categories(db: State<'_, Arc<Database>>) -> Result<Vec<Category>, String> {
    queries::get_all_categories(&db.get_pool())
        .map_err(|e| e.to_string())
}

/// Listar todas las tareas
#[tauri::command]
pub fn list_tasks(db: State<'_, Arc<Database>>) -> Result<Vec<Task>, String> {
    queries::get_all_tasks(&db.get_pool())
        .map_err(|e| e.to_string())
}

/// Listar todos los proyectos con información completa
#[tauri::command]
pub fn list_projects_complete(db: State<'_, Arc<Database>>) -> Result<Vec<Project>, String> {
    queries::get_all_projects_complete(&db.get_pool())
        .map_err(|e| e.to_string())
}

/// Obtener un proyecto específico por ID
#[tauri::command]
pub fn get_project_by_id(db: State<'_, Arc<Database>>, project_id: i32) -> Result<Option<Project>, String> {
    queries::get_project_by_id(&db.get_pool(), project_id)
        .map_err(|e| e.to_string())
}

// Si aún necesitas las funciones de insertar datos de prueba, puedes agregar:

/// Insertar datos de prueba (solo para desarrollo)
#[tauri::command]
pub fn insert_test_data(db: State<'_, Arc<Database>>) -> Result<String, String> {
    // Esto usaría tu función create_schema que ya inserta datos predefinidos
    crate::db::schema::create_schema(&db.get_pool())
        .map_err(|e| e.to_string())?;
    Ok("Datos de prueba insertados con éxito".to_string())
}

// Comandos adicionales que podrías necesitar:

/// Crear una nueva categoría
#[tauri::command]
pub fn create_category(
    db: State<'_, Arc<Database>>, 
    name: String, 
    color: String
) -> Result<String, String> {
    let conn = db.get_conn();
    conn.execute(
        "INSERT INTO categories (name, color) VALUES (?1, ?2)",
        [&name, &color],
    ).map_err(|e| e.to_string())?;
    Ok("Categoría creada con éxito".to_string())
}

/// Crear un nuevo proyecto
#[tauri::command]
pub fn create_project(
    db: State<'_, Arc<Database>>, 
    name: String, 
    id_category: i32,
    color: Option<String>
) -> Result<String, String> {
    let conn = db.get_conn();
    conn.execute(
        "INSERT INTO projects (name, id_category, color) VALUES (?1, ?2, ?3)",
        rusqlite::params![&name, &id_category, &color],
    ).map_err(|e| e.to_string())?;
    Ok("Proyecto creado con éxito".to_string())
}

/// Crear una nueva meta
#[tauri::command]
pub fn create_goal(
    db: State<'_, Arc<Database>>, 
    name: String, 
    id_project: i32
) -> Result<String, String> {
    let conn = db.get_conn();
    conn.execute(
        "INSERT INTO goals (name, id_project) VALUES (?1, ?2)",
        [&name, &id_project.to_string()],
    ).map_err(|e| e.to_string())?;
    Ok("Meta creada con éxito".to_string())
}

/// Crear una nueva tarea
#[tauri::command]
pub fn create_task(
    db: State<'_, Arc<Database>>, 
    name: String
) -> Result<String, String> {
    let conn = db.get_conn();
    conn.execute(
        "INSERT INTO tasks (name) VALUES (?1)",
        [&name],
    ).map_err(|e| e.to_string())?;
    Ok("Tarea creada con éxito".to_string())
}

/// Crear un nuevo pomodoro
#[tauri::command]
pub fn create_pomodoro(
    db: State<'_, Arc<Database>>,
    minutes: Option<i32>,
    id_project: i32,
    id_goal: Option<i32>,
    id_task: i32
) -> Result<String, String> {
    let minutes = minutes.unwrap_or(25); // Default 25 minutos
    let conn = db.get_conn();
    conn.execute(
        "INSERT INTO pomodoros (minutes, id_project, id_goal, id_task) VALUES (?1, ?2, ?3, ?4)",
        rusqlite::params![&minutes, &id_project, &id_goal, &id_task],
    ).map_err(|e| e.to_string())?;
    Ok("Pomodoro creado con éxito".to_string())
}