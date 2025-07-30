use serde::{Serialize, Deserialize};

use crate::models::{Category, Goal, PomodoroRecord};

#[derive(Debug, Serialize, Deserialize)]
pub struct Project {
    pub id: i32,
    pub name: String,
    pub category: Category,
    pub goals: Option<Vec<Goal>>,
    #[serde(rename = "pomodoroRecords")]
    pub pomodoro_records: Vec<PomodoroRecord>,
    #[serde(rename = "totalTimeMinutes")]
    pub total_time_minutes: i32,
    #[serde(rename = "createdAt")]
    pub created_at: Option<String>,
    #[serde(rename = "updatedAt")]
    pub updated_at: Option<String>,
    pub color: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProjectCreate {
    pub name: String,
    #[serde(rename = "idCategory")]
    pub id_category: i32,
    pub color: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProjectUpdate {
    pub name: Option<String>,
    #[serde(rename = "idCategory")]
    pub id_category: Option<i32>,
    pub color: Option<String>,
}