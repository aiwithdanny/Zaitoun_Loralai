#!/usr/bin/env node
/**
 * Preinstall hook - cross-platform compatible
 * - Removes package-lock.json and yarn.lock
 * - Enforces pnpm usage
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Remove package-lock.json and yarn.lock if they exist
const filesToRemove = ['package-lock.json', 'yarn.lock'];
filesToRemove.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Removed ${file}`);
    }
  } catch (err) {
    console.error(`Failed to remove ${file}:`, err.message);
  }
});

// Check if running with pnpm
const userAgent = process.env.npm_config_user_agent || '';
if (!userAgent.includes('pnpm/')) {
  console.error('Error: You must use pnpm to install dependencies.');
  console.error('Install pnpm: https://pnpm.io/installation');
  process.exit(1);
}

console.log('Preinstall check passed: pnpm detected');
