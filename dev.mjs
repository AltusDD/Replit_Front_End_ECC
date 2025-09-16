#!/usr/bin/env node
import { spawn } from 'child_process';

console.log('🚀 Starting ECC development servers...\n');

// Start Vite dev server (frontend)
const viteProcess = spawn('npx', ['vite', '--strictPort', '--port=5174'], {
  stdio: 'inherit',
  cwd: process.cwd()
});

// Start Express API server (backend)  
const apiProcess = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'inherit',
  cwd: process.cwd()
});

// Handle cleanup
const cleanup = () => {
  console.log('\n🛑 Shutting down servers...');
  viteProcess.kill();
  apiProcess.kill();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);

viteProcess.on('close', (code) => {
  console.log(`Vite process exited with code ${code}`);
  cleanup();
});

apiProcess.on('close', (code) => {
  console.log(`API process exited with code ${code}`);
  cleanup();
});