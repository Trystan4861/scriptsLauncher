# Development Guide

## Prerequisites

- Node.js (version 16 or higher)
- Visual Studio Code
- Git

## Setup

1. Clone the repository:
```bash
git clone https://github.com/trystan4861/scripts-launcher.git
cd scripts-launcher
```

2. Install dependencies:
```bash
npm install
```

3. Open in VSCode:
```bash
code .
```

## Development Workflow

### Building the Extension

Compile TypeScript to JavaScript:
```bash
npm run compile
```

For continuous compilation during development:
```bash
npm run watch
```

### Running Tests

Execute all tests:
```bash
npm test
```

Run linting:
```bash
npm run lint
```

### Testing the Extension

1. Press `F5` in VSCode to open a new Extension Development Host window
2. The extension will be loaded and active in the new window
3. Open a project with a package.json file
4. Look for the "Run Task" button in the status bar

### Debugging

1. Set breakpoints in the TypeScript source files
2. Press `F5` to start debugging
3. The debugger will attach to the Extension Development Host

## Project Structure

```
scripts-launcher/
├── src/
│   ├── extension.ts          # Main extension file
│   └── test/
│       ├── runTest.ts        # Test runner
│       └── suite/
│           ├── index.ts      # Test suite index
│           └── extension.test.ts # Unit tests
├── out/                      # Compiled JavaScript (generated)
├── documentation/            # Additional documentation
├── package.json             # Extension manifest
├── tsconfig.json           # TypeScript configuration
└── .eslintrc.json          # ESLint configuration
```

## Code Style

The project uses:
- TypeScript with strict mode enabled
- ESLint for code linting
- 2-space indentation
- Single quotes for strings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## Publishing

### Package the Extension

Create a .vsix package:
```bash
npm run package
```

### Publish to Marketplace

Publish to the VSCode Marketplace:
```bash
npm run publish
```

Note: You'll need to configure your publisher account and access token first.

## Troubleshooting

### Common Issues

1. **Extension not loading**: Check the console for errors in the Extension Development Host
2. **Tests failing**: Ensure all dependencies are installed and the workspace is properly configured
3. **Compilation errors**: Check TypeScript configuration and ensure all types are properly defined

### Debug Output

The extension logs important events to the VSCode output panel. Check the "Scripts Launcher" output channel for debugging information.