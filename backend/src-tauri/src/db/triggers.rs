use r2d2_sqlite::SqliteConnectionManager;
use r2d2::Pool;
use std::error::Error;

pub fn create_triggers(pool: &Pool<SqliteConnectionManager>) -> Result<(), Box<dyn Error>> {
    let conn = pool.get()?;

    let qry = r#"
    CREATE TRIGGER IF NOT EXISTS after_insert_pomodoro
    AFTER INSERT ON pomodoros
    BEGIN
        -- Projects
        UPDATE projects
        SET total_time_minutes = IFNULL((
            SELECT SUM(minutes) FROM pomodoros WHERE id_project = NEW.id_project
        ), 0)
        WHERE id = NEW.id_project;

        -- Tasks
        UPDATE tasks
        SET total_time_minutes = IFNULL((
            SELECT SUM(minutes) FROM pomodoros WHERE id_task = NEW.id_task
        ), 0)
        WHERE id = NEW.id_task;

        -- Goals
        UPDATE goals
        SET total_time_minutes = IFNULL((
            SELECT SUM(minutes) FROM pomodoros WHERE id_goal = NEW.id_goal
        ), 0)
        WHERE id = NEW.id_goal;

        -- Categories
        UPDATE categories
        SET total_time_minutes = IFNULL((
            SELECT SUM(po.minutes)
            FROM pomodoros po
            JOIN projects pr ON po.id_project = pr.id
            WHERE pr.id_category = (
                SELECT id_category FROM projects WHERE id = NEW.id_project
            )
        ), 0)
        WHERE id = (
            SELECT id_category FROM projects WHERE id = NEW.id_project
        );
    END;

    CREATE TRIGGER IF NOT EXISTS after_delete_pomodoro
    AFTER DELETE ON pomodoros
    BEGIN
        UPDATE projects
        SET total_time_minutes = IFNULL((
            SELECT SUM(minutes) FROM pomodoros WHERE id_project = OLD.id_project
        ), 0)
        WHERE id = OLD.id_project;

        UPDATE tasks
        SET total_time_minutes = IFNULL((
            SELECT SUM(minutes) FROM pomodoros WHERE id_task = OLD.id_task
        ), 0)
        WHERE id = OLD.id_task;

        UPDATE goals
        SET total_time_minutes = IFNULL((
            SELECT SUM(minutes) FROM pomodoros WHERE id_goal = OLD.id_goal
        ), 0)
        WHERE id = OLD.id_goal;

        UPDATE categories
        SET total_time_minutes = IFNULL((
            SELECT SUM(po.minutes)
            FROM pomodoros po
            JOIN projects pr ON po.id_project = pr.id
            WHERE pr.id_category = (
                SELECT id_category FROM projects WHERE id = OLD.id_project
            )
        ), 0)
        WHERE id = (
            SELECT id_category FROM projects WHERE id = OLD.id_project
        );
    END;

    CREATE TRIGGER IF NOT EXISTS after_update_pomodoro
    AFTER UPDATE ON pomodoros
    BEGIN
        -- Projects
        UPDATE projects
        SET total_time_minutes = IFNULL((
            SELECT SUM(minutes) FROM pomodoros WHERE id_project = NEW.id_project
        ), 0)
        WHERE id = NEW.id_project;

        UPDATE projects
        SET total_time_minutes = IFNULL((
            SELECT SUM(minutes) FROM pomodoros WHERE id_project = OLD.id_project
        ), 0)
        WHERE id = OLD.id_project;

        -- Tasks
        UPDATE tasks
        SET total_time_minutes = IFNULL((
            SELECT SUM(minutes) FROM pomodoros WHERE id_task = NEW.id_task
        ), 0)
        WHERE id = NEW.id_task;

        UPDATE tasks
        SET total_time_minutes = IFNULL((
            SELECT SUM(minutes) FROM pomodoros WHERE id_task = OLD.id_task
        ), 0)
        WHERE id = OLD.id_task;

        -- Goals
        UPDATE goals
        SET total_time_minutes = IFNULL((
            SELECT SUM(minutes) FROM pomodoros WHERE id_goal = NEW.id_goal
        ), 0)
        WHERE id = NEW.id_goal;

        UPDATE goals
        SET total_time_minutes = IFNULL((
            SELECT SUM(minutes) FROM pomodoros WHERE id_goal = OLD.id_goal
        ), 0)
        WHERE id = OLD.id_goal;

        -- Categories
        UPDATE categories
        SET total_time_minutes = IFNULL((
            SELECT SUM(po.minutes)
            FROM pomodoros po
            JOIN projects pr ON po.id_project = pr.id
            WHERE pr.id_category = (
                SELECT id_category FROM projects WHERE id = NEW.id_project
            )
        ), 0)
        WHERE id = (
            SELECT id_category FROM projects WHERE id = NEW.id_project
        );

        UPDATE categories
        SET total_time_minutes = IFNULL((
            SELECT SUM(po.minutes)
            FROM pomodoros po
            JOIN projects pr ON po.id_project = pr.id
            WHERE pr.id_category = (
                SELECT id_category FROM projects WHERE id = OLD.id_project
            )
        ), 0)
        WHERE id = (
            SELECT id_category FROM projects WHERE id = OLD.id_project
        );
    END;
    "#;

    conn.execute_batch(qry)?;
    Ok(())
}
