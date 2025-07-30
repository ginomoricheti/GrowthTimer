use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Task {
    pub id: i32,
    pub name: String,
    #[serde(rename = "totalTimeMinutes")]
    pub total_time_minutes: i32,
    #[serde(rename = "createdAt")]
    pub created_at: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TaskCreate {
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TaskUpdate {
    pub name: Option<String>,
}