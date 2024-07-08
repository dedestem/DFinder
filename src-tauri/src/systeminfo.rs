use home::home_dir;

pub fn gethomdir() -> Option<String> {
    if let Some(path) = home_dir() {
        Some(path.to_string_lossy().to_string())
    } else {
        None
    }
}

pub fn iswindows() {
    if cfg!(target_os = "windows") {
        println!("This is a Windows system.");
    } else {
        println!("This is not a Windows system.");
        std::process::exit(1);
    }
}
