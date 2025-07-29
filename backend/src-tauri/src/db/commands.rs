use crate::db::Database;
use tauri::State;

#[tauri::command]
pub fn insert_test_user(database: State<Database>) -> Result<(), String> {
    // Sacamos una conexión del pool
    let conn = database.get_conn();
    
    conn.execute(
        "INSERT OR IGNORE INTO users (name, email) VALUES (?1, ?2)",
        ["Usuario Test", "test@example.com"],
    ).map_err(|e| e.to_string())?;

    println!("👤 Usuario de prueba insertado");
    Ok(())
}

#[tauri::command]
pub fn list_users(database: State<Database>) -> Result<Vec<(i32, String, String)>, String> {
    let conn = database.get_conn();
    
    let mut stmt = conn.prepare("SELECT id, name, email FROM users")
        .map_err(|e| e.to_string())?;

    let users = stmt
        .query_map([], |row| {
            Ok((row.get(0)?, row.get(1)?, row.get(2)?))
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(users)
}
