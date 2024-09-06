#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]
pub mod file_system;
pub mod gui_handler;
pub mod systeminfo;
pub mod search;

fn main() {
    println!("Running Version 0.2.5");
    println!("Running tests!");
    systeminfo::iswindows();
    println!("Starting Main Program");
    gui_handler::start();
}
