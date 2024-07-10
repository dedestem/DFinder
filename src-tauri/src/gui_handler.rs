#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]
use crate::file_system;
use crate::systeminfo;
use crate::search;
use std::fs;
use std::path::PathBuf;

#[tauri::command]
fn path_exists(path: String) -> String {
    file_system::path_exists(&path).to_string()
}

#[tauri::command]
fn path_type(path: String) -> String {
    file_system::path_type(&path).to_string()
}

#[tauri::command]
fn open_file(path: String) -> Result<(), String> {
    file_system::open_file(&path).map_err(|e| format!("Failed to open file: {}", e))
}

#[tauri::command]
fn list_dir(path: String) -> Result<Vec<String>, String> {
    let entries = match fs::read_dir(&path) {
        Ok(entries) => entries,
        Err(err) => return Err(format!("Failed to read directory '{}': {}", path, err)),
    };

    let mut result = Vec::new();
    for entry in entries {
        let entry = match entry {
            Ok(entry) => entry,
            Err(err) => return Err(format!("Failed to read entry in directory '{}': {}", path, err)),
        };
        let file_name = entry.file_name();
        let file_name_str = file_name.to_string_lossy().into_owned();
        result.push(file_name_str);
    }

    Ok(result)
}

#[tauri::command]
fn get_directory_size(path: String) -> Result<u64, String> {
    file_system::calculate_directory_size(&path)
}

#[tauri::command]
fn print_metadata(path: String) {
    file_system::print_metadata(&path);
}

#[tauri::command]
fn get_home_path() -> Option<String> {
    systeminfo::gethomdir()
}

#[tauri::command(async)]
fn search(path: String, query: String) -> Vec<PathBuf> {
    let pathstr: &str = &path;
    let querystr: &str = &query;
    let out = search::search(pathstr, querystr);
    println!("Done searching");
    out
}



pub fn start() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            path_exists,
            path_type,
            open_file,
            list_dir,
            get_directory_size,
            print_metadata,
            get_home_path,
            search
        ])
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application!");
}
