use std::path::{Path, PathBuf};
use walkdir::WalkDir;
use rayon::prelude::*;

fn search_files_and_directories_parallel(dir: &str, query: &str) -> Vec<PathBuf> {
    let dir_path = Path::new(dir);

    WalkDir::new(dir_path)
        .into_iter()
        .par_bridge()  // Parallel processing with rayon
        .filter_map(Result::ok)
        .filter(|entry| {
            let name = entry.path().to_string_lossy().to_lowercase(); // Use entry.path() to include directories
            let query_lowercase = query.to_lowercase();
            name.contains(&query_lowercase)
        })
        .map(|entry| entry.path().to_path_buf())
        .collect()
}

pub fn search(dir: &str, query: &str) {
    println!("Searching for '{}' in '{}'", query, dir);

    let entries = search_files_and_directories_parallel(dir, query);
    for entry in entries {
        println!("{}", entry.display());
    }
}