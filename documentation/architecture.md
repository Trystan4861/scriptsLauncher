# Scripts Launcher Extension Architecture

## Overview

The Scripts Launcher extension provides a convenient way to execute npm scripts from a VSCode status bar dropdown menu. This document outlines the extension's architecture and design decisions.

## Core Components

### 1. Extension Entry Point (`extension.ts`)

The main extension file that handles:
- Extension activation and deactivation
- Command registration
- Status bar item creation and management

### 2. Status Bar Integration

- Creates a status bar item with the text "Run Task"
- Positioned on the left side of the status bar
- Clicking the item opens the scripts dropdown menu

### 3. Command System

The extension registers three main commands:

#### `scriptsLauncher.showMenu`
- Displays the main dropdown menu
- Shows selected scripts and configuration option
- Handles user selection and routing

#### `scriptsLauncher.selectTasks`
- Opens the task selection interface
- Reads available scripts from package.json
- Allows users to select which scripts appear in the dropdown
- Saves selections to workspace configuration

#### `scriptsLauncher.runScript`
- Executes the selected npm script
- Creates a new terminal instance
- Runs the script in the workspace root directory

### 4. Configuration Management

Uses VSCode's configuration system to store:
- `scriptsLauncher.selectedScripts`: Array of selected script names

Configuration is stored at the workspace level, allowing different selections per project.

### 5. Package.json Integration

The extension:
- Automatically locates package.json in the workspace root
- Parses the scripts section
- Handles missing or invalid package.json files gracefully

## Data Flow

1. **Activation**: Extension activates on startup
2. **Status Bar**: User clicks the "Run Task" button
3. **Menu Display**: Extension shows dropdown with selected scripts
4. **Script Selection**: User chooses a script or opens task selection
5. **Execution**: Extension creates terminal and runs the npm command

## Error Handling

The extension includes comprehensive error handling for:
- Missing package.json files
- Invalid JSON parsing
- Missing workspace folders
- Empty scripts sections

## Testing Strategy

### Unit Tests
- Extension activation and command registration
- Configuration management
- Package.json parsing
- Error handling scenarios

### Integration Tests
- Full workflow testing
- VSCode API integration
- Terminal creation and command execution

## Future Enhancements

Potential areas for improvement:
- Support for other package managers (yarn, pnpm)
- Custom script grouping
- Script execution history
- Keyboard shortcuts for frequently used scripts