use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Goal {
    pub id: i32,
    pub name: String,
    #[serde(rename = "idProject")]
    pub id_project: i32,
    #[serde(rename = "totalTimeMinutes")]
    pub total_time_minutes: i32,
    #[serde(rename = "createdAt")]
    pub created_at: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GoalCreate {
    pub name: String,
    #[serde(rename = "idProject")]
    pub id_project: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GoalUpdate {
    pub name: Option<String>,
    #[serde(rename = "idProject")]
    pub id_project: Option<i32>,
}