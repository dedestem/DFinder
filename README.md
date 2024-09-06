
# DFINDER
### An fast and opensource filebrowser written in rust. 
Roadmap: https://trello.com/b/DSGNLd6k/dfinder
Icons source: https://fonts.google.com/icons

## Supported os's
Win11 \
Win10 


### Installer notice
When using .msi you need admin \
When using .exe you dont need admin

<br>
<h3>Preview video 0.2.0</h3>
<a href="https://youtu.be/9asUwgz0W-0">Preview video 0.2.0 | YT</a>
<br>
<br>
<h1>How to build | On Windows</h1>


   WARNING SOURCECODE IS MOST TIMES STABLE.<br>
   IF NOT USE AND RELEASE SOURCECODE<br>

<br>
<br>

Install git and rust and tauri.
```batch
winget install --id Git.Git -e --source winget
https://static.rust-lang.org/rustup/dist/x86_64-pc-windows-msvc/rustup-init.exe Run this installer of rust
cargo install tauri-cli
```

Clone and init
```batch
git clone https://github.com/dedestem/dfinder
cd dfinder/src-tauri
```

Build for dev = Runs without making exe/installer
```batch
cargo tauri dev
```

Build for installer .exe and .msi
```batch
cargo tauri build
```

