const fs = require('fs');
const path = require('path');

const bad = [];
(function walk(dir) {
  for (const n of fs.readdirSync(dir)) {
    if (n === 'node_modules' || n.startsWith('.')) continue;
    const p = path.join(dir, n);
    const s = fs.statSync(p);
    if (s.isDirectory()) walk(p);
    else if (/\.(tsx?|jsx?)$/.test(n)) {
      const src = fs.readFileSync(p, 'utf8');
      if (/fetch\(['"`]\/api/.test(src) || /new URL\(['"`]\/api/.test(src)) {
        bad.push([p, 'Hardcoded /api (use @lib/ecc-api buildUrl/fetchJSON)']);
      }
      if (/from ['"]\/src\/lib\/ecc-api['"]/.test(src) || /from ['"]@\/lib\/ecc-api\.ts['"]/.test(src)) {
        bad.push([p, 'Wrong client import (use @lib/ecc-api)']);
      }
    }
  }
})('src');

if (bad.length) {
  console.error('❌ VET FAILED:\n' + bad.map(([p, m]) => ` - ${p}: ${m}`).join('\n'));
  process.exit(1);
} else {
  console.log('✅ Vet passed.');
}
