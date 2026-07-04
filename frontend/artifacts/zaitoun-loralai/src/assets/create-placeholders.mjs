#!/usr/bin/env node
/**
 * Create placeholder PNG images for missing asset files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Minimal valid PNG: 1x1 transparent pixel
const minimalPNG = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG signature
  0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
  0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41, // IDAT chunk
  0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
  0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00,
  0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, // IEND chunk
  0x42, 0x60, 0x82
]);

const placeholders = [
  'naqeeb_professional_1782757630343.png',
  '500_ml_Bottle_1782771142355.png',
  'Official_Logo_1782757596768.png',
  '250_ml_Bottle_1782790472883.png',
  '500_ml_Bottle_1782790552258.png',
  'Can_300_ml_1782790980890.png',
  '500_ml_can_1782791441460.png',
];

placeholders.forEach(filename => {
  const filePath = path.join(__dirname, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, minimalPNG);
    console.log(`Created placeholder: ${filename}`);
  }
});

console.log('Placeholder creation complete');
