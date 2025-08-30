const {execSync} = require('child_process');
const fs = require('fs');
const ts = new Date().toISOString().replace(/[:.]/g,'-');
const out = `snapshots/ecc-${ts}.zip`;
execSync(`zip -qr ${out} . -x "node_modules/*" "snapshots/*" ".git/*"` , {stdio:'inherit'});
console.log('✅ Snapshot:', out);