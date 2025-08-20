/**
 * Scripts Launcher VSCode Extension
 * Provides a status bar button with dropdown menu for running npm scripts
 * Author: trystan4861
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface PackageJson {
  scripts?: { [key: string]: string };
}

interface ScriptItem extends vscode.QuickPickItem {
  scriptName: string;
}

export function activate(context: vscode.ExtensionContext) {
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  
  statusBarItem.text = 'Ejecutar tarea';
  statusBarItem.tooltip = 'Execute npm scripts';
  statusBarItem.command = 'scriptsLauncher.showMenu';
  statusBarItem.show();

  // Registrar comando para mostrar el menú
  const showMenuCommand = vscode.commands.registerCommand(
    'scriptsLauncher.showMenu',
    () => showScriptsMenu(context)
  );

  // Registrar comando para seleccionar tareas
  const selectTasksCommand = vscode.commands.registerCommand(
    'scriptsLauncher.selectTasks',
    () => selectTasks(context)
  );

  // Registrar comando para ejecutar script
  const runScriptCommand = vscode.commands.registerCommand(
    'scriptsLauncher.runScript',
    (scriptName: string) => runScript(scriptName)
  );

  context.subscriptions.push(
    statusBarItem,
    showMenuCommand,
    selectTasksCommand,
    runScriptCommand
  );
}

async function showScriptsMenu(context: vscode.ExtensionContext): Promise<void> {
  const config = vscode.workspace.getConfiguration('scriptsLauncher');
  const selectedScripts: string[] = config.get('selectedScripts', []);
  
  const menuItems: vscode.QuickPickItem[] = [];
  
  // Agregar scripts seleccionados
  if (selectedScripts.length > 0) {
    selectedScripts.forEach(scriptName => {
      menuItems.push({
        label: `$(play) ${scriptName}`,
        description: 'Run npm script',
        detail: `npm run ${scriptName}`
      });
    });
    
    // Separador
    menuItems.push({
      label: '',
      kind: vscode.QuickPickItemKind.Separator
    });
  }
  
  // Opción para seleccionar tareas
  const selectTasksLabel = selectedScripts.length > 0 ? 'Selected Tasks' : 'Select Tasks';
  menuItems.push({
    label: `$(gear) ${selectTasksLabel}`,
    description: 'Configure which scripts to show',
    detail: 'Choose from package.json scripts'
  });

  const selectedItem = await vscode.window.showQuickPick(menuItems, {
    placeHolder: 'Choose an action'
  });

  if (!selectedItem) {
    return;
  }

  if (selectedItem.label.includes('$(gear)')) {
    // Abrir selección de tareas
    await vscode.commands.executeCommand('scriptsLauncher.selectTasks');
  } else if (selectedItem.label.includes('$(play)')) {
    // Ejecutar script
    const scriptName = selectedItem.label.replace('$(play) ', '');
    await vscode.commands.executeCommand('scriptsLauncher.runScript', scriptName);
  }
}

async function selectTasks(context: vscode.ExtensionContext): Promise<void> {
  const packageJsonPath = findPackageJson();
  
  if (!packageJsonPath) {
    vscode.window.showErrorMessage('No package.json found in workspace');
    return;
  }

  const packageJson = readPackageJson(packageJsonPath);
  
  if (!packageJson?.scripts) {
    vscode.window.showInformationMessage('No scripts found in package.json');
    return;
  }

  const config = vscode.workspace.getConfiguration('scriptsLauncher');
  const currentSelected: string[] = config.get('selectedScripts', []);
  
  const scriptItems: ScriptItem[] = Object.keys(packageJson.scripts).map(scriptName => ({
    label: scriptName,
    description: packageJson.scripts![scriptName],
    picked: currentSelected.includes(scriptName),
    scriptName
  }));

  const selectedItems = await vscode.window.showQuickPick(scriptItems, {
    canPickMany: true,
    placeHolder: 'Select scripts to show in the dropdown menu'
  });

  if (selectedItems) {
    const selectedScriptNames = selectedItems.map(item => item.scriptName);
    await config.update('selectedScripts', selectedScriptNames, vscode.ConfigurationTarget.Workspace);
    
    const message = selectedScriptNames.length > 0 
      ? `Selected ${selectedScriptNames.length} script(s)`
      : 'No scripts selected';
    vscode.window.showInformationMessage(message);
  }
}

async function runScript(scriptName: string): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('No workspace folder found');
    return;
  }

  // Crear y mostrar terminal
  const terminal = vscode.window.createTerminal({
    name: `npm run ${scriptName}`,
    cwd: workspaceFolder.uri.fsPath
  });
  
  terminal.show();
  terminal.sendText(`npm run ${scriptName}`);
}

function findPackageJson(): string | null {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  
  if (!workspaceFolder) {
    return null;
  }

  const packageJsonPath = path.join(workspaceFolder.uri.fsPath, 'package.json');
  
  if (fs.existsSync(packageJsonPath)) {
    return packageJsonPath;
  }

  return null;
}

function readPackageJson(packageJsonPath: string): PackageJson | null {
  try {
    const content = fs.readFileSync(packageJsonPath, 'utf8');
    return JSON.parse(content) as PackageJson;
  } catch (error) {
    vscode.window.showErrorMessage(`Error reading package.json: ${error}`);
    return null;
  }
}

export function deactivate() {
  // Cleanup si es necesario
}