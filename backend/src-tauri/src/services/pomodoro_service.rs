use crate::db::pomodoro_queries;
use crate::db::Database;
use rusqlite::{Result, params};
use crate::models::pomodoros::{PomodoroDTO, PomodoroCreate};

pub fn fetch_all_pomodoros(db: &mut Database) -> Result<Vec<PomodoroDTO>, String> {
  let conn = db.get_conn();
  pomodoro_queries::get_all_pomodoros(conn).map_err(|e| e.to_string())
}

pub fn insert_pomodoro(db: &mut Database, pomodoro: &PomodoroCreate) -> Result<(), rusqlite::Error> {
  let conn = db.get_conn();
  conn.execute(
    "
    INSERT INTO pomodoros (minutes, id_project, id_task, id_goal)
    VALUES (?1, ?2, ?3, ?4)
    ",
    params![
      pomodoro.minutes,
      pomodoro.id_project,
      pomodoro.id_task,
      pomodoro.id_goal,
    ],
  )?;
  
  Ok(())
}

pub fn delete_pomodoro(db: &mut Database, pomodoro_id: i32 ) -> Result<(), rusqlite::Error> {
  let conn = db.get_conn();

  conn.execute(
    "DELETE FROM pomodoros WHERE id = ?1",
    params![pomodoro_id],
  )?;

  Ok(())
}