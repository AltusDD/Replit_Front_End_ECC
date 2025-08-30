#!/usr/bin/env node

// Basic validation script to check project setup
import { existsSync } from 'fs';
import { resolve } from 'path';

const requiredFiles = [
  'package.json',
  'vite.config.mjs',
  'tailwind.config.ts'
];

let hasErrors = false;

console.log('🔍 Running project validation...');

// Check required files exist
requiredFiles.forEach(file => {
  if (!existsSync(resolve(file))) {
    console.error(`❌ Missing required file: ${file}`);
    hasErrors = true;
  } else {
    console.log(`✅ Found: ${file}`);
  }
});

if (hasErrors) {
  console.error('❌ Project validation failed!');
  process.exit(1);
} else {
  console.log('✅ Project validation passed!');
}