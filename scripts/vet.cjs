
const fs = require('fs');
function fail(msg) {
  console.error('Vet failed: ' + msg);
  process.exit(1);
}
const theme = fs.readFileSync('./src/styles/theme.css', 'utf8');
['--gold','--bg','--panel'].forEach(tok=>{
  if(!theme.includes(tok)) fail('Brand token missing: ' + tok);
});
const searchDir = './src/components';
function scan(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = dir + '/' + file;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) return scan(fullPath);
    if (!file.endsWith('.tsx')) return;
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes("import './") || content.includes('import "./')) {
      fail('Rogue CSS import: ' + fullPath);
    }
  });
}
scan(searchDir);
