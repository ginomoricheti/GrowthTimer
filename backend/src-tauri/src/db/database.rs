use r2d2::{Pool, PooledConnection};
use r2d2_sqlite::SqliteConnectionManager;
use std::sync::Arc;

pub struct Database {
    pool: Arc<Pool<SqliteConnectionManager>>,
}

impl Database {
    pub fn new(db_path: &str) -> Result<Self, Box<dyn std::error::Error>> {
        let manager = SqliteConnectionManager::file(db_path);
        let pool = Pool::new(manager)?;
        Ok(Self { pool: Arc::new(pool) })
    }

    pub fn new_in_memory() -> Result<Self, Box<dyn std::error::Error>> {
        let manager = SqliteConnectionManager::memory();
        let pool = Pool::new(manager)?;
        Ok(Self { pool: Arc::new(pool) })
    }

    pub fn get_conn(&self) -> PooledConnection<SqliteConnectionManager> {
        self.pool.get().expect("No se pudo obtener una conexión del pool")
    }

    pub fn get_pool(&self) -> Arc<Pool<SqliteConnectionManager>> {
        Arc::clone(&self.pool)
    }

    // pub fn is_connected(&self) -> bool {
    //     self.get_conn()
    //         .execute("SELECT 1", [])
    //         .is_ok()
    // }
}
