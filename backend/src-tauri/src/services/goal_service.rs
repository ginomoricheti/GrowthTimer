use crate::db::Database;
use crate::models::goals::GoalCreate;
use rusqlite::{Result, params};

pub fn insert_goal(db: &mut Database, goal: &GoalCreate) -> Result<(), rusqlite::Error> {
    let conn = db.get_conn();

    conn.execute(
        "
        INSERT INTO goals (title, id_project, target_minutes)
        VALUES (?1, ?2, ?3)
        ",
        params![
          goal.title,
          goal.id_project,
          goal.target_minutes,
        ],
    )?;

  Ok(())
}

pub fn delete_goal(db: &mut Database, goal_id: i32) -> Result<(), rusqlite::Error> {
  let conn = db.get_conn();

  conn.execute(
    "DELETE FROM goals WHERE id = ?1",
    params![goal_id],
  )?;

  Ok(())
}