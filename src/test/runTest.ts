/**
 * Test runner configuration for Scripts Launcher extension
 * Author: trystan4861
 */

import * as path from 'path';
import { runTests } from '@vscode/test-electron';

async function main() {
  try {
    // Ruta al directorio que contiene el package.json de la extensión
    const extensionDevelopmentPath = path.resolve(__dirname, '../../');

    // Ruta al directorio de pruebas
    const extensionTestsPath = path.resolve(__dirname, './suite/index');

    // Descargar VS Code, descomprimirlo y ejecutar las pruebas de integración
    await runTests({ extensionDevelopmentPath, extensionTestsPath });
  } catch (err) {
    console.error('Failed to run tests');
    process.exit(1);
  }
}

main();