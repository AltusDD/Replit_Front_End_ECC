const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
const src = path.join(root, 'src');

let badCssImport = false, badStyleTag = false;

function walk(p){
  for (const f of fs.readdirSync(p)){
    const fp = path.join(p,f);
    const st = fs.statSync(fp);
    if (st.isDirectory()) walk(fp);
    else if (/\.(tsx?|jsx?)$/.test(f)){
      const txt = fs.readFileSync(fp,'utf8');
      if (fp.includes(path.join('src','main.tsx'))) continue;
      if (/import\s+['"][^'"]+\.css['"]/.test(txt)) { console.log('❌ CSS import in', fp); badCssImport = true; }
      if (/<style>/.test(txt)) { console.log('❌ <style> tag in', fp); badStyleTag = true; }
    }
  }
}
walk(src);

if (badCssImport || badStyleTag) {
  console.error('\nGuardrail failed: Only theme.css and app.css may be imported (from main.tsx). No <style> tags allowed.\n');
  process.exit(1);
}
console.log('✅ Vet passed.');
