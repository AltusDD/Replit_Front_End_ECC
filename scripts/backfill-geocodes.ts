// node -r esbuild-register scripts/backfill-geocodes.ts
import { pool } from "../server/db";
import { geocode } from "../server/lib/geocode";

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function makeAddress(p: any) {
  const parts = [p.street, p.city, p.state, p.zip].filter(Boolean);
  return parts.length ? parts.join(", ") : (p.name || "");
}

(async () => {
  const { rows } = await pool.query(`
    SELECT id, name, street, city, state, zip, lat, lng
    FROM public.properties
    WHERE lat IS NULL OR lng IS NULL
    ORDER BY id ASC
  `);

  let ok = 0, fail = 0;
  for (const p of rows) {
    const address = makeAddress(p);
    const hit = await geocode(address);
    if (hit) {
      await pool.query(`UPDATE public.properties SET lat=$1, lng=$2 WHERE id=$3`, [hit.lat, hit.lng, p.id]);
      ok++;
      console.log(`✓ ${p.id}: ${address} -> ${hit.lat},${hit.lng} (${hit.provider})`);
    } else {
      fail++;
      console.warn(`× ${p.id}: ${address} (no result)`);
    }
    await sleep(1000); // 1/sec
  }

  console.log(`Backfill complete: ${ok} updated, ${fail} skipped/failed`);
  process.exit(0);
})();