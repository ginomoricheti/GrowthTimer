use crate::db::database::Database;
use crate::models::summary::{ProjectSummaryItem, CategorySummaryItem, TaskSummaryItem, SummaryReport};
use rusqlite::Connection;

pub fn generate_summary_report(db: &mut Database) -> Result<SummaryReport, Box<dyn std::error::Error>> {
    let conn = db.get_conn();

    let by_project = fetch_summary_by_project(conn)?;
    let by_category = fetch_summary_by_category(conn)?;
    let by_task = fetch_summary_by_task(conn)?;

    Ok(SummaryReport {
        by_project,
        by_category,
        by_task,
    })
}

pub fn fetch_summary_by_project(conn: &Connection) -> Result<Vec<ProjectSummaryItem>, rusqlite::Error> {
    let mut stmt = conn.prepare(
        r#"
        SELECT
            IFNULL(pr.name, 'Sin proyecto') AS project_name,
            IFNULL(SUM(p.minutes), 0) AS total_minutes,
            IFNULL(COUNT(DISTINCT p.id_task), 0) AS unique_tasks
        FROM pomodoros p
        LEFT JOIN projects pr ON p.id_project = pr.id
        GROUP BY project_name
        ORDER BY total_minutes DESC
        "#
    )?;

    let items = stmt.query_map([], |row| {
        Ok(ProjectSummaryItem {
            project_name: row.get(0)?,
            total_minutes: row.get(1)?,
            unique_tasks: row.get(2)?,
        })
    })?
    .collect::<Result<Vec<_>, _>>()?;

    Ok(items)
}

pub fn fetch_summary_by_category(conn: &Connection) -> Result<Vec<CategorySummaryItem>, rusqlite::Error> {
    let mut stmt = conn.prepare(
        r#"
        SELECT
            IFNULL(c.name, 'Sin categoría') AS category_name,
            IFNULL(SUM(p.minutes), 0) AS total_minutes,
            IFNULL(COUNT(DISTINCT p.id_task), 0) AS unique_tasks
        FROM pomodoros p
        LEFT JOIN projects pr ON p.id_project = pr.id
        LEFT JOIN categories c ON pr.id_category = c.id
        GROUP BY category_name
        ORDER BY total_minutes DESC
        "#
    )?;

    let items = stmt.query_map([], |row| {
        Ok(CategorySummaryItem {
            category_name: row.get(0)?,
            total_minutes: row.get(1)?,
            unique_tasks: row.get(2)?,
        })
    })?
    .collect::<Result<Vec<_>, _>>()?;

    Ok(items)
}

fn fetch_summary_by_task(conn: &Connection) -> Result<Vec<TaskSummaryItem>, rusqlite::Error> {
    let mut stmt = conn.prepare(
        "
        SELECT
            t.name AS task_name,
            SUM(p.minutes) AS total_minutes,
            COUNT(DISTINCT p.id_project) AS unique_projects
        FROM pomodoros p
        JOIN tasks t ON p.id_task = t.id
        GROUP BY t.name
        ORDER BY total_minutes DESC
        "
    )?;

    let items = stmt.query_map([], |row| {
        Ok(TaskSummaryItem {
            task_name: row.get(0)?,
            total_minutes: row.get(1)?,
            unique_tasks: row.get(2)?, // Aquí cuenta proyectos distintos como tareas únicas para el ejemplo
        })
    })?
    .collect::<Result<Vec<_>, _>>()?;

    Ok(items)
}
