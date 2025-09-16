// scripts/ui-smoke.mjs - HTTP-based UI smoke test
import { execSync } from "node:child_process";

function j(cmd){ return JSON.parse(execSync(cmd, {stdio:["ignore","pipe","pipe"]}).toString()); }
function httpCheck(url, name) {
  try {
    const result = execSync(`curl -s -o /dev/null -w "%{http_code}" "${url}"`, {encoding:'utf8'});
    if (result.trim() === '200') {
      console.log(`OK (HTTP 200)`);
      return true;
    } else {
      console.log(`ERROR (HTTP ${result.trim()})`);
      return false;
    }
  } catch (e) {
    console.log(`ERROR (${e.message})`);
    return false;
  }
}

const ids = j(`curl -s http://localhost:8787/api/rpc/diag/ids`);
const { property:PID, unit:UID, lease:LID, owner:OID, tenant:TID } = ids;

const routes = [
  [ "portfolio", `http://localhost:5173/portfolio/properties` ],
  [ "property",  `http://localhost:5173/card/property/${PID}` ],
  [ "unit",      `http://localhost:5173/card/unit/${UID}` ],
  [ "lease",     `http://localhost:5173/card/lease/${LID}` ],
  [ "owner",     `http://localhost:5173/card/owner/${OID}` ],
  [ "tenant",    `http://localhost:5173/card/tenant/${TID}` ],
];

let allOk = true;
for (const [name, url] of routes) {
  console.log(`\n== ${name.toUpperCase()} == ${url}`);
  const ok = httpCheck(url, name);
  if (!ok) allOk = false;
}

if (allOk) {
  console.log("\nALL UI routes OK");
} else {
  console.log("\nSOME UI routes FAILED");
  process.exit(1);
}