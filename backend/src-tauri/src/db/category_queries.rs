use rusqlite::{Connection, Result};
use crate::models::categories::CategoryEntity;

pub fn get_all_categories(conn: &Connection) -> Result<Vec<CategoryEntity>> {
  let mut stmt = conn.prepare(
      "
      SELECT id,
            name,
            total_time_minutes,
            color,
            created_at
      FROM categories
      "
  )?;

  let categories = stmt.query_map([], |row| {
    Ok(CategoryEntity {
      id: row.get(0)?,
      name: row.get(1)?,
      total_time_minutes: row.get(2)?,
      color: row.get(3)?,
      created_at: row.get(4)?,
    })
  })?
  .collect::<Result<Vec<_>, _>>()?;

  Ok(categories)
}