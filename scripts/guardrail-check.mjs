#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { glob } from "glob";

const ROOT = process.cwd();
const isDev = process.env.npm_lifecycle_event === 'dev';
let failures = 0;

console.log("[guardrail] checking ECC contract compliance...");

// Check for legacy imports in card pages
const cardFiles = [
  "src/pages/card/property/index.tsx",
  "src/pages/card/unit/index.tsx", 
  "src/pages/card/lease/index.tsx",
  "src/pages/card/tenant/index.tsx",
  "src/pages/card/owner/index.tsx"
];

const bannedImports = [
  "@/features/portfolio/components",
  "@/components/Section",
  "@/lib/ecc-card-queries"  // Must use ecc-resolvers directly
];

for (const file of cardFiles) {
  if (!fs.existsSync(path.join(ROOT, file))) {
    console.log(`[guardrail] missing card file: ${file}`);
    failures++;
    continue;
  }
  
  const content = fs.readFileSync(path.join(ROOT, file), "utf8");
  
  // Check for banned legacy imports
  for (const banned of bannedImports) {
    if (content.includes(banned)) {
      console.log(`[guardrail] legacy resolver import in ${file}`);
      failures++;
    }
  }
  
  // Check for required routing pattern: useRoute + Number(params?.id)
  if (!content.includes("useRoute") || !content.includes("Number(params?.id)")) {
    console.log(`[guardrail] missing route+Number pattern in ${file}`);
    failures++;
  }
}

// Check required test IDs in hero blocks
const heroFiles = [
  { 
    file: "src/pages/card/property/HeroBlock.tsx", 
    testIds: ["hero.property.kpi.unitsTotal", "hero.property.kpi.activeLeases", "hero.property.kpi.occupancy", "hero.property.kpi.avgRent", "address"] 
  },
  { 
    file: "src/pages/card/unit/HeroBlock.tsx", 
    testIds: ["hero.unit.kpi.status", "hero.unit.kpi.rent", "hero.unit.kpi.bedBath", "hero.unit.kpi.sqft"] 
  },
  { 
    file: "src/pages/card/lease/HeroBlock.tsx", 
    testIds: ["hero.lease.kpi.status", "hero.lease.kpi.rent", "hero.lease.kpi.term", "hero.lease.kpi.balance"] 
  },
  { 
    file: "src/pages/card/tenant/HeroBlock.tsx", 
    testIds: ["hero.tenant.kpi.activeLeases", "hero.tenant.kpi.balance", "hero.tenant.kpi.onTimeRate", "hero.tenant.kpi.openWorkOrders"] 
  },
  { 
    file: "src/pages/card/owner/HeroBlock.tsx", 
    testIds: ["hero.owner.kpi.unitsTotal", "hero.owner.kpi.activeLeases", "hero.owner.kpi.occupancy", "hero.owner.kpi.avgRent"] 
  }
];

for (const { file, testIds } of heroFiles) {
  if (!fs.existsSync(path.join(ROOT, file))) {
    console.log(`[guardrail] missing hero file: ${file}`);
    failures++;
    continue;
  }
  
  const content = fs.readFileSync(path.join(ROOT, file), "utf8");
  
  for (const testId of testIds) {
    // Handle both testid="..." and data-testid="..." patterns
    if (!content.includes(`testid="${testId}"`) && !content.includes(`data-testid="${testId}"`)) {
      console.log(`[guardrail] missing test-id "${testId}" in ${file}`);
      failures++;
    }
  }
}

// === Legacy Purge Enforcement ===
const forbiddenDirs = [
  "src/features/portfolio/components",
  "src/components/Section",
];
for (const d of forbiddenDirs) {
  if (fs.existsSync(path.join(ROOT, d))) {
    console.error("[guardrail] forbidden directory present:", d); 
    failures++;
  }
}

// --- Repo-wide legacy import ban (alias or relative) ---
let legacyFailures = 0;
for (const rel of glob.sync("src/**/*.{ts,tsx,js,jsx}", { cwd: ROOT })) {
  const s = fs.readFileSync(path.join(ROOT, rel), "utf8");
  if (s.includes("features/portfolio/components/") || s.includes("@/features/portfolio/components")) {
    console.error("[guardrail] forbidden legacy import in", rel);
    legacyFailures++;
  }
}
if (legacyFailures) {
  if (isDev) console.warn('[guardrail] WARN: legacy import(s) found; continuing in dev');
  else process.exit(1);
}

function scan(patterns, where, msg) {
  for (const rel of glob.sync(where, { cwd: ROOT })) {
    const s = fs.readFileSync(path.join(ROOT, rel), "utf8");
    for (const rx of patterns) {
      if (rx.test(s)) { console.error(`[guardrail] ${msg}:`, rel, "→", rx); failures++; }
    }
  }
}

// 1) Ban all legacy code paths (alias + relative + directories)
scan([/@\/lib\/ecc-card-queries/, /from ['"]\.{1,2}\/.*ecc-card-queries['"]/], "src/**/*.{ts,tsx,js,jsx}", "legacy resolver import");
scan([/from ['"]@\/lib\/cards\/?/, /from ['"]\.{1,2}\/.*\/lib\/cards\//], "src/**/*.{ts,tsx,js,jsx}", "legacy lib/cards import");
scan([/features\/.*\/components\/HeroBlock/], "src/**/*.{ts,tsx,js,jsx}", "legacy HeroBlock import");
if (fs.existsSync(path.join(ROOT, "src/lib/cards"))) { console.error("[guardrail] forbidden directory present: src/lib/cards"); failures++; }

// 2) Ban masking patterns inside card pages & portfolio columns
const MASK_NUM = [/\?\?\s*0\b/, /\|\|\s*0\b/];
const MASK_TXT = [/\?\?\s*['"]—['"]/, /\|\|\s*['"]—['"]/];
scan([...MASK_NUM, ...MASK_TXT], "src/pages/card/**/*.{ts,tsx}", "masking fallback (??0 ||0 ||'—')");
scan([...MASK_NUM, ...MASK_TXT], "src/pages/portfolio/**/*.{ts,tsx}", "masking fallback (??0 ||0 ||'—')");

// 3) Ban safeNum helper if present
scan([/function\s+safeNum\s*\(|\bsafeNum\s*\(/], "src/**/*.{ts,tsx,js,jsx}", "safeNum masking helper");

// 4) Ensure card pages use wouter useRoute + Number coercion
const idPatterns = {
  "src/pages/card/property/index.tsx":[/useRoute\(\"\/card\/property\/:id\"\)/,/Number\(params\?\.id\)/],
  "src/pages/card/unit/index.tsx":    [/useRoute\(\"\/card\/unit\/:id\"\)/,    /Number\(params\?\.id\)/],
  "src/pages/card/lease/index.tsx":   [/useRoute\(\"\/card\/lease\/:id\"\)/,   /Number\(params\?\.id\)/],
  "src/pages/card/tenant/index.tsx":  [/useRoute\(\"\/card\/tenant\/:id\"\)/,  /Number\(params\?\.id\)/],
  "src/pages/card/owner/index.tsx":   [/useRoute\(\"\/card\/owner\/:id\"\)/,   /Number\(params\?\.id\)/],
};
for (const [file, pats] of Object.entries(idPatterns)) {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) { console.error("[guardrail] missing", file); failures++; continue; }
  const s = fs.readFileSync(p,"utf8");
  for (const rx of pats) if (!rx.test(s)) { console.error("[guardrail] route/id pattern missing in", file, "→", rx); failures++; }
}

// 5) Required test IDs on heroes
const required = {
  "src/pages/card/property/HeroBlock.tsx": ["hero.property.kpi.unitsTotal","hero.property.kpi.activeLeases","hero.property.kpi.occupancy","hero.property.kpi.avgRent","address"],
  "src/pages/card/unit/HeroBlock.tsx":     ["hero.unit.kpi.status","hero.unit.kpi.rent","hero.unit.kpi.bedBath","hero.unit.kpi.sqft"],
  "src/pages/card/lease/HeroBlock.tsx":    ["hero.lease.kpi.status","hero.lease.kpi.rent","hero.lease.kpi.term","hero.lease.kpi.balance"],
  "src/pages/card/tenant/HeroBlock.tsx":   ["hero.tenant.kpi.activeLeases","hero.tenant.kpi.balance","hero.tenant.kpi.onTimeRate","hero.tenant.kpi.openWorkOrders"],
  "src/pages/card/owner/HeroBlock.tsx":    ["hero.owner.kpi.unitsTotal","hero.owner.kpi.activeLeases","hero.owner.kpi.occupancy","hero.owner.kpi.avgRent"],
};
for (const [file, needles] of Object.entries(required)) {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) { console.error("[guardrail] missing", file); failures++; continue; }
  const s = fs.readFileSync(p,"utf8");
  for (const n of needles) if (!s.includes(`testid="${n}"`) && !s.includes(`data-testid="${n}"`)) { console.error("[guardrail] testid missing in", file, "→", n); failures++; }
}

if (typeof globalThis.failuresSum === "number") globalThis.failuresSum += failures;
else globalThis.failuresSum = failures;

// --- Legacy Section & FieldGroup ban (alias + relative) ---
for (const rel of glob.sync("src/**/*.{ts,tsx,js,jsx}", { cwd: ROOT })) {
  const s = fs.readFileSync(path.join(ROOT, rel), "utf8");
  if (s.includes("@/components/Section") || /components\/Section(\.|\/)/.test(s)) {
    console.error("[guardrail] forbidden legacy Section import in", rel); failures++;
  }
  if (s.includes("@/features/ui/FieldGroup") || /features\/ui\/FieldGroup(\.|\/)/.test(s)) {
    console.error("[guardrail] forbidden legacy FieldGroup import in", rel); failures++;
  }
}
// also fail if any .bak sneaks into src again
for (const bak of glob.sync("src/**/*.bak", { cwd: ROOT })) {
  console.error("[guardrail] .bak file present:", bak); failures++;
}

if (failures > 0) {
  if (isDev) { console.warn(`[guardrail] WARN: ${failures} issue(s) (dev continues)`); process.exit(0); }
  else { console.log(`[guardrail] FAILED with ${failures} issue(s)`); process.exit(1); }
} else {
  console.log("[guardrail] PASS");
}

// No server spawning here in dev; guardrail = checks only