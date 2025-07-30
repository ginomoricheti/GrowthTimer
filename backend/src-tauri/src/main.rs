#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod config;
mod db;
mod commands;
mod services;
mod models;

use config::get_db_path;
use db::Database;
use commands::commands::{
    list_categories,
    list_tasks,
    list_projects_complete,
    get_project_by_id,
    insert_test_data,
    create_category,
    create_project,
    create_goal,
    create_task,
    create_pomodoro,
};
use db::schema::create_schema;
use db::triggers::create_triggers;
use tauri::Manager;
use std::sync::Arc;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            println!("Running app...");

            // 1. Ruta de la base de datos
            let db_path = get_db_path();
            println!("DB Route: {}", db_path.display());

            // 2. Conectar base de datos
            let db_path_str = db_path.to_string_lossy();
            let database = Arc::new(
                Database::new(&db_path_str).unwrap_or_else(|e| {
                    eprintln!("Error connecting to the database: {}", e);
                    Database::new_in_memory().expect("It couldn't even be done in memory.")
                })
            );

            // 3. Crear esquema y datos iniciales
            if let Err(e) = create_schema(&database.get_pool()) {
                eprintln!("Error creating schema: {}", e);
                std::process::exit(1);
            }

            if let Err(e) = create_triggers(&database.get_pool()) {
                eprintln!("Error creating triggers: {}", e);
                std::process::exit(1);
            }

            // 4. Guardar la conexión en el estado de Tauri
            app.manage(database);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            list_categories,
            list_tasks,
            list_projects_complete,
            get_project_by_id,
            insert_test_data,
            create_category,
            create_project,
            create_goal,
            create_task,
            create_pomodoro,
        ])
        .run(tauri::generate_context!())
        .expect("Error running the app");
}
