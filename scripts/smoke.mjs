// scripts/smoke.mjs
import { execSync } from "node:child_process";

function j(cmd){ return JSON.parse(execSync(cmd, {stdio:["ignore","pipe","pipe"]}).toString()); }
function t(s){ console.log("\n== " + s + " =="); }

const ids = j(`curl -s http://localhost:8787/api/rpc/diag/ids`);
const { property:PID, unit:UID, lease:LID, owner:OID, tenant:TID } = ids;

const endpoints = [
  ["prop", `curl -s "http://localhost:8787/api/rpc/get_property_card?id=${PID}"`],
  ["unit", `curl -s "http://localhost:8787/api/rpc/get_unit_card?id=${UID}"`],
  ["lease",`curl -s "http://localhost:8787/api/rpc/get_lease_card?id=${LID}"`],
  ["owner",`curl -s "http://localhost:8787/api/rpc/get_owner_card?id=${OID}"`],
  ["tenant",`curl -s "http://localhost:8787/api/rpc/get_tenant_card?id=${TID}"`],
];

for (const [name, cmd] of endpoints) {
  t(name);
  const o = j(cmd);
  if (!o) throw new Error(name + " empty");
  // minimal invariants
  if (name==="prop"   && (typeof o.kpis.units !== "number" || typeof o.property.type !== "string")) throw new Error("prop invariant");
  if (name==="owner"  && !Array.isArray(o.properties)) throw new Error("owner invariant");
  if (name==="tenant" && !Array.isArray(o.leases)) throw new Error("tenant invariant");
  console.log("OK");
}

console.log("\nALL RPC invariants OK");