/**
 * Test suite index for Scripts Launcher extension
 * Author: trystan4861
 */

import * as path from 'path';
const glob = require('glob');

export function run(): Promise<void> {
  // Importar Mocha dinámicamente
  const Mocha = require('mocha');
  
  // Crear instancia de Mocha
  const mocha = new Mocha({
    ui: 'tdd',
    color: true
  });

  const testsRoot = path.resolve(__dirname, '..');

  return new Promise((resolve, reject) => {
    glob('**/**.test.js', { cwd: testsRoot }, (err: Error | null, files: string[]) => {
      if (err) {
        return reject(err);
      }

      // Agregar archivos al conjunto de pruebas
      files.forEach((f: string) => mocha.addFile(path.resolve(testsRoot, f)));

      try {
        // Ejecutar las pruebas de Mocha
        mocha.run((failures: number) => {
          if (failures > 0) {
            reject(new Error(`${failures} tests failed.`));
          } else {
            resolve();
          }
        });
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  });
}