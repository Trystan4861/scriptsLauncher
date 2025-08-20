# Scripts Launcher Extension - Development Setup
# Author: trystan4861

Write-Host "Setting up Scripts Launcher Extension for development..." -ForegroundColor Green

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# Compile TypeScript
Write-Host "Compiling TypeScript..." -ForegroundColor Yellow
npm run compile

# Run linting
Write-Host "Running ESLint..." -ForegroundColor Yellow
npm run lint

# Run tests
Write-Host "Running tests..." -ForegroundColor Yellow
npm test

Write-Host "Development setup complete!" -ForegroundColor Green
Write-Host "To start developing:" -ForegroundColor Cyan
Write-Host "1. Open this folder in VSCode" -ForegroundColor White
Write-Host "2. Press F5 to launch Extension Development Host" -ForegroundColor White
Write-Host "3. Open a project with package.json in the new window" -ForegroundColor White
Write-Host "4. Look for 'Ejecutar tarea' button in the status bar" -ForegroundColor White