import type { Express } from "express";
import { sbAdmin } from "../lib/supabaseAdmin";

export function installOwnerRoutes(app: Express) {
  // live type-ahead (company or first/last)
  app.get("/api/owners/search", async (req, res) => {
    res.status(410).json({
      ok: false,
      error: "deprecated_route",
      message: "This route has been removed. Use /api/portfolio/owners and filter client-side.",
      replacement: "/api/portfolio/owners"
    });
  });

  // properties that belong to an owner (for Owner Card & Transfer modal)
  app.get("/api/owners/:id/properties", async (req, res) => {
    res.status(410).json({
      ok: false,
      error: "deprecated_route",
      message: "This route has been removed. Use /api/portfolio/properties and filter client-side.",
      replacement: "/api/portfolio/properties"
    });
  });
}
