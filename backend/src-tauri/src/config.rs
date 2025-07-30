use std::path::PathBuf;
use std::fs;

pub fn get_db_path() -> PathBuf {
    let base_dir = std::env::current_dir().expect("No se pudo obtener el directorio actual");

    let data_dir = if base_dir.ends_with("src-tauri") {
        base_dir.join("data")
    } else {
        base_dir.join("src-tauri").join("data")
    };

    if !data_dir.exists() {
        fs::create_dir_all(&data_dir).expect("No se pudo crear el directorio data");
    }

    data_dir.join("database.db")
}
