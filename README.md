# Scripts Launcher

A Visual Studio Code extension that provides a convenient status bar button with dropdown menu for executing npm scripts from your package.json file.

## Features

- **Status Bar Integration**: Quick access via a "Run Task" button in the status bar
- **Script Selection**: Choose which scripts to display in the dropdown menu
- **One-Click Execution**: Run npm scripts with a single click
- **Terminal Integration**: Scripts execute in VSCode's integrated terminal
- **Workspace Configuration**: Different script selections per project

## Installation

### From VSCode Marketplace

1. Open VSCode
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Scripts Launcher"
4. Click Install

### From VSIX Package

1. Download the .vsix file from releases
2. Open VSCode
3. Go to Extensions (Ctrl+Shift+X)
4. Click the "..." menu and select "Install from VSIX..."
5. Select the downloaded .vsix file

## Usage

### Initial Setup

1. Open a project that contains a `package.json` file with scripts
2. Look for the "Run Task" button in the status bar (bottom of VSCode)
3. Click the button to open the dropdown menu
4. Select "Select Tasks" to choose which scripts to display

### Running Scripts

1. Click the "Run Task" button in the status bar
2. Choose a script from the dropdown menu
3. The script will execute in a new terminal tab

### Managing Selected Scripts

1. Click "Run Task" → "Selected Tasks" (or "Select Tasks" if none selected)
2. Check/uncheck scripts you want to show in the dropdown
3. Click OK to save your selection

## Configuration

The extension stores your script selections in the workspace configuration. You can also manually edit the settings:

```json
{
  "scriptsLauncher.selectedScripts": [
    "build",
    "test",
    "start"
  ]
}
```

## Requirements

- Visual Studio Code 1.74.0 or higher
- A project with a `package.json` file containing scripts
- Node.js and npm installed (for script execution)

## Extension Settings

This extension contributes the following settings:

- `scriptsLauncher.selectedScripts`: Array of script names to show in the dropdown menu

## Known Issues

- Scripts must be defined in the root `package.json` file
- Only npm scripts are currently supported (yarn/pnpm support planned)

## Release Notes

### 1.0.0

Initial release of Scripts Launcher

- Status bar button with dropdown menu
- Script selection interface
- Terminal integration for script execution
- Workspace-level configuration

## Contributing

Contributions are welcome! Please see the [development guide](./documentation/development.md) for setup instructions.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have feature requests, please:

1. Check the [known issues](#known-issues) section
2. Search existing [GitHub issues](https://github.com/trystan4861/scripts-launcher/issues)
3. Create a new issue if needed

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.