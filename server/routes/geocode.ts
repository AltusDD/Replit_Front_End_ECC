import type { Express } from "express";
import { sbAdmin } from "../lib/supabaseAdmin";
import { backfillPropertyCoords } from "../lib/geocode";

function ok(req: any): boolean {
  const hdr = String(req.headers["authorization"] || "");
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : (req.query.token || "");
  const want = process.env.ADMIN_SYNC_TOKEN || "";
  return want && token && String(token) === String(want);
}

export function installGeocodeRoutes(app: Express) {
  // quick status (total vs with coords)
  app.get("/api/admin/geocode/status", async (_req, res) => {
    const [{ data: total }, { data: withCoords }] = await Promise.all([
      sbAdmin.from("properties").select("id", { count: "exact", head: true }),
      sbAdmin.from("properties").select("id", { count: "exact", head: true }).not("lat", "is", null).not("lng", "is", null),
    ]);
    res.json({ total: total?.length || 0, with_coords: withCoords?.length || 0 });
  });

  // secure backfill (accepts optional owner_id)
  app.post("/api/admin/geocode/backfill", async (req, res) => {
    if (!ok(req)) return res.status(401).json({ error: "unauthorized" });
    const ownerId = req.body?.owner_id ? Number(req.body.owner_id) : undefined;
    try {
      const result = await backfillPropertyCoords({ admin: sbAdmin, fromOwnerId: ownerId, limit: 100, delayMs: 1100 });
      res.json({ ok: true, ...result });
    } catch (e:any) {
      res.status(500).json({ error: e?.message || "failed" });
    }
  });
}
