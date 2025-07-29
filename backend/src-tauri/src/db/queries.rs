use sql::{SqlitePool, Result};

pub async fn insert_pomodoro(pool: &SqlitePool, id_project: i64, id_task: i64, minutes: i32) -> Result<u64>{
  let qry = "INSERT INTO pomodoros (id_project, id_task, minutes) VALUES (?, ?, ?)";
  let result = sqlx::query(qry)
    .bind(id_project)
    .bind(id_task)
    .bind(minutes)
    .execute(pool)
    .await?;
  Ok(result.rows_affected())
}