// Guardrail: fail if ops files change without approval
import { createHash } from 'crypto';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const files = ['.replit','package.json','replit.nix','vite.config.ts','vite.config.js'];
const stampPath = 'scripts/ops-freeze.json';

function sha(s){ return createHash('sha1').update(s).digest('hex'); }

const mode = process.argv.includes('--record') ? 'record' : 'check';

if (mode==='record'){
  const stamp = {};
  for (const f of files){
    try { stamp[f] = sha(readFileSync(f,'utf8')); } catch { stamp[f] = null; }
  }
  writeFileSync(stampPath, JSON.stringify(stamp,null,2));
  console.log('Recorded ops-freeze baseline.');
  process.exit(0);
}

if (!existsSync(stampPath)){
  console.error('ops-freeze baseline missing. Run: node scripts/ops-freeze.mjs --record');
  process.exit(2);
}

const baseline = JSON.parse(readFileSync(stampPath,'utf8'));
let bad = false;
for (const f of files){
  const curr = (()=>{ try{return sha(readFileSync(f,'utf8'))}catch{return null} })();
  const base = baseline[f] ?? null;
  if (curr !== base){
    bad = true;
    console.error(`UNAUTHORIZED_CHANGE: ${f}`);
  }
}
if (bad) process.exit(3);
console.log('Ops freeze check passed.');