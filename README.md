![Build](https://github.com/dedestem/dfinder/blob/main/.github%2Fworkflows%2Ftauricompilecheck.yaml/badge.svg) 

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

<br>
<br>
<h1>Search functionality ideas:</h1> 
   <br>
   - Search on extension
   <br>
