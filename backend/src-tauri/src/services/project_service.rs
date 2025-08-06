use crate::db::project_queries;
use crate::db::Database;
use crate::models::projects::ProjectDTO;

pub fn fetch_all_projects(db: &mut Database) -> Result<Vec<ProjectDTO>, String> {
  let conn = db.get_conn();
  project_queries::get_all_projects(conn).map_err(|e| e.to_string())
}