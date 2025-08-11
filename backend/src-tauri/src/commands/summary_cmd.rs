use tauri::State;
use std::sync::{Arc, Mutex};
use crate::db::Database;
use crate::analytics::summary_report;
use crate::models::summary::SummaryReport;

#[tauri::command]
pub fn get_summary_report(
    db: State<'_, Arc<Mutex<Database>>>
) -> Result<SummaryReport, String> {
    let mut db = db.lock().map_err(|_| "Failed to lock DB")?;
    summary_report_service::generate_report(&mut db)
        .map_err(|e| format!("Failed to generate report: {}", e))
}
