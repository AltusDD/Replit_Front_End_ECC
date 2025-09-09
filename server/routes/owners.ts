import type { Express } from "express";
import { sbAdmin } from "../lib/supabaseAdmin";

export function installOwnerRoutes(app: Express) {
  // live type-ahead (company or first/last)
  app.get("/api/owners/search", async (req, res) => {
    const q = String(req.query.q || "").trim();
    if (!q) return res.json({ owners: [] });

    const like = `%${q}%`;
    const { data, error } = await sbAdmin
      .from("owners")
      .select("id,company_name,first_name,last_name,email,phone,status")
      .or(`company_name.ilike.${like},first_name.ilike.${like},last_name.ilike.${like}`)
      .order("company_name", { ascending: true })
      .limit(25);

    if (error) return res.status(500).json({ error: error.message });

    const owners = (data||[]).map(o => ({
      id: o.id,
      display_name: o.company_name?.trim()
        ? o.company_name.trim()
        : [o.last_name, o.first_name].filter(Boolean).join(", "),
      meta: o.company_name?.trim() && (o.first_name || o.last_name)
        ? [o.last_name, o.first_name].filter(Boolean).join(", ")
        : undefined,
      email: o.email, phone: o.phone, status: o.status,
    }));
    res.json({ owners });
  });

  // properties that belong to an owner (for Owner Card & Transfer modal)
  app.get("/api/owners/:id/properties", async (req, res) => {
    const ownerId = Number(req.params.id);
    if (!Number.isFinite(ownerId)) return res.status(400).json({ error: "bad owner id" });

    const { data, error } = await sbAdmin
      .from("properties")
      .select("id,doorloop_id,name,address1,city,state,zip,units_count,lat,lng")
      .eq("owner_id", ownerId)
      .order("name", { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ properties: data || [] });
  });
}
