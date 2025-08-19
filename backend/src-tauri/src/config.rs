use std::path::PathBuf;
use std::fs;
use std::env;

pub fn get_db_path() -> PathBuf {
    // Ruta del ejecutable actual
    let exe_path = env::current_exe().expect("Cannot get current exe path");
    let base_dir = exe_path.parent().expect("Cannot get parent dir of exe");

    // Carpeta "data" dentro de donde está el exe
    let data_dir = base_dir.join("data");

    // Crear la carpeta si no existe
    if !data_dir.exists() {
        fs::create_dir_all(&data_dir).expect("Could not create the data directory");
    }

    // Ruta final de la base de datos
    data_dir.join("database.db")
}
