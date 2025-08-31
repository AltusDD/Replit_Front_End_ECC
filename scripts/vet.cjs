/**
 * ECC vet — fail fast if guardrails drift:
 *  - Only two global CSS imports (theme.css, app.css), and only in src/main.tsx
 *  - navConfig default export exists at src/components/layout/navConfig.ts
 *  - Required CSS classes exist in theme.css (.layout, .sidebar, .main)
 */
const fs = require("fs"), path = require("path");

function die(msg){ console.error("❌ VET:", msg); process.exit(1); }
function ok(msg){ console.log("✅ VET:", msg); }

const root = process.cwd();
const main = path.join(root, "src", "main.tsx");
const theme = path.join(root, "src", "styles", "theme.css");
const app = path.join(root, "src", "styles", "app.css");
const nav = path.join(root, "src", "components", "layout", "navConfig.ts");

if (!fs.existsSync(main)) die("src/main.tsx missing");
if (!fs.existsSync(theme)) die("src/styles/theme.css missing");
if (!fs.existsSync(app)) die("src/styles/app.css missing");
if (!fs.existsSync(nav)) die("src/components/layout/navConfig.ts missing");

const mainSrc = fs.readFileSync(main,"utf8");
const cssImports = (mainSrc.match(/import\s+["'][^"']+\.css["'];?/g) || []);
if (cssImports.length !== 2) die(`src/main.tsx should import exactly 2 CSS files, found ${cssImports.length}`);

if (!/theme\.css/.test(mainSrc) || !/app\.css/.test(mainSrc)) die("main.tsx must import theme.css and app.css");

function findCSSImports(dir){
  let bad=[];
  for (const f of fs.readdirSync(dir)){
    const p=path.join(dir,f);
    const stat=fs.statSync(p);
    if (stat.isDirectory()) bad = bad.concat(findCSSImports(p));
    else if (/\.(t|j)sx?$/.test(f) && p!==main){
      const s=fs.readFileSync(p,"utf8");
      if (/import\s+["'][^"']+\.css["']/.test(s)) bad.push(p);
    }
  }
  return bad;
}
const stray = findCSSImports(path.join(root,"src"));
if (stray.length) die(`global CSS imported outside main.tsx:\n- `+stray.join("\n- "));

const navSrc = fs.readFileSync(nav,"utf8");
if (!/export\s+default\s+/.test(navSrc)) die("navConfig.ts must have a default export");
ok("navConfig default export present");

const themeCss = fs.readFileSync(theme,"utf8");
for (const sel of [".layout",".sidebar",".main"]){
  if (!themeCss.includes(sel)) die(`theme.css missing required selector ${sel}`);
}
ok("theme.css contains base layout selectors");

ok("All guardrails passed.");
