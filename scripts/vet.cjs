const fs = require('fs'); const path = require('path');
const bad = [];
(function walk(dir){
  for (const n of fs.readdirSync(dir)) {
    if (n === 'node_modules' || n === '.git' || n.startsWith('.replit')) continue;
    const p = path.join(dir,n), s = fs.statSync(p);
    if (s.isDirectory()) walk(p);
    else if (/\.(tsx?|jsx?)$/.test(n)) {
      const src = fs.readFileSync(p,'utf8');
      // 1) forbid hardcoded /api usage
      if (/fetch\(\s*['"`]\/api/.test(src) || /new\s+URL\(\s*['"`]\/api/.test(src))
        bad.push([p,'Hardcoded /api (use @lib/ecc-api buildUrl/fetchJSON)']);
      // 2) forbid importing client any other way than @lib/ecc-api or @lib/api
      if (/from\s+['"`]\/?src\/lib\/ecc-api['"`]/.test(src) || /from\s+['"`]@\/lib\/ecc-api\.ts['"`]/.test(src))
        bad.push([p,'Wrong client import (use @lib/ecc-api or @lib/api)']);
    }
  }
})('src');
if (bad.length) {
  console.error('❌ VET FAILED:\n' + bad.map(([p,m]) => ` - ${p}: ${m}`).join('\n'));
  process.exit(1);
}
console.log('✅ Vet passed.');
