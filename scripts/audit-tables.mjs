import fs from "fs"; import path from "path"; import glob from "glob";

const files = glob.sync("src/pages/portfolio/**/*.{ts,tsx}", { cwd: process.cwd() });
const report = [];
for (const rel of files) {
  const p = path.join(process.cwd(), rel);
  const s = fs.readFileSync(p, "utf8");
  const hasOverflowX = /overflow-x-(auto|scroll)/.test(s);
  const columns = (s.match(/accessorKey:\s*['"`][^'"`]+['"`]/g) || []).length;
  const masks = (s.match(/\?\?\s*['"]—['"]|\|\|\s*['"]—['"]/g) || []).length;
  report.push({ rel, columns, hasOverflowX, dashMasks: masks });
}
fs.writeFileSync("table_audit.json", JSON.stringify(report, null, 2));
console.log("Wrote table_audit.json with", report.length, "files");