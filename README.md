# DFINDER
### An fast and opensource filebrowser written in rust. 




## Supported os's
Win11 \
Win10 


### Installer notice
When using .msi you need admin \
When using .exe you dont need admin

<br>


<h1>How to build | On Windows</h1>

Install git and rust and tauri.
```batch
winget install --id Git.Git -e --source winget
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo install tauri-cli
```

Clone and init
```batch
git clone https://github.com/dedestem/dfinder
cd src-tauri
```

Build for dev = Runs without making exe/installer
```batch
cargo tauri dev
```

Build for installer .exe and .msi
```batch
cargo tauri build
```

<br>
<br>
## Search functionality ideas: 
   <br>
   - Search on extension
   <br>
   - Search on filename
   <br>
   - Search on filename+extension
   <br>
