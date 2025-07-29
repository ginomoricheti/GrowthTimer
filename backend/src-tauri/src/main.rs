#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod db;

use db::{Database, get_db_path};
use crate::db::commands::{insert_test_user, list_users};
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            println!("🚀 Iniciando aplicación...");

            // 1. Preparar la ruta de la base de datos
            let db_path = get_db_path();
            println!("📍 Ruta de la base de datos: {}", db_path.display());

            // 2. Conectar a la base de datos
            let db_path_str = db_path.to_string_lossy();
            let database = Database::new(&db_path_str)
                .unwrap_or_else(|e| {
                    eprintln!("❌ Error al conectar con la base de datos: {}", e);
                    Database::new_in_memory().expect("No se pudo ni en memoria")
                });

            // 3. Inicializar tablas
            if let Err(e) = database.initialize_tables() {
                eprintln!("❌ Error al inicializar tablas: {}", e);
                std::process::exit(1);
            }

            // 4. Guardar la conexión para usarla desde comandos
            app.manage(database);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            insert_test_user,
            list_users
        ])
        .run(tauri::generate_context!())
        .expect("Error al ejecutar la app");
}
