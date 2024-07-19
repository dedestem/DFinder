#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]
pub mod file_system;
pub mod gui_handler;
pub mod systeminfo;
pub mod search;

fn main() {
    println!("Running Version 0.2.0");
    println!("Running tests!");
    systeminfo::iswindows();
    let path = r"C:\Test\Uno2\123.txt"; // Using raw string to avoid escape issues
    println!("{:#?}", file_system::file_hash(path)); // Adjust file_system::file_hash according to your actual implementation
    
    println!("Starting Main Program");
    gui_handler::start();
}
