#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod config;
mod db;
mod commands;
mod services;
mod models;

use config::get_db_path;
use db::Database;
use db::schema::create_schema;
use db::triggers::create_triggers;
use tauri::Manager;
use std::sync::{Arc, Mutex};

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            println!("Running app...");

            // 1. Ruta de la base de datos
            let db_path = get_db_path();
            println!("DB Route: {}", db_path.display());

            // 2. Conectar base de datos
            let db_path_str = db_path.to_string_lossy();
            let mut database = Database::new(&db_path_str)
                .unwrap_or_else(|e| {
                    eprintln!("Error connecting to the database: {}", e);
                    Database::new_in_memory().expect("It couldn't even be done in memory.")
                });

            // 3. Crear esquema y triggers (se necesita conexión mutable)
            {
                let conn = database.get_conn();
                if let Err(e) = create_schema(&conn) {
                    eprintln!("Error creating schema: {}", e);
                    std::process::exit(1);
                }

                if let Err(e) = create_triggers(&conn) {
                    eprintln!("Error creating triggers: {}", e);
                    std::process::exit(1);
                }
            }

            // 4. Compartir la conexión entre los comandos (Arc<Mutex<...>>)
            let database = Arc::new(Mutex::new(database));
            app.manage(database);

            Ok(())
        })

        .run(tauri::generate_context!())
        .expect("Error running the app");
}
