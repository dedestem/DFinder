[![Build Tauri App](https://github.com/dedestem/dfinder/actions/workflows/tauricompilecheck.yaml/badge.svg)](https://github.com/dedestem/dfinder/actions/workflows/tauricompilecheck.yaml)
# DFINDER
### An fast and opensource filebrowser written in rust. 

##Contributing\
Feel free to contribute


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
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
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

