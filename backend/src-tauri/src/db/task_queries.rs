use rusqlite::{Connection, Result};
use crate::models::tasks::TaskEntity;

pub fn get_all_tasks(conn: &Connection) -> Result<Vec<TaskEntity>> {
  let mut stmt = conn.prepare(
    "
    SELECT id,
          name,
          total_time_minutes,
          color,
          created_at
    FROM tasks
    "
  )?;

  let tasks = stmt.query_map([], |row| {
    Ok(TaskEntity {
      id: row.get(0)?,
      name: row.get(1)?,
      total_time_minutes: row.get(2)?,
      color: row.get(3)?,
      created_at: row.get(4)?,
    })
  })?
  .collect::<Result<Vec<_>, _>>()?;

  Ok(tasks)
}