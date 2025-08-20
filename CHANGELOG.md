# Change Log

All notable changes to the "Scripts Launcher" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-01-20

### Added
- Initial release of Scripts Launcher extension
- Status bar button with "Run Task" text
- Dropdown menu for script selection and execution
- Script selection interface to choose which scripts appear in dropdown
- Terminal integration for script execution
- Workspace-level configuration for selected scripts
- Support for package.json script parsing
- Comprehensive error handling for missing or invalid package.json files
- Unit tests for core functionality
- Integration tests for VSCode API interaction
- TypeScript implementation with strict type checking
- ESLint configuration for code quality
- Documentation including architecture and development guides

### Features
- **Status Bar Integration**: Quick access button in VSCode status bar
- **Script Management**: Select which npm scripts to display in dropdown
- **One-Click Execution**: Run scripts directly from the dropdown menu
- **Terminal Integration**: Scripts execute in VSCode's integrated terminal
- **Workspace Configuration**: Different script selections per project
- **Error Handling**: Graceful handling of missing or invalid package.json files

### Technical Details
- Built with TypeScript for type safety
- Uses VSCode Extension API 1.74.0+
- Follows VSCode extension best practices
- Comprehensive test suite with Mocha
- Configurable via VSCode settings
- Supports workspace-level configuration storage

### Commands
- `scriptsLauncher.selectTasks`: Open script selection interface
- `scriptsLauncher.runScript`: Execute a specific npm script
- `scriptsLauncher.showMenu`: Display the main dropdown menu

### Configuration
- `scriptsLauncher.selectedScripts`: Array of selected script names

---

## Version History

### [1.0.0] - 2025-01-20
- Initial release with core functionality

---

## Future Releases

### Planned Features
- Support for yarn and pnpm package managers
- Custom script grouping and organization
- Script execution history
- Keyboard shortcuts for frequently used scripts
- Script output filtering and search
- Multi-workspace support
- Custom terminal naming patterns

### Under Consideration
- Script dependency visualization
- Pre/post script execution hooks
- Script performance monitoring
- Integration with task runners (Gulp, Webpack, etc.)
- Custom script templates
- Script sharing between team members