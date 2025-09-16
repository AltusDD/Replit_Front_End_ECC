import fs from "node:fs";
const m = fs.readFileSync("src/styles/index.css","utf8");
const order = [
  "tokens.css","theme.css","ecc.css","card-enhancer.css","no-overlays.css","app.css","genesis.css"
];
const idx = order.map(n => m.indexOf(n));
const bad = idx.some((i,j,arr)=> i<0 || (j>0 && i<arr[j-1]));
if (bad) {
  console.log("[guardrail-ui] ❌ CSS import order drifted:", idx.map((v,i)=>`${order[i]}=${v}`).join(" "));
  process.exit(1);
}
console.log("[guardrail-ui] ✅ CSS imports locked:", order.join(" → "));