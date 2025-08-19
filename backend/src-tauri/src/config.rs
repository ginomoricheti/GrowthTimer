use std::path::PathBuf;
use std::fs;

pub fn get_db_path() -> PathBuf {
    // Base folder
    let base_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR")).parent().expect("Cannot get parent dir").to_path_buf();

    // "data" folder inside the backend (one level up)
    let data_dir = base_dir.join("data");

    // Create if not exist
    if !data_dir.exists() {
        fs::create_dir_all(&data_dir).expect("Could not create the data directory");
    }

    // Full path
    data_dir.join("database.db")
}