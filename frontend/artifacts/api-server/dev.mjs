#!/usr/bin/env node
/**
 * Development server script - cross-platform compatible
 * Sets NODE_ENV=development and runs build + start
 */

import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Set development environment
process.env.NODE_ENV = 'development';

// Set default PORT if not already set
if (!process.env.PORT) {
  process.env.PORT = '8000';
}

async function runCommand(cmd, args = []) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, {
      stdio: 'inherit',
      shell: true,
      cwd: __dirname,
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    proc.on('error', reject);
  });
}

async function dev() {
  try {
    console.log('Building...');
    await runCommand('pnpm', ['run', 'build']);

    console.log('Starting server...');
    await runCommand('pnpm', ['run', 'start']);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

dev();
