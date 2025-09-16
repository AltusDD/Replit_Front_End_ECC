// scripts/dev-runner.mjs
import { spawn } from 'node:child_process';

function run(name, cmd, args) {
  const p = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'], env: process.env });
  p.stdout.on('data', d => process.stdout.write(`[${name}] ${d}`));
  p.stderr.on('data', d => process.stderr.write(`[${name}] ${d}`));
  p.on('close', code => console.log(`[${name}] exited ${code}`));
  return p;
}

const web = run('WEB', 'npm', ['run', 'dev:web']);
const api = run('API', 'npx', ['tsx', 'watch', 'server/index.ts']);

process.on('SIGINT', () => { web.kill('SIGINT'); api.kill('SIGINT'); process.exit(0); });
process.on('SIGTERM', () => { web.kill('SIGTERM'); api.kill('SIGTERM'); process.exit(0); });