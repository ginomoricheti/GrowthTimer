use r2d2::{Pool, PooledConnection};
use r2d2_sqlite::SqliteConnectionManager;
use std::path::{Path, PathBuf};
use std::fs;
use std::sync::Arc;

pub mod commands;
pub mod queries;

pub struct Database {
    pool: Arc<Pool<SqliteConnectionManager>>,
}

impl Database {
    pub fn new(db_path: &str) -> Result<Self, Box<dyn std::error::Error>> {
        // Crear directorio si no existe
        if let Some(parent) = Path::new(db_path).parent() {
            if !parent.exists() {
                fs::create_dir_all(parent)?;
            }
        }

        let manager = SqliteConnectionManager::file(db_path);
        let pool = Pool::new(manager)?;

        Ok(Database {
            pool: Arc::new(pool),
        })
    }

    pub fn new_in_memory() -> Result<Self, Box<dyn std::error::Error>> {
        let manager = SqliteConnectionManager::memory();
        let pool = Pool::new(manager)?;

        Ok(Database {
            pool: Arc::new(pool),
        })
    }

    pub fn get_conn(&self) -> PooledConnection<SqliteConnectionManager> {
        self.pool.get().expect("No se pudo obtener una conexión del pool")
    }

    pub fn is_connected(&self) -> bool {
        self.get_conn()
            .execute("SELECT 1", [])
            .is_ok()
    }

    pub fn initialize_tables(&self) -> Result<(), Box<dyn std::error::Error>> {
        let conn = self.get_conn();
        conn.execute_batch("
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        ")?;
        Ok(())
    }
}

pub fn get_db_path() -> PathBuf {
    let base_dir = std::env::current_dir().expect("No se pudo obtener el directorio actual");

    let data_dir = if base_dir.ends_with("src-tauri") {
        base_dir.join("data")
    } else {
        base_dir.join("src-tauri").join("data")
    };

    if !data_dir.exists() {
        std::fs::create_dir_all(&data_dir).expect("No se pudo crear el directorio data");
    }

    data_dir.join("database.db")
}
