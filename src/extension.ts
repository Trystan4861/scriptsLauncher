/**
 * Tasks Launcher VSCode Extension
 * Provides a status bar button with dropdown menu for running npm tasks and VSCode tasks
 * Author: trystan4861
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface PackageJson {
  scripts?: { [key: string]: string };
}

interface NpmTaskItem extends vscode.QuickPickItem {
  taskName: string;
}

interface VSCodeTask {
  type: string;
  script?: string;
  label?: string;
  command?: string;
  args?: string[];
  group?: string | { kind: string; isDefault?: boolean };
  problemMatcher?: string | string[];
  isBackground?: boolean;
  presentation?: {
    reveal?: string;
    focus?: boolean;
    panel?: string;
    showReuseMessage?: boolean;
    clear?: boolean;
  };
}

interface TasksJson {
  version: string;
  tasks: VSCodeTask[];
}

interface VSCodeTaskItem extends vscode.QuickPickItem {
  taskName: string;
  task: VSCodeTask;
}

export function activate(context: vscode.ExtensionContext) {
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  
  statusBarItem.text = ' Run Tasks';
  statusBarItem.tooltip = 'Execute npm tasks and VSCode tasks';
  statusBarItem.command = 'scriptsLauncher.showMenu';
  statusBarItem.show();

  // Registrar comando para mostrar el menú
  const showMenuCommand = vscode.commands.registerCommand(
    'scriptsLauncher.showMenu',
    () => showScriptsMenu(context)
  );

  // Registrar comando para seleccionar tareas npm
  const selectTasksCommand = vscode.commands.registerCommand(
    'scriptsLauncher.selectTasks',
    () => selectTasks(context)
  );

  // Registrar comando para seleccionar tareas VSCode
  const selectVSCodeTasksCommand = vscode.commands.registerCommand(
    'scriptsLauncher.selectVSCodeTasks',
    () => selectVSCodeTasks(context)
  );

  // Registrar comando para ejecutar script npm
  const runTaskCommand = vscode.commands.registerCommand(
    'scriptsLauncher.runTask',
    (scriptName: string) => runTask(scriptName)
  );

  // Registrar comando para ejecutar tarea VSCode
  const runVSCodeTaskCommand = vscode.commands.registerCommand(
    'scriptsLauncher.runVSCodeTask',
    (taskName: string) => runVSCodeTask(taskName)
  );

  context.subscriptions.push(
    statusBarItem,
    showMenuCommand,
    selectTasksCommand,
    selectVSCodeTasksCommand,
    runTaskCommand,
    runVSCodeTaskCommand
  );
}

async function showScriptsMenu(context: vscode.ExtensionContext): Promise<void> {
  const config = vscode.workspace.getConfiguration('scriptsLauncher');
  const selectedNpmTasks: string[] = config.get('selectedTasks', []);
  const selectedVSCodeTasks: string[] = config.get('selectedVSCodeTasks', []);
  
  const menuItems: vscode.QuickPickItem[] = [];
  
  // Agregar tareas npm seleccionadas
  if (selectedNpmTasks.length > 0) {
    selectedNpmTasks.forEach(taskName => {
      menuItems.push({
        label: `$(play) ${taskName}`,
        description: 'Run npm task',
        detail: `npm run ${taskName}`
      });
    });
  }
  
  // Agregar tareas VSCode seleccionadas
  if (selectedVSCodeTasks.length > 0) {
    const tasksJson = readTasksJson();
    if (tasksJson) {
      selectedVSCodeTasks.forEach(taskName => {
        const task = tasksJson.tasks.find(t => getTaskName(t) === taskName);
        if (task) {
          menuItems.push({
            label: `$(tools) ${taskName}`,
            description: 'Run VSCode task',
            detail: getTaskDescription(task)
          });
        }
      });
    }
  }
  
  // Separador si hay tareas seleccionadas
  if (selectedNpmTasks.length > 0 || selectedVSCodeTasks.length > 0) {
    menuItems.push({
      label: '',
      kind: vscode.QuickPickItemKind.Separator
    });
  }
  
  // Opciones para seleccionar tareas
  const packageJsonExists = findPackageJson() !== null;
  const tasksJsonExists = findTasksJson() !== null;
  
  if (packageJsonExists) {
    menuItems.push({
      label: `$(gear) Select npm Tasks`,
      description: 'Configure npm tasks to show',
      detail: 'Choose from package.json scripts'
    });
  } else {
    menuItems.push({
      label: `$(gear) Select npm Tasks`,
      description: 'package.json not found',
      detail: 'No package.json file exists in workspace root'
    });
  }
  
  if (tasksJsonExists) {
    menuItems.push({
      label: `$(settings-gear) Select VSCode Tasks`,
      description: 'Configure VSCode tasks to show',
      detail: 'Choose from .vscode/tasks.json'
    });
  } else {
    menuItems.push({
      label: `$(settings-gear) Select VSCode Tasks`,
      description: '.vscode/tasks.json not found',
      detail: 'No .vscode/tasks.json file exists in workspace'
    });
  }

  const selectedItem = await vscode.window.showQuickPick(menuItems, {
    placeHolder: 'Choose an action'
  });

  if (!selectedItem) {
    return;
  }

  if (selectedItem.label.includes('Select npm Tasks')) {
    // Verificar si existe package.json antes de ejecutar
    if (packageJsonExists) {
      await vscode.commands.executeCommand('scriptsLauncher.selectTasks');
    }
    // Si no existe, no hacer nada (el usuario ya ve que no está disponible)
  } else if (selectedItem.label.includes('Select VSCode Tasks')) {
    // Verificar si existe tasks.json antes de ejecutar
    if (tasksJsonExists) {
      await vscode.commands.executeCommand('scriptsLauncher.selectVSCodeTasks');
    }
    // Si no existe, no hacer nada (el usuario ya ve que no está disponible)
  } else if (selectedItem.label.includes('$(play)')) {
    // Ejecutar tarea npm
    const taskName = selectedItem.label.replace('$(play) ', '');
    await vscode.commands.executeCommand('scriptsLauncher.runTask', taskName);
  } else if (selectedItem.label.includes('$(tools)')) {
    // Ejecutar tarea VSCode
    const taskName = selectedItem.label.replace('$(tools) ', '');
    await vscode.commands.executeCommand('scriptsLauncher.runVSCodeTask', taskName);
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
  const currentSelected: string[] = config.get('selectedTasks', []);
  
  const taskItems: NpmTaskItem[] = Object.keys(packageJson.scripts).map(taskName => ({
    label: taskName,
    description: packageJson.scripts![taskName],
    picked: currentSelected.includes(taskName),
    taskName
  }));

  const selectedItems = await vscode.window.showQuickPick(taskItems, {
    canPickMany: true,
    placeHolder: 'Select tasks to show in the dropdown menu'
  });

  if (selectedItems) {
    const selectedTaskNames = selectedItems.map(item => item.taskName);
    await config.update('selectedTasks', selectedTaskNames, vscode.ConfigurationTarget.Workspace);
    
    const message = selectedTaskNames.length > 0 
      ? `Selected ${selectedTaskNames.length} task(s)`
      : 'No tasks selected';
    vscode.window.showInformationMessage(message);
  }
}

async function runTask(taskName: string): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('No workspace folder found');
    return;
  }

  // Crear y mostrar terminal
  const terminal = vscode.window.createTerminal({
    name: `npm run ${taskName}`,
    cwd: workspaceFolder.uri.fsPath
  });
  
  terminal.show();
  terminal.sendText(`npm run ${taskName}`);
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

function findTasksJson(): string | null {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  
  if (!workspaceFolder) {
    return null;
  }

  const tasksJsonPath = path.join(workspaceFolder.uri.fsPath, '.vscode', 'tasks.json');
  
  if (fs.existsSync(tasksJsonPath)) {
    return tasksJsonPath;
  }

  return null;
}

function stripJsonComments(jsonString: string): string {
  // Eliminar comentarios de línea (//)
  let result = jsonString.replace(/\/\/.*$/gm, '');
  
  // Eliminar comentarios de bloque (/* */)
  result = result.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Limpiar líneas vacías y espacios extra
  result = result.replace(/^\s*[\r\n]/gm, '');
  
  return result;
}

function readTasksJson(): TasksJson | null {
  const tasksJsonPath = findTasksJson();
  
  if (!tasksJsonPath) {
    return null;
  }

  try {
    const content = fs.readFileSync(tasksJsonPath, 'utf8');
    const cleanContent = stripJsonComments(content);
    return JSON.parse(cleanContent) as TasksJson;
  } catch (error) {
    vscode.window.showErrorMessage(`Error reading tasks.json: ${error}`);
    return null;
  }
}

function getTaskName(task: VSCodeTask): string {
  if (task.label) {
    return task.label;
  }
  
  if (task.type === 'npm' && task.script) {
    return `npm: ${task.script}`;
  }
  
  if (task.command) {
    return task.command;
  }
  
  return `${task.type} task`;
}

function getTaskDescription(task: VSCodeTask): string {
  if (task.type === 'npm' && task.script) {
    return `npm run ${task.script}`;
  }
  
  if (task.command) {
    const args = task.args ? ` ${task.args.join(' ')}` : '';
    return `${task.command}${args}`;
  }
  
  return `${task.type} task`;
}

async function selectVSCodeTasks(context: vscode.ExtensionContext): Promise<void> {
  const tasksJson = readTasksJson();
  
  if (!tasksJson) {
    vscode.window.showErrorMessage('No .vscode/tasks.json found in workspace');
    return;
  }

  if (!tasksJson.tasks || tasksJson.tasks.length === 0) {
    vscode.window.showInformationMessage('No tasks found in .vscode/tasks.json');
    return;
  }

  const config = vscode.workspace.getConfiguration('scriptsLauncher');
  const currentSelected: string[] = config.get('selectedVSCodeTasks', []);
  
  const taskItems: VSCodeTaskItem[] = tasksJson.tasks.map(task => {
    const taskName = getTaskName(task);
    return {
      label: taskName,
      description: getTaskDescription(task),
      picked: currentSelected.includes(taskName),
      taskName,
      task
    };
  });

  const selectedItems = await vscode.window.showQuickPick(taskItems, {
    canPickMany: true,
    placeHolder: 'Select VSCode tasks to show in the dropdown menu'
  });

  if (selectedItems) {
    const selectedTaskNames = selectedItems.map(item => item.taskName);
    await config.update('selectedVSCodeTasks', selectedTaskNames, vscode.ConfigurationTarget.Workspace);
    
    const message = selectedTaskNames.length > 0 
      ? `Selected ${selectedTaskNames.length} VSCode task(s)`
      : 'No VSCode tasks selected';
    vscode.window.showInformationMessage(message);
  }
}

async function runVSCodeTask(taskName: string): Promise<void> {
  const tasksJson = readTasksJson();
  
  if (!tasksJson) {
    vscode.window.showErrorMessage('No .vscode/tasks.json found');
    return;
  }

  const task = tasksJson.tasks.find(t => getTaskName(t) === taskName);
  
  if (!task) {
    vscode.window.showErrorMessage(`Task "${taskName}" not found in tasks.json`);
    return;
  }

  // Usar la API de tareas de VSCode para ejecutar la tarea
  try {
    const taskDefinition: vscode.TaskDefinition = {
      type: task.type
    };

    // Agregar propiedades específicas según el tipo de tarea
    if (task.type === 'npm' && task.script) {
      taskDefinition.script = task.script;
    }

    let execution: vscode.TaskExecution;
    
    if (task.type === 'npm' && task.script) {
      // Para tareas npm, usar ShellExecution
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        vscode.window.showErrorMessage('No workspace folder found');
        return;
      }
      
      const shellExecution = new vscode.ShellExecution(`npm run ${task.script}`, {
        cwd: workspaceFolder.uri.fsPath
      });
      
      const vsTask = new vscode.Task(
        taskDefinition,
        workspaceFolder,
        taskName,
        task.type,
        shellExecution,
        task.problemMatcher
      );
      
      execution = await vscode.tasks.executeTask(vsTask);
    } else if (task.command) {
      // Para otras tareas con comando
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        vscode.window.showErrorMessage('No workspace folder found');
        return;
      }
      
      const shellExecution = new vscode.ShellExecution(task.command, task.args || [], {
        cwd: workspaceFolder.uri.fsPath
      });
      
      const vsTask = new vscode.Task(
        taskDefinition,
        workspaceFolder,
        taskName,
        task.type,
        shellExecution,
        task.problemMatcher
      );
      
      execution = await vscode.tasks.executeTask(vsTask);
    } else {
      // Intentar ejecutar usando la definición completa de la tarea
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        vscode.window.showErrorMessage('No workspace folder found');
        return;
      }
      
      const vsTask = new vscode.Task(
        taskDefinition,
        workspaceFolder,
        taskName,
        task.type
      );
      
      execution = await vscode.tasks.executeTask(vsTask);
    }
    
    vscode.window.showInformationMessage(`Started task: ${taskName}`);
  } catch (error) {
    vscode.window.showErrorMessage(`Error running task "${taskName}": ${error}`);
  }
}

export function deactivate() {
  // Cleanup si es necesario
}