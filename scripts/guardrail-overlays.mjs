import fs from "fs";
import path from "path";
const ROOT = path.resolve(process.cwd(), "src");

const SCAN_EXT = [".tsx", ".ts", ".css", ".scss", ".less", ".jsx", ".js"];
const offenders = [];
const allowlistFile = path.resolve("scripts/guardrail-allowlist.json");
const allow = fs.existsSync(allowlistFile) ? JSON.parse(fs.readFileSync(allowlistFile,"utf8")) : { files:[], selectors:[] };

// A "cover" must meet TWO conditions: full-viewport + intent (backdrop/overlay/high z)
const rxFullViewport =
  /(position\s*:\s*(fixed|absolute)[^;{]*)(inset\s*:\s*0|top\s*:\s*0[\s\S]*left\s*:\s*0[\s\S]*right\s*:\s*0[\s\S]*bottom\s*:\s*0)/i;
const rxIntent =
  /(backdrop|overlay|page-cover|loading-screen|scrim|modal-backdrop|fullscreen|full-screen|z-?index\s*:\s*(?:[5-9]\d|[1-9]\d{2,}))/i;

// Tailwind-ish class combos ("fixed inset-0", "z-50") also count as intent
const rxTW = /(class(Name)?=)["'][^"']*(fixed[^"']*inset-0|inset-0[^"']*fixed)[^"']*["']/i;
const rxZ50 = /(class(Name)?=)["'][^"']*(z-(50|75|100|\[?\d{3,}\]?))[^"']*["']/i;

function walk(dir){ for(const f of fs.readdirSync(dir)){ const full=path.join(dir,f); const s=fs.statSync(full); s.isDirectory()?walk(full):scan(full);} }
function scan(file){
  const ext = path.extname(file).toLowerCase();
  if(!SCAN_EXT.includes(ext)) return;
  if((allow.files||[]).some(a => file.endsWith(a))) return;
  const src = fs.readFileSync(file,"utf8");
  const hitFull = rxFullViewport.test(src) || rxTW.test(src);
  const hitIntent = rxIntent.test(src) || rxZ50.test(src);
  if(hitFull && hitIntent){
    // allow inline doc marker for legitimate small popovers (not desired, but optional)
    if(src.includes("/* ECC-ALLOW-FIXED */")) return;
    offenders.push(file);
  }
}

walk(ROOT);
if(offenders.length){
  console.error("❌ FORBIDDEN OVERLAY PATTERNS:\n"+offenders.map(f=>" - "+f).join("\n"));
  process.exit(2);
}
console.log("✅ Overlay guardrail passed (refined).");