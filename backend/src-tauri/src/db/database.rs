use rusqlite::{Connection, Result};

pub struct Database {
    conn: Connection,
}

impl Database {
    /// Open DB
    pub fn new(db_path: &str) -> Result<Self> {
        let conn = Connection::open(db_path)?;
        Ok(Self { conn })
    }

    /// DB in Memory (for testing)
    pub fn new_in_memory() -> Result<Self> {
        let conn = Connection::open_in_memory()?;
        Ok(Self { conn })
    }

    /// Return a mutable reference to the conexion
    pub fn get_conn(&mut self) -> &mut Connection {
        &mut self.conn
    }

    /// Check if the DB is on
    pub fn is_connected(&mut self) -> bool {
        self.conn.execute("SELECT 1", []).is_ok()
    }
}
