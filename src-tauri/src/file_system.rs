#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]
use std::fs;
use std::io::{self, Read};
use std::path::Path;
use std::process::Command;
use sha2::{Sha256, Digest};
use hex;
use winapi::um::fileapi::GetLogicalDriveStringsW;
use winapi::um::winnt::WCHAR;
use std::ffi::OsString;
use std::os::windows::ffi::OsStringExt;

// Check if a given path exists.
pub fn path_exists(path: &str) -> bool {
    Path::new(path).exists()
}

// Compute the SHA-256 hash of a file.
pub fn file_hash(path: &str) -> Result<String, io::Error> {
    // Open the file
    let mut file = fs::File::open(Path::new(path))?;
    
    // Create a buffer to hold file data
    let mut buffer = Vec::new();
    
    // Read the file contents into the buffer
    file.read_to_end(&mut buffer)?;
    
    // Create a Sha256 instance
    let mut hasher = Sha256::new();
    
    // Feed the file data into the hasher
    hasher.update(&buffer);
    
    // Finalize the hash computation
    let result = hasher.finalize();
    
    // Convert the hash to a hexadecimal string
    Ok(hex::encode(result))
}

// Determine the type of a given path (file, directory, or none).
pub fn path_type(path: &str) -> &'static str {
    let path = Path::new(path);

    if path.exists() {
        if path.is_file() {
            "File"
        } else if path.is_dir() {
            "Folder"
        } else {
            "None"
        }
    } else {
        "None"
    }
}

// Open a file with the default system application.
pub fn open_file(file_path: &str) -> io::Result<()> {
    if cfg!(target_os = "windows") {
        Command::new("cmd")
            .args(&["/C", "start", "", file_path])
            .spawn()?
            .wait()?;
    } else {
        Command::new("xdg-open")
            .arg(file_path)
            .spawn()?
            .wait()?;
    }
    Ok(())
}

// List the contents of a directory.
pub fn list_directory_contents(path: &str) -> Result<Vec<String>, String> {
    let entries = fs::read_dir(path)
        .map_err(|err| format!("Failed to read directory '{}': {}", path, err))?;

    let mut result = Vec::new();
    for entry in entries {
        let entry = entry.map_err(|err| format!("Failed to read entry in directory '{}': {}", path, err))?;
        let file_name_str = entry.file_name().to_string_lossy().into_owned();
        result.push(file_name_str);
    }

    Ok(result)
}

// Calculate the total size of a directory.
pub fn calculate_directory_size(dir_path: &str) -> Result<u64, String> {
    let mut total_size = 0;

    let entries = fs::read_dir(dir_path)
        .map_err(|err| format!("Failed to read directory '{}': {}", dir_path, err))?;

    for entry in entries {
        let entry = entry.map_err(|err| format!("Failed to read entry in directory '{}': {}", dir_path, err))?;
        let path = entry.path();
        let metadata = entry.metadata()
            .map_err(|err| format!("Failed to get metadata for '{}': {}", path.display(), err))?;

        if metadata.is_file() {
            total_size += metadata.len();
        } else if metadata.is_dir() {
            let size = calculate_directory_size(&path.to_string_lossy())?;
            total_size += size;
        }
    }

    Ok(total_size)
}

// Print metadata for a file or directory.
pub fn print_metadata(path: &str) {
    let path = Path::new(path);

    if path.is_dir() {
        match calculate_directory_size(&path.to_string_lossy()) {
            Ok(total_size) => println!("Total size of '{}': {}", path.display(), format_file_size(total_size)),
            Err(err) => eprintln!("Failed to calculate size of directory '{}': {}", path.display(), err),
        }
    } else {
        match fs::metadata(path) {
            Ok(metadata) => {
                println!("Metadata for '{}':", path.display());
                println!("  Size: {}", format_file_size(metadata.len()));
                println!("  Permissions: {:?}", metadata.permissions());

                if let Ok(modified) = metadata.modified() {
                    println!("  Last modified: {:?}", modified);
                }

                if let Ok(created) = metadata.created() {
                    println!("  Created: {:?}", created);
                }
            }
            Err(e) => eprintln!("Error getting metadata for '{}': {}", path.display(), e),
        }
    }
}

// Format file size into a human-readable string.
pub fn format_file_size(size: u64) -> String {
    const KB: u64 = 1024;
    const MB: u64 = 1024 * KB;
    const GB: u64 = 1024 * MB;
    const TB: u64 = 1024 * GB;

    if size >= TB {
        format!("{:.2} TB", size as f64 / TB as f64)
    } else if size >= GB {
        format!("{:.2} GB", size as f64 / GB as f64)
    } else if size >= MB {
        format!("{:.2} MB", size as f64 / MB as f64)
    } else if size >= KB {
        format!("{:.2} KB", size as f64 / KB as f64)
    } else {
        format!("{} bytes", size)
    }
}

pub fn get_drive_letters() -> Vec<String> {
    // Allocate a buffer for the drive strings
    let buffer_size = 1024;
    let mut buffer: Vec<WCHAR> = vec![0; buffer_size];

    let mut drives = Vec::new();

    unsafe {
        // Get the logical drive strings
        let length = GetLogicalDriveStringsW(buffer_size as u32, buffer.as_mut_ptr());
        
        if length == 0 {
            eprintln!("Failed to get drive strings");
            return drives;
        }

        // Convert buffer to a vector of strings
        let drive_strings: Vec<OsString> = buffer
            .split(|&c| c == 0)
            .filter_map(|s| {
                if !s.is_empty() {
                    Some(OsString::from_wide(s))
                } else {
                    None
                }
            })
            .collect();
        
        // Add each drive letter to the drives vector
        for drive in drive_strings {
            drives.push(drive.to_string_lossy().to_string());
        }
    }

    drives
}
