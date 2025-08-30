import fs from "node:fs";

const csv = fs.readFileSync("nav_tree_v3.csv","utf8").trim().split(/\r?\n/).slice(1)
  .map(l=>l.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(s=>s.trim()));
const rows = csv.map(([section,parent,label,path,type])=>({section,parent,label,path,type}));

// Build tree (section groups can repeat)
const sections = {};
for (const r of rows) {
  if (!sections[r.section]) sections[r.section] = { label:r.section, items:[] };
}
function ensureParent(sec, parent){
  const s = sections[sec]; if (!parent) return s;
  let p = s.items.find(x=>x.type==="parent" && x.label===parent);
  if(!p){ p = {type:"parent", label:parent, items:[]}; s.items.push(p); }
  return p;
}

const leafs = [];
for (const r of rows) {
  if (r.type==="parent"){ ensureParent(r.section, r.parent); continue; }
  const bucket = ensureParent(r.section, r.parent);
  const item = {type:"leaf", label:r.label, path:r.path};
  bucket.items.push(item); leafs.push(item);
}

// Write navConfig.ts
const nav = Object.values(sections);
fs.mkdirSync("src/components/layout",{recursive:true});
fs.writeFileSync("src/components/layout/navConfig.ts",
`export type NavLeaf = { type:"leaf"; label:string; path:string };
export type NavParent = { type:"parent"; label:string; items:(NavLeaf)[] };
export type NavSection = { label:string; items:(NavParent)[] };
export const NAV: NavSection[] = ${JSON.stringify(nav, null, 2)};
`);

// Create stub pages for every leaf if missing
function stub(path,label){
  // convert /ops/accounting/overview -> src/pages/ops/accounting/overview.tsx
  const clean = path.replace(/^\/+/,'').replace(/:([a-zA-Z]+)/g,'$1'); // :id -> id
  const file = `src/pages/${clean || "index"}.tsx`;
  const dir = file.split('/').slice(0,-1).join('/');
  fs.mkdirSync(dir,{recursive:true});
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file,
`import React from 'react';
export default function Page(){ return (
  <div className="panel" style={{padding:16}}>
    <h1>${label}</h1>
    <p className="badge">Stub • ${path}</p>
  </div>
); }`);
  }
}
leafs.forEach(l => stub(l.path, l.label));

// Write route map (wouter)
fs.writeFileSync("src/router.tsx",
`import React from 'react';
import { Route, Switch } from 'wouter';
${leafs.map(l=>{
  const imp = l.path.replace(/^\/+/,'').replace(/:([a-zA-Z]+)/g,'$1').replace(/[^a-zA-Z0-9]/g,'_');
  const p   = l.path.replace(/^\/+/,'');
  return `import ${imp} from './pages/${p.replace(/:([a-zA-Z]+)/g,'$1')}';`;
}).join('\n')}

export default function AppRoutes(){
  return (<Switch>
${leafs.map(l=>{
  return `    <Route path="${l.path}" component={${l.path.replace(/^\/+/,'').replace(/:([a-zA-Z]+)/g,'$1').replace(/[^a-zA-Z0-9]/g,'_')}} />`;
}).join('\n')}
    <Route>404 Not Found</Route>
  </Switch>);
}
`);
console.log("✔ navConfig.ts, router.tsx, and stub pages generated.");