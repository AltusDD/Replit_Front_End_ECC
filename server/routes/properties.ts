import type { Express } from "express";
import { sbAdmin } from "../lib/supabaseAdmin";

export function installPropertyRoutes(app: Express) {
  // first try internal id
  app.get("/api/properties/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "bad id" });

    const { data, error } = await sbAdmin
      .from("properties")
      .select("*, owner:owners(id,company_name,first_name,last_name)")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: "not_found" });
    res.json({ property: data });
  });

  // fallback by DoorLoop id (deep links that use external ids)
  app.get("/api/properties/by-doorloop/:dlId", async (req, res) => {
    const dlId = String(req.params.dlId);
    const { data, error } = await sbAdmin
      .from("properties")
      .select("*, owner:owners(id,company_name,first_name,last_name)")
      .eq("doorloop_id", dlId)
      .single();

    if (error && error.code !== "PGRST116") return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: "not_found" });
    res.json({ property: data });
  });
}
