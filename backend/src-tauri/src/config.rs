use directories::ProjectDirs;
use std::fs;

pub struct Config {
    pub db_url: String,
}

impl Config {
    pub fn new() -> Self {
        let proj_dirs = ProjectDirs::from("com", "TuOrg", "TuApp")
            .expect("No se pudo obtener directorios de aplicación");
        let db_dir = proj_dirs.data_dir();
        fs::create_dir_all(db_dir).expect("No se pudo crear carpeta de datos");

        let db_path = db_dir.join("growth_timer.db");
        let db_url = format!("sqlite://{}", db_path.display());

        Self { db_url }
    }
}
