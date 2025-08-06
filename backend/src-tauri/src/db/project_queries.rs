use rusqlite::{Connection, Result};
use crate::models::{
    projects::ProjectDTO,
    goals::{GoalEntity, GoalDTO},
    pomodoros::{PomodoroEntity, PomodoroDTO},
    tasks::TaskDTO,
};

pub fn get_all_projects(conn: &Connection) -> Result<Vec<ProjectDTO>> {
    let mut stmt = conn.prepare(
        "
        SELECT 
            pr.id,
            pr.name,
            pr.color,
            pr.total_time_minutes,
            pr.created_at,
            pr.updated_at,
            c.name as category_name
        FROM projects pr
        JOIN categories c ON pr.id_category = c.id
        "
    )?;

    let projects = stmt.query_map([], |row| {
        // Get project's goals
        let mut goals_stmt = conn.prepare(
            "
            SELECT 
                g.id, g.title, g.target_minutes, g.completed_minutes, 
                g.is_completed, g.created_at, g.updated_at
            FROM goals g
            WHERE g.id_project = ?
            "
        )?;
        let goals = goals_stmt.query_map([row.get::<_, i32>(0)?], |g_row| {
            let entity = GoalEntity {
                id: g_row.get(0)?,
                title: g_row.get(1)?,
                id_project: row.get(0)?,
                target_minutes: g_row.get(2)?,
                completed_minutes: g_row.get(3)?,
                is_completed: g_row.get(4)?,
                created_at: g_row.get(5)?,
                updated_at: g_row.get(6)?,
            };
            Ok(entity.into()) // ahora usamos From<GoalEntity>
        })?.collect::<Result<Vec<_>, _>>()?;

        // Get project's pomodoros
        let mut pomo_stmt = conn.prepare(
            "
            SELECT 
                p.id, p.minutes, p.created_at,
                t.id, t.name, t.color, t.total_time_minutes
            FROM pomodoros p
            JOIN tasks t ON p.id_task = t.id
            WHERE p.id_project = ?
            "
        )?;
        let pomodoros = pomo_stmt.query_map([row.get::<_, i32>(0)?], |p_row| {
            let entity = PomodoroEntity {
                id: p_row.get(0)?,
                minutes: p_row.get(1)?,
                id_project: row.get(0)?,
                id_goal: 0, // si puede ser NULL, hacelo Option<i32>
                id_task: p_row.get(3)?,
                created_at: p_row.get(2)?,
            };

            let task = TaskDTO {
                name: p_row.get(4)?,
                color: p_row.get(5)?,
                total_time_minutes: p_row.get(6)?,
            };

            Ok(PomodoroDTO::from_entity(entity, row.get(1)?, task))
        })?.collect::<Result<Vec<_>, _>>()?;

        Ok(ProjectDTO {
            id: row.get(0)?,
            name: row.get(1)?,
            color: row.get(2)?,
            total_time_minutes: row.get(3)?,
            created_at: row.get(4)?,
            updated_at: row.get(5)?,
            category_name: row.get(6)?,
            goals,
            pomodoro_records: pomodoros,
        })
    })?.collect::<Result<Vec<_>, _>>()?;

    Ok(projects)
}
