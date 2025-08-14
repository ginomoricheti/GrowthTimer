use crate::db::project_queries;
use crate::db::Database;
use rusqlite::{Result, params};
use crate::models::projects::{ProjectDTO, ProjectCreate};

pub fn fetch_all_projects(db: &mut Database) -> Result<Vec<ProjectDTO>, String> {
  let conn = db.get_conn();
  project_queries::get_all_projects(conn).map_err(|e| e.to_string())
}

pub fn insert_project(db: &mut Database, project: &ProjectCreate) -> Result<(), rusqlite::Error> {
  let conn = db.get_conn();
  
  conn.execute(
    "
    INSERT INTO projects (name, id_category, color)
    VALUES (?1, ?2, ?3)
    ",
    params![
      project.name,
      project.id_category,
      project.color,
    ],
  )?;
  
  Ok(())
}

pub fn delete_project(db: &mut Database, project_id: i32 ) -> Result<(), rusqlite::Error> {
  let conn = db.get_conn();

  conn.execute(
    "DELETE FROM projects WHERE id = ?1",
    params![project_id],
  )?;

  Ok(())
}