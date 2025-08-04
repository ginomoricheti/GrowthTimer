use rusqlite::{Connection, Result};

pub fn create_schema(conn: &Connection) -> Result<()> {
    let qry: &'static str = r#"
        -- ============================================
        -- Database setup for Growth Timer (MEJORADO)
        -- ============================================

        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) NOT NULL,
            total_time_minutes INTEGER DEFAULT 0,
            color VARCHAR(7) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) NOT NULL,
            id_category INTEGER NOT NULL,
            color VARCHAR(7),
            total_time_minutes INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_category) REFERENCES categories(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS goals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title VARCHAR(255) NOT NULL,
            id_project INTEGER NOT NULL,
            target_minutes INTEGER DEFAULT 0,
            completed_minutes INTEGER DEFAULT 0,
            is_completed BOOLEAN DEFAULT FALSE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_project) REFERENCES projects(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) NOT NULL,
            color VARCHAR(7),
            total_time_minutes INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS pomodoros (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            minutes INTEGER DEFAULT 25,
            id_project INTEGER NOT NULL,
            id_goal INTEGER,
            id_task INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_project) REFERENCES projects(id) ON DELETE CASCADE,
            FOREIGN KEY (id_goal) REFERENCES goals(id) ON DELETE SET NULL,
            FOREIGN KEY (id_task) REFERENCES tasks(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(id_category);
        CREATE INDEX IF NOT EXISTS idx_goals_project ON goals(id_project);
        CREATE INDEX IF NOT EXISTS idx_pomodoros_project ON pomodoros(id_project);
        CREATE INDEX IF NOT EXISTS idx_pomodoros_task ON pomodoros(id_task);
        CREATE INDEX IF NOT EXISTS idx_pomodoros_goal ON pomodoros(id_goal);
        CREATE INDEX IF NOT EXISTS idx_pomodoros_date ON pomodoros(created_at);

        INSERT OR IGNORE INTO categories (id, name, color) VALUES 
            (1, 'Personal', '#10B981'),
            (2, 'Trabajo', '#3B82F6'),
            (3, 'Salud', '#EF4444'),
            (4, 'Estudios', '#8B5CF6'),
            (5, 'Finanzas', '#F59E0B'),
            (6, 'Hogar', '#06B6D4'),
            (7, 'Creatividad', '#EC4899'),
            (8, 'Relaciones', '#84CC16'),
            (9, 'Fitness', '#F97316'),
            (10, 'Hobbies', '#6366F1');

        INSERT OR IGNORE INTO tasks (id, name, color) VALUES 
            (1, 'Leer', '#10B981'),
            (2, 'Estudiar', '#8B5CF6'),
            (3, 'Practicar', '#F59E0B'),
            (4, 'Debuguear', '#EF4444'),
            (5, 'Planificar', '#3B82F6'),
            (6, 'Investigar', '#06B6D4'),
            (7, 'Documentar', '#84CC16'),
            (8, 'Revisar', '#F97316'),
            (9, 'Refactorizar', '#EC4899'),
            (10, 'Diseñar', '#6366F1'),
            (11, 'Meditar', '#10B981'),
            (12, 'Ejercitar', '#EF4444'),
            (13, 'Cocinar', '#F59E0B'),
            (14, 'Organizar', '#06B6D4');
    "#;

    conn.execute_batch(qry)?;
    Ok(())
}
