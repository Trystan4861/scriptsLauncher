/**
 * Unit tests for Scripts Launcher extension
 * Author: trystan4861
 */

import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('Extension should be present', () => {
    assert.ok(vscode.extensions.getExtension('trystan4861.scripts-launcher'));
  });

  test('Extension should activate', async () => {
    const extension = vscode.extensions.getExtension('trystan4861.scripts-launcher');
    assert.ok(extension);
    
    if (!extension.isActive) {
      await extension.activate();
    }
    
    assert.ok(extension.isActive);
  });

  test('Commands should be registered', async () => {
    const commands = await vscode.commands.getCommands(true);
    
    assert.ok(commands.includes('scriptsLauncher.selectTasks'));
    assert.ok(commands.includes('scriptsLauncher.runTask'));
  });

  test('Configuration should have default values', () => {
    const config = vscode.workspace.getConfiguration('scriptsLauncher');
    const selectedTasks = config.get('selectedTasks');
    
    assert.ok(Array.isArray(selectedTasks));
    assert.strictEqual(selectedTasks.length, 0);
  });
});

suite('Package.json Parser Tests', () => {
  const testWorkspaceRoot = path.join(__dirname, '..', '..', '..', 'test-workspace');
  
  suiteSetup(() => {
    // Crear directorio de prueba
    if (!fs.existsSync(testWorkspaceRoot)) {
      fs.mkdirSync(testWorkspaceRoot, { recursive: true });
    }
  });

  suiteTeardown(() => {
    // Limpiar directorio de prueba
    if (fs.existsSync(testWorkspaceRoot)) {
      fs.rmSync(testWorkspaceRoot, { recursive: true, force: true });
    }
  });

  test('Should parse package.json with scripts', () => {
    const packageJsonPath = path.join(testWorkspaceRoot, 'package.json');
    const testPackageJson = {
      name: 'test-project',
      scripts: {
        'build': 'tsc',
        'test': 'mocha',
        'start': 'node index.js'
      }
    };

    fs.writeFileSync(packageJsonPath, JSON.stringify(testPackageJson, null, 2));

    // Verificar que el archivo existe
    assert.ok(fs.existsSync(packageJsonPath));

    // Leer y parsear el archivo
    const content = fs.readFileSync(packageJsonPath, 'utf8');
    const parsed = JSON.parse(content);

    assert.ok(parsed.scripts);
    assert.strictEqual(Object.keys(parsed.scripts).length, 3);
    assert.strictEqual(parsed.scripts.build, 'tsc');
    assert.strictEqual(parsed.scripts.test, 'mocha');
    assert.strictEqual(parsed.scripts.start, 'node index.js');
  });

  test('Should handle package.json without scripts', () => {
    const packageJsonPath = path.join(testWorkspaceRoot, 'package-no-scripts.json');
    const testPackageJson = {
      name: 'test-project-no-scripts',
      version: '1.0.0'
    };

    fs.writeFileSync(packageJsonPath, JSON.stringify(testPackageJson, null, 2));

    const content = fs.readFileSync(packageJsonPath, 'utf8');
    const parsed = JSON.parse(content);

    assert.strictEqual(parsed.scripts, undefined);
  });

  test('Should handle invalid JSON', () => {
    const packageJsonPath = path.join(testWorkspaceRoot, 'invalid-package.json');
    fs.writeFileSync(packageJsonPath, '{ invalid json }');

    assert.throws(() => {
      const content = fs.readFileSync(packageJsonPath, 'utf8');
      JSON.parse(content);
    });
  });
});