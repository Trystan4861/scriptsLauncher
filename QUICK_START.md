# Quick Start Guide - Scripts Launcher

## Installation & Testing

### 1. Install the Extension (Development)
```powershell
# Run the development setup script
.\install-dev.ps1
```

### 2. Test the Extension
1. Open this project in VSCode
2. Press `F5` to launch Extension Development Host
3. In the new window, open a project with `package.json`
4. Look for "Ejecutar tarea" button in the status bar

### 3. Using the Extension
1. Click "Ejecutar tarea" in the status bar
2. Select "Select Tasks" to choose which scripts to show
3. Check the scripts you want in the dropdown
4. Click "Ejecutar tarea" again to see your selected scripts
5. Click any script to run it in the terminal

## Package & Publish

### Create VSIX Package
```bash
npm run package
```

### Publish to Marketplace
```bash
npm run publish
```

## Project Structure
```
scripts-launcher/
├── src/
│   ├── extension.ts          # Main extension code
│   └── test/                 # Unit tests
├── out/                      # Compiled JavaScript
├── documentation/            # Additional docs
├── package.json             # Extension manifest
└── scripts-launcher-1.0.0.vsix  # Packaged extension
```

## Features Implemented ✅
- ✅ Status bar button with "Ejecutar tarea" text
- ✅ Dropdown menu with script selection
- ✅ "Select Tasks" / "Selected Tasks" toggle
- ✅ Terminal integration for npm scripts
- ✅ Workspace-level configuration
- ✅ Error handling for missing package.json
- ✅ Complete test suite
- ✅ Full documentation package

## Ready for Production! 🚀