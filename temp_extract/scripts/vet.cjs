const fs=require('fs'), path=require('path');
const fail=(m)=>{ console.error('❌ Vet failed:',m); process.exit(1); };
const ok=(m)=> console.log('✅',m);

const mainTsx = fs.readFileSync('src/main.tsx','utf8');
const cssImports = (mainTsx.match(/import\s+["']\.\/styles\/.*\.css["']/g)||[]).length;
if(cssImports!==2) fail('main.tsx must import exactly two CSS files (theme.css, app.css).');

const theme = fs.readFileSync('src/styles/theme.css','utf8');
['--gold','#F7C948','--bg','--panel'].forEach(tok=>{
  if(!theme.includes(tok)) fail('Brand token missing: '+tok);
});

const scanCss = (dir)=>{
  for(const f of fs.readdirSync(dir)){
    const p = path.join(dir,f);
    const s = fs.statSync(p);
    if(s.isDirectory()) scanCss(p);
    else if(/\.tsx?$/.test(p) && p !== 'src/main.tsx' && /import\s+['"][^'"]+\.css['"]/.test(fs.readFileSync(p,'utf8'))) fail('Rogue CSS import: '+p);
  }
};
scanCss('src');
ok('Theme + CSS guardrails enforced.');
