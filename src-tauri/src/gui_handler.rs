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

#[tauri::command(async)]
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

#[tauri::command]
fn get_file_hash(path: String) -> String {
    match file_system::file_hash(&path) {
        Ok(value) => value,
        Err(e) => {
            println!("Collecting hash encountered an error while battling the opponement used: {}", e);
            String::new()
        },
    }
}

use tauri::Window;

#[tauri::command]
fn toggle_decorations(window: Window, should_have_decorations: bool) {
    window.set_decorations(should_have_decorations).unwrap();
}

#[tauri::command]
fn get_drive_letters() -> Vec<String> {
   file_system::get_drive_letters()
}

#[tauri::command]
fn delete_file(file_path: String) {
    let del: Result<(), std::io::Error> = file_system::delete(&file_path);
    println!("{:?}", del);
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
            search,
            get_file_hash,
            toggle_decorations,
            get_drive_letters,
            delete_file
        ])
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application!");
}
