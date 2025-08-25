# Tasks Launcher

A Visual Studio Code extension that provides a convenient status bar button with dropdown menu for executing npm tasks and VSCode tasks from your project.

## Features

- **Status Bar Integration**: Quick access via a "Run Task" button in the status bar
- **Task Selection**: Choose which npm tasks and VSCode tasks to display in the dropdown menu
- **One-Click Execution**: Run npm tasks and VSCode tasks with a single click
- **Terminal Integration**: Tasks execute in VSCode's integrated terminal
- **Workspace Configuration**: Different task selections per project

## Installation

### From VSCode Marketplace

1. Open VSCode
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Tasks Launcher"
4. Click Install

### From VSIX Package

1. Download the .vsix file from releases
2. Open VSCode
3. Go to Extensions (Ctrl+Shift+X)
4. Click the "..." menu and select "Install from VSIX..."
5. Select the downloaded .vsix file

## Usage

### Initial Setup

1. Open a project that contains a `package.json` file with scripts or `.vscode/tasks.json` file
2. Look for the "Run Task" button in the status bar (bottom of VSCode)
3. Click the button to open the dropdown menu
4. Select "Select npm Tasks" or "Select VSCode Tasks" to choose which tasks to display

### Running Tasks

1. Click the "Run Task" button in the status bar
2. Choose a task from the dropdown menu
3. The task will execute in a new terminal tab

### Managing Selected Tasks

1. Click "Run Task" → "Select npm Tasks" or "Select VSCode Tasks"
2. Check/uncheck tasks you want to show in the dropdown
3. Click OK to save your selection

## Configuration

The extension stores your task selections in the workspace configuration. You can also manually edit the settings:

```json
{
  "scriptsLauncher.selectedTasks": [
    "build",
    "test",
    "start"
  ],
  "scriptsLauncher.selectedVSCodeTasks": [
    "compile",
    "watch"
  ]
}
```

## Requirements

- Visual Studio Code 1.74.0 or higher
- A project with a `package.json` file containing scripts and/or `.vscode/tasks.json` file
- Node.js and npm installed (for npm task execution)

## Extension Settings

This extension contributes the following settings:

- `scriptsLauncher.selectedTasks`: Array of npm task names to show in the dropdown menu
- `scriptsLauncher.selectedVSCodeTasks`: Array of VSCode task names to show in the dropdown menu

## Known Issues

- npm tasks must be defined in the root `package.json` file
- VSCode tasks must be defined in `.vscode/tasks.json` file
- Only npm tasks are currently supported for package.json (yarn/pnpm support planned)

## Release Notes

### 1.0.0

Initial release of Tasks Launcher

- Status bar button with dropdown menu
- Task selection interface for npm and VSCode tasks
- Terminal integration for task execution
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