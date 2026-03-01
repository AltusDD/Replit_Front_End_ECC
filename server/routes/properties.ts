import type { Express } from "express";
import { sbAdmin } from "../lib/supabaseAdmin";

export function installPropertyRoutes(app: Express) {
  // first try internal id
  app.get("/api/properties/:id", async (req, res) => {
    res.setHeader('x-ecc-handler', '410_gone');
    res.status(410).json({
      ok: false,
      error: "deprecated_route",
      message: "This route has been removed. Use /api/portfolio/properties and filter client-side or use canonical query params.",
      replacement: "/api/portfolio/properties"
    });
  });

  // fallback by DoorLoop id (deep links that use external ids)
  app.get("/api/properties/by-doorloop/:dlId", async (req, res) => {
    res.setHeader('x-ecc-handler', '410_gone');
    res.status(410).json({
      ok: false,
      error: "deprecated_route",
      message: "This route has been removed. Use /api/portfolio/properties and filter client-side or use canonical query params.",
      replacement: "/api/portfolio/properties"
    });
  });
}
