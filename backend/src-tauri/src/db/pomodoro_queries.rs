use rusqlite::{Connection, Result};
use crate::models::pomodoros::{PomodoroEntity, PomodoroDTO};
use crate::models::tasks::TaskDTO;

pub fn get_all_pomodoros(conn: &Connection) -> Result<Vec<PomodoroDTO>> {
    let mut stmt = conn.prepare(
        "
        SELECT p.id,
               p.minutes,
               p.created_at,
               pr.name as project_name,
               t.id,
               t.name,
               t.color,
               t.total_time_minutes
        FROM pomodoros p
        JOIN projects pr ON p.id_project = pr.id
        JOIN tasks t ON p.id_task = t.id
        "
    )?;

    let pomodoros = stmt.query_map([], |row| {
        let entity = PomodoroEntity {
            id: row.get(0)?,
            minutes: row.get(1)?,
            id_project: 0,
            id_goal: 0,
            id_task: row.get(4)?,
            created_at: row.get(2)?,
        };

        let task = TaskDTO {
            name: row.get(5)?,
            color: row.get(6)?,
            total_time_minutes: row.get(7)?,
        };

        Ok(PomodoroDTO::from_entity(entity, row.get(3)?, task))
    })?
    .collect::<Result<Vec<_>, _>>()?;

    Ok(pomodoros)
}
