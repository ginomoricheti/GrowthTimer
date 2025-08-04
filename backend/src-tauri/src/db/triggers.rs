use rusqlite::{Connection, Result};

pub fn create_triggers(conn: &Connection) -> Result<()> {
    let qry = r#"
        -- ============================================
        -- TRIGGERS para mantener consistencia en pomodoros
        -- ============================================

        -- Trigger al insertar un pomodoro
        CREATE TRIGGER IF NOT EXISTS update_project_time_on_pomodoro_insert
        AFTER INSERT ON pomodoros
        BEGIN
            UPDATE projects 
            SET total_time_minutes = total_time_minutes + NEW.minutes,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = NEW.id_project;

            UPDATE categories 
            SET total_time_minutes = total_time_minutes + NEW.minutes
            WHERE id = (SELECT id_category FROM projects WHERE id = NEW.id_project);

            UPDATE tasks 
            SET total_time_minutes = total_time_minutes + NEW.minutes
            WHERE id = NEW.id_task;

            UPDATE goals 
            SET completed_minutes = completed_minutes + NEW.minutes,
                updated_at = CURRENT_TIMESTAMP,
                is_completed = CASE 
                    WHEN completed_minutes + NEW.minutes >= target_minutes THEN TRUE 
                    ELSE FALSE 
                END
            WHERE id = NEW.id_goal;
        END;

        -- Trigger al eliminar un pomodoro
        CREATE TRIGGER IF NOT EXISTS update_project_time_on_pomodoro_delete
        AFTER DELETE ON pomodoros
        BEGIN
            UPDATE projects 
            SET total_time_minutes = total_time_minutes - OLD.minutes,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = OLD.id_project;

            UPDATE categories 
            SET total_time_minutes = total_time_minutes - OLD.minutes
            WHERE id = (SELECT id_category FROM projects WHERE id = OLD.id_project);

            UPDATE tasks 
            SET total_time_minutes = total_time_minutes - OLD.minutes
            WHERE id = OLD.id_task;

            UPDATE goals 
            SET completed_minutes = completed_minutes - OLD.minutes,
                updated_at = CURRENT_TIMESTAMP,
                is_completed = CASE 
                    WHEN completed_minutes - OLD.minutes >= target_minutes THEN TRUE 
                    ELSE FALSE 
                END
            WHERE id = OLD.id_goal;
        END;
    "#;

    conn.execute_batch(qry)?;
    Ok(())
}
