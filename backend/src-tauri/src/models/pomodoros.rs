use serde::{Serialize, Deserialize};

use crate::models::{Goal, Task};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PomodoroRecord {
    pub id: i32,
    pub minutes: i32,
    #[serde(rename = "idProject")]
    pub id_project: i32,
    #[serde(rename = "idGoal")]
    pub id_goal: Option<i32>,
    #[serde(rename = "idTask")]
    pub id_task: i32,
    pub task: Task,
    pub goal: Option<Goal>,
    #[serde(rename = "createdAt")]
    pub created_at: Option<String>,
}
#[derive(Debug, Serialize, Deserialize)]
pub struct PomodoroCreate {
    pub minutes: Option<i32>, // Default 25
    #[serde(rename = "idProject")]
    pub id_project: i32,
    #[serde(rename = "idGoal")]
    pub id_goal: Option<i32>,
    #[serde(rename = "idTask")]
    pub id_task: i32,
}