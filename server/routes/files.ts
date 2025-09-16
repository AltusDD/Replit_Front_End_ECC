import express from "express";
import { listSharePointRoot } from "../lib/m365/graph";

const router = express.Router();

// ---- Test route
router.get("/api/files/test", async (_req, res) => {
  return res.json({ ok: true, message: "Files routes working!" });
});

// ---- DoorLoop Files (graceful placeholder)
router.get("/api/files/doorloop/list", async (_req, res) => {
  // If you later expose DoorLoop files API, map and return here.
  // For now, return empty with 200 (so UI works without errors).
  return res.json({ ok: true, items: [] });
});

// ---- SharePoint Files (graceful placeholder — future Graph integration)
router.get("/api/files/sharepoint/list", async (_req, res) => {
  try{
    const siteId = process.env.M365_SHAREPOINT_SITE_ID || "";
    if (!siteId) return res.json({ ok: true, items: [] });
    const items = await listSharePointRoot(siteId);
    return res.json({ ok: true, items: items.map(i=>({ id:i.id, name:i.name, href:i.webUrl, source: "SP" })) });
  }catch(e:any){
    if (String(e.message||"").includes("GRAPH_NOT_CONFIGURED")) return res.status(501).send("SharePoint not configured");
    return res.status(500).send(String(e.message||e));
  }
});

// ---- Dropbox (simplified for now)
router.get("/api/files/dropbox/list", async (_req, res) => {
  return res.status(501).json({ ok: false, message: "Dropbox not configured" });
});

export default router;