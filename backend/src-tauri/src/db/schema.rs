use sqlx::{sqlite::SqliteQueryResult, SqlitePool};

pub async fn create_schema(db_url: &str) -> Result<SqliteQueryResult, sqlx::Error> {
    let pool = SqlitePool::connect(db_url).await?;
    let qry = r#"
        -- ============================================
        -- Database setup for Growth Timer
        -- ============================================

        -- Categories table (with default values)
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) NOT NULL,
            total_time_minutes INTEGER DEFAULT 0,
            color VARCHAR(7) NOT NULL, -- Color obligatorio
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Projects table
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) NOT NULL,
            id_category INTEGER NOT NULL, -- Obligatorio, siempre tiene categoría
            color VARCHAR(7), -- Color específico del proyecto (opcional)
            total_time_minutes INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_category) REFERENCES categories(id)
        );

        -- Goals table
        CREATE TABLE IF NOT EXISTS goals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) NOT NULL,
            id_project INTEGER NOT NULL, -- Referencia al ID del proyecto
            total_time_minutes INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_project) REFERENCES projects(id)
        );

        -- Tasks table (with default values)
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) NOT NULL,
            total_time_minutes INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Pomodoros table
        CREATE TABLE IF NOT EXISTS pomodoros (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date DATETIME DEFAULT CURRENT_TIMESTAMP,
            minutes INTEGER DEFAULT 25,
            id_project INTEGER NOT NULL,
            id_goal INTEGER,
            id_task INTEGER NOT NULL,
            FOREIGN KEY (id_project) REFERENCES projects(id),
            FOREIGN KEY (id_goal) REFERENCES goals(id),
            FOREIGN KEY (id_task) REFERENCES tasks(id)
        );

        -- ============================================
        -- DATOS PREDEFINIDOS
        -- ============================================

        -- Default Categories
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

        -- Default Tasks
        INSERT OR IGNORE INTO tasks (id, name) VALUES 
            (1, 'Leer'),
            (2, 'Estudiar'),
            (3, 'Practicar'),
            (4, 'Debuguear'),
            (5, 'Planificar'),
            (6, 'Investigar'),
            (7, 'Documentar'),
            (8, 'Revisar'),
            (9, 'Refactorizar'),
            (10, 'Diseñar'),
            (11, 'Meditar'),
            (12, 'Ejercitar'),
            (13, 'Cocinar'),
            (14, 'Organizar');
    "#;

    let result = sqlx::query(qry).execute(&pool).await?;
    Ok(result)
}