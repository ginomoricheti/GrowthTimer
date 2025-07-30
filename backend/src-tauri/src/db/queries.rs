use r2d2_sqlite::SqliteConnectionManager;
use r2d2::Pool;
use std::error::Error;
use std::collections::HashMap;

// Importar los modelos desde models.rs
use crate::models::categories::Category;
use crate::models::goals::Goal;
use crate::models::tasks::Task;
use crate::models::pomodoros::PomodoroRecord;
use crate::models::projects::Project;

// Función principal para obtener proyectos con estructura completa
pub fn get_all_projects_complete(pool: &Pool<SqliteConnectionManager>) -> Result<Vec<Project>, Box<dyn Error>> {
    let conn = pool.get()?;
    
    // 1. Obtener todos los proyectos con sus categorías
    let mut projects_stmt = conn.prepare(
        "SELECT p.id, p.name, p.id_category, p.color, p.total_time_minutes, 
                p.created_at, p.updated_at,
                c.id as cat_id, c.name as cat_name, c.color as cat_color, 
                c.total_time_minutes as cat_total_time, c.created_at as cat_created_at
         FROM projects p
         JOIN categories c ON p.id_category = c.id
         ORDER BY p.name"
    )?;
    
    let project_rows = projects_stmt.query_map([], |row| {
        Ok((
            // Project data
            row.get::<_, i32>(0)?, // id
            row.get::<_, String>(1)?, // name
            row.get::<_, i32>(2)?, // id_category
            row.get::<_, Option<String>>(3)?, // color
            row.get::<_, i32>(4)?, // total_time_minutes
            row.get::<_, Option<String>>(5)?, // created_at
            row.get::<_, Option<String>>(6)?, // updated_at
            // Category data
            Category {
                id: row.get(7)?,
                name: row.get(8)?,
                color: row.get(9)?,
                total_time_minutes: row.get(10)?,
                created_at: row.get(11)?,
            }
        ))
    })?;

    let mut projects: Vec<Project> = Vec::new();
    let mut project_ids: Vec<i32> = Vec::new();

    for project_row in project_rows {
        let (id, name, _id_category, color, total_time_minutes, created_at, updated_at, category) = project_row?;
        project_ids.push(id);
        
        projects.push(Project {
            id,
            name,
            category,
            goals: None, // Se llenará después
            pomodoro_records: Vec::new(), // Se llenará después
            total_time_minutes,
            created_at,
            updated_at,
            color,
        });
    }

    if projects.is_empty() {
        return Ok(projects);
    }

    // 2. Obtener goals por proyecto
    let project_ids_str = project_ids.iter()
        .map(|id| id.to_string())
        .collect::<Vec<_>>()
        .join(",");
    
    let goals_query = format!(
        "SELECT id, name, id_project, total_time_minutes, created_at 
         FROM goals 
         WHERE id_project IN ({}) 
         ORDER BY name", 
        project_ids_str
    );
    
    let mut goals_stmt = conn.prepare(&goals_query)?;
    let goal_rows = goals_stmt.query_map([], |row| {
        Ok(Goal {
            id: row.get(0)?,
            name: row.get(1)?,
            id_project: row.get(2)?,
            total_time_minutes: row.get(3)?,
            created_at: row.get(4)?,
        })
    })?;

    let mut goals_by_project: HashMap<i32, Vec<Goal>> = HashMap::new();
    for goal_row in goal_rows {
        let goal = goal_row?;
        goals_by_project.entry(goal.id_project).or_insert_with(Vec::new).push(goal);
    }

    // 3. Obtener pomodoros con tasks y goals
    let pomodoros_query = format!(
        "SELECT p.id, p.minutes, p.id_project, p.id_goal, p.id_task, p.created_at,
                t.id as task_id, t.name as task_name, t.total_time_minutes as task_total_time, 
                t.created_at as task_created_at,
                g.id as goal_id, g.name as goal_name, g.id_project as goal_id_project,
                g.total_time_minutes as goal_total_time, g.created_at as goal_created_at
         FROM pomodoros p
         JOIN tasks t ON p.id_task = t.id
         LEFT JOIN goals g ON p.id_goal = g.id
         WHERE p.id_project IN ({})
         ORDER BY p.created_at DESC", 
        project_ids_str
    );
    
    let mut pomodoros_stmt = conn.prepare(&pomodoros_query)?;
    let pomodoro_rows = pomodoros_stmt.query_map([], |row| {
        let goal = if row.get::<_, Option<i32>>(10)?.is_some() {
            Some(Goal {
                id: row.get(10)?,
                name: row.get(11)?,
                id_project: row.get(12)?,
                total_time_minutes: row.get(13)?,
                created_at: row.get(14)?,
            })
        } else {
            None
        };

        Ok(PomodoroRecord {
            id: row.get(0)?,
            minutes: row.get(1)?,
            id_project: row.get(2)?,
            id_goal: row.get(3)?,
            id_task: row.get(4)?,
            created_at: row.get(5)?,
            task: Task {
                id: row.get(6)?,
                name: row.get(7)?,
                total_time_minutes: row.get(8)?,
                created_at: row.get(9)?,
            },
            goal,
        })
    })?;

    let mut pomodoros_by_project: HashMap<i32, Vec<PomodoroRecord>> = HashMap::new();
    for pomodoro_row in pomodoro_rows {
        let pomodoro = pomodoro_row?;
        pomodoros_by_project.entry(pomodoro.id_project).or_insert_with(Vec::new).push(pomodoro);
    }

    // 4. Asignar goals y pomodoros a cada proyecto
    for project in &mut projects {
        project.goals = goals_by_project.remove(&project.id);
        project.pomodoro_records = pomodoros_by_project.remove(&project.id).unwrap_or_default();
    }

    Ok(projects)
}

// Función para obtener un proyecto específico por ID
pub fn get_project_by_id(pool: &Pool<SqliteConnectionManager>, project_id: i32) -> Result<Option<Project>, Box<dyn Error>> {
    let conn = pool.get()?;
    
    // 1. Obtener el proyecto con su categoría
    let mut project_stmt = conn.prepare(
        "SELECT p.id, p.name, p.id_category, p.color, p.total_time_minutes, 
                p.created_at, p.updated_at,
                c.id as cat_id, c.name as cat_name, c.color as cat_color, 
                c.total_time_minutes as cat_total_time, c.created_at as cat_created_at
         FROM projects p
         JOIN categories c ON p.id_category = c.id
         WHERE p.id = ?"
    )?;
    
    let project_result = project_stmt.query_row([project_id], |row| {
        Ok((
            row.get::<_, i32>(0)?,
            row.get::<_, String>(1)?,
            row.get::<_, Option<String>>(3)?,
            row.get::<_, i32>(4)?,
            row.get::<_, Option<String>>(5)?,
            row.get::<_, Option<String>>(6)?,
            Category {
                id: row.get(7)?,
                name: row.get(8)?,
                color: row.get(9)?,
                total_time_minutes: row.get(10)?,
                created_at: row.get(11)?,
            }
        ))
    });

    let (id, name, color, total_time_minutes, created_at, updated_at, category) = match project_result {
        Ok(data) => data,
        Err(rusqlite::Error::QueryReturnedNoRows) => return Ok(None),
        Err(e) => return Err(Box::new(e)),
    };

    // 2. Obtener goals del proyecto
    let mut goals_stmt = conn.prepare(
        "SELECT id, name, id_project, total_time_minutes, created_at 
         FROM goals 
         WHERE id_project = ? 
         ORDER BY name"
    )?;
    
    let goal_rows = goals_stmt.query_map([project_id], |row| {
        Ok(Goal {
            id: row.get(0)?,
            name: row.get(1)?,
            id_project: row.get(2)?,
            total_time_minutes: row.get(3)?,
            created_at: row.get(4)?,
        })
    })?;

    let mut goals = Vec::new();
    for goal_row in goal_rows {
        goals.push(goal_row?);
    }

    // 3. Obtener pomodoros con tasks y goals
    let mut pomodoros_stmt = conn.prepare(
        "SELECT p.id, p.minutes, p.id_project, p.id_goal, p.id_task, p.created_at,
                t.id as task_id, t.name as task_name, t.total_time_minutes as task_total_time, 
                t.created_at as task_created_at,
                g.id as goal_id, g.name as goal_name, g.id_project as goal_id_project,
                g.total_time_minutes as goal_total_time, g.created_at as goal_created_at
         FROM pomodoros p
         JOIN tasks t ON p.id_task = t.id
         LEFT JOIN goals g ON p.id_goal = g.id
         WHERE p.id_project = ?
         ORDER BY p.created_at DESC"
    )?;
    
    let pomodoro_rows = pomodoros_stmt.query_map([project_id], |row| {
        let goal = if row.get::<_, Option<i32>>(10)?.is_some() {
            Some(Goal {
                id: row.get(10)?,
                name: row.get(11)?,
                id_project: row.get(12)?,
                total_time_minutes: row.get(13)?,
                created_at: row.get(14)?,
            })
        } else {
            None
        };

        Ok(PomodoroRecord {
            id: row.get(0)?,
            minutes: row.get(1)?,
            id_project: row.get(2)?,
            id_goal: row.get(3)?,
            id_task: row.get(4)?,
            created_at: row.get(5)?,
            task: Task {
                id: row.get(6)?,
                name: row.get(7)?,
                total_time_minutes: row.get(8)?,
                created_at: row.get(9)?,
            },
            goal,
        })
    })?;

    let mut pomodoro_records = Vec::new();
    for pomodoro_row in pomodoro_rows {
        pomodoro_records.push(pomodoro_row?);
    }

    Ok(Some(Project {
        id,
        name,
        category,
        goals: if goals.is_empty() { None } else { Some(goals) },
        pomodoro_records,
        total_time_minutes,
        created_at,
        updated_at,
        color,
    }))
}

// Funciones auxiliares para obtener datos simples
pub fn get_all_categories(pool: &Pool<SqliteConnectionManager>) -> Result<Vec<Category>, Box<dyn Error>> {
    let conn = pool.get()?;
    let mut stmt = conn.prepare("SELECT id, name, total_time_minutes, color, created_at FROM categories ORDER BY name")?;
    
    let category_iter = stmt.query_map([], |row| {
        Ok(Category {
            id: row.get(0)?,
            name: row.get(1)?,
            total_time_minutes: row.get(2)?,
            color: row.get(3)?,
            created_at: row.get(4)?,
        })
    })?;

    let mut categories = Vec::new();
    for category in category_iter {
        categories.push(category?);
    }
    
    Ok(categories)
}

pub fn get_all_tasks(pool: &Pool<SqliteConnectionManager>) -> Result<Vec<Task>, Box<dyn Error>> {
    let conn = pool.get()?;
    let mut stmt = conn.prepare("SELECT id, name, total_time_minutes, created_at FROM tasks ORDER BY name")?;
    
    let task_iter = stmt.query_map([], |row| {
        Ok(Task {
            id: row.get(0)?,
            name: row.get(1)?,
            total_time_minutes: row.get(2)?,
            created_at: row.get(3)?,
        })
    })?;

    let mut tasks = Vec::new();
    for task in task_iter {
        tasks.push(task?);
    }
    
    Ok(tasks)
}