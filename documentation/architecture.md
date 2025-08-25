# Tasks Launcher Extension Architecture

## Overview

The Tasks Launcher extension provides a convenient way to execute npm tasks and VSCode tasks from a VSCode status bar dropdown menu. This document outlines the extension's architecture and design decisions.

## Core Components

### 1. Extension Entry Point (`extension.ts`)

The main extension file that handles:
- Extension activation and deactivation
- Command registration
- Status bar item creation and management

### 2. Status Bar Integration

- Creates a status bar item with the text "Run Task"
- Positioned on the left side of the status bar
- Clicking the item opens the tasks dropdown menu

### 3. Command System

The extension registers five main commands:

#### `scriptsLauncher.showMenu`
- Displays the main dropdown menu
- Shows selected npm tasks and VSCode tasks with visual differentiation
- Shows configuration options for both task types
- Handles user selection and routing to appropriate execution or configuration commands

#### `scriptsLauncher.selectTasks`
- Opens the npm task selection interface
- Reads available scripts from package.json
- Allows users to select which npm tasks appear in the dropdown
- Saves selections to workspace configuration under `selectedTasks`

#### `scriptsLauncher.selectVSCodeTasks`
- Opens the VSCode task selection interface
- Reads available tasks from .vscode/tasks.json
- Parses JSONC format (supports comments)
- Allows users to select which VSCode tasks appear in the dropdown
- Saves selections to workspace configuration under `selectedVSCodeTasks`

#### `scriptsLauncher.runTask`
- Executes the selected npm task
- Creates a new terminal instance
- Runs the npm command in the workspace root directory

#### `scriptsLauncher.runVSCodeTask`
- Executes the selected VSCode task
- Uses VSCode's native Task API for execution
- Supports various task types (npm, shell, etc.)
- Handles task definitions and problem matchers

### 4. Configuration Management

Uses VSCode's configuration system to store:
- `scriptsLauncher.selectedTasks`: Array of selected npm task names
- `scriptsLauncher.selectedVSCodeTasks`: Array of selected VSCode task names

Configuration is stored at the workspace level, allowing different task selections per project.

### 5. File Integration

#### Package.json Integration
The extension:
- Automatically locates package.json in the workspace root
- Parses the scripts section for npm tasks
- Handles missing or invalid package.json files gracefully

#### VSCode Tasks Integration
The extension:
- Automatically locates .vscode/tasks.json in the workspace
- Parses JSONC format with comment support
- Handles various task types (npm, shell, process, etc.)
- Resolves task names intelligently (uses label, or generates from type/script/command)
- Handles missing or invalid tasks.json files gracefully

## Data Flow

### Main Execution Flow
1. **Activation**: Extension activates on startup
2. **Status Bar**: User clicks the "Run Task" button
3. **Menu Display**: Extension shows dropdown with selected npm tasks and VSCode tasks (with visual differentiation)
4. **Task Selection**: User chooses a task or opens task configuration
5. **Execution**: Extension executes the selected task using appropriate method:
   - npm tasks: Creates terminal and runs npm command
   - VSCode tasks: Uses VSCode Task API for native execution

### Configuration Flow
1. **Task Selection Interface**: User selects "Select npm Tasks" or "Select VSCode Tasks"
2. **File Reading**: Extension reads package.json or .vscode/tasks.json
3. **Task Parsing**: Available tasks are parsed and presented in selection interface
4. **User Selection**: User checks/unchecks desired tasks
5. **Configuration Save**: Selections are saved to workspace configuration

## Error Handling

The extension includes comprehensive error handling for:

### npm Tasks
- Missing package.json files
- Invalid JSON parsing in package.json
- Missing workspace folders
- Empty scripts sections

### VSCode Tasks
- Missing .vscode/tasks.json files
- Invalid JSONC parsing (with comment support)
- Malformed task definitions
- Missing task properties (type, command, etc.)
- Task execution failures

### General
- Workspace configuration errors
- Command registration failures
- Status bar integration issues

## Testing Strategy

### Unit Tests
- Extension activation and command registration
- Configuration management for both task types
- Package.json parsing and script extraction
- Tasks.json parsing with JSONC support
- Task name resolution logic
- Error handling scenarios for both npm and VSCode tasks

### Integration Tests
- Full workflow testing for npm tasks
- Full workflow testing for VSCode tasks
- VSCode API integration (Task API, Terminal API)
- Terminal creation and npm command execution
- VSCode task execution via Task API
- Configuration persistence and retrieval

## Technical Implementation Details

### Key Interfaces

#### `NpmTaskItem`
```typescript
interface NpmTaskItem extends vscode.QuickPickItem {
  taskName: string;
}
```

#### `VSCodeTask`
```typescript
interface VSCodeTask {
  type: string;
  script?: string;
  label?: string;
  command?: string;
  args?: string[];
  group?: string | { kind: string; isDefault?: boolean };
  problemMatcher?: string | string[];
  isBackground?: boolean;
  presentation?: { ... };
}
```

#### `VSCodeTaskItem`
```typescript
interface VSCodeTaskItem extends vscode.QuickPickItem {
  taskName: string;
  task: VSCodeTask;
}
```

### Core Functions

#### Task Discovery
- `findPackageJson()`: Locates package.json in workspace root
- `findTasksJson()`: Locates .vscode/tasks.json in workspace
- `readPackageJson()`: Parses package.json and extracts scripts
- `readTasksJson()`: Parses tasks.json with JSONC comment support

#### Task Name Resolution
- `getTaskName()`: Intelligently resolves task names from VSCode task definitions
- `getTaskDescription()`: Generates human-readable task descriptions

#### Task Execution
- `runTask()`: Executes npm tasks via terminal
- `runVSCodeTask()`: Executes VSCode tasks via Task API

#### JSONC Support
- `stripJsonComments()`: Removes comments from tasks.json for parsing

## Future Enhancements

Potential areas for improvement:
- Support for other package managers (yarn, pnpm)
- Custom task grouping and categorization
- Task execution history and favorites
- Keyboard shortcuts for frequently used tasks
- Task dependency visualization
- Multi-workspace support
- Enhanced task filtering and search
- Task templates and sharing