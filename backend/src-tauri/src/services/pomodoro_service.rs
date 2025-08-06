use crate::db::pomodoro_queries;
use crate::db::Database;
use crate::models::pomodoros::PomodoroDTO;

pub fn fetch_all_pomodoros(db: &mut Database) -> Result<Vec<PomodoroDTO>, String> {
  let conn = db.get_conn();
  pomodoro_queries::get_all_pomodoros(conn).map_err(|e| e.to_string())
}