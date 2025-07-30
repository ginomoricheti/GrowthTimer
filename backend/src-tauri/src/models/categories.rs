use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Category {
    pub id: i32,
    pub name: String,
    pub color: String,
    #[serde(rename = "totalTimeMinutes")]
    pub total_time_minutes: i32,
    #[serde(rename = "createdAt")]
    pub created_at: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CategoryCreate {
    pub name: String,
    pub color: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CategoryUpdate {
    pub name: Option<String>,
    pub color: Option<String>,
}