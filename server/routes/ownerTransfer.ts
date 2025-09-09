import type { Express } from "express";
import { initiateTransfer, approveAccounting, authorizeTransfer, executeTransfer } from "../lib/ownerTransfer";
import { sbAdmin } from "../lib/supabaseAdmin";

function isAdmin(req:any) {
  const hdr = String(req.headers["authorization"] || "");
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : (req.query.token || "");
  return token && process.env.ADMIN_SYNC_TOKEN && token === process.env.ADMIN_SYNC_TOKEN;
}

export function installOwnerTransferRoutes(app: Express) {
  app.post("/api/owner-transfer/initiate", async (req, res) => {
    try {
      const result = await initiateTransfer(req.body);
      res.json({ ok:true, ...result });
    } catch (e:any) { res.status(400).json({ ok:false, error: e?.message || "failed" }); }
  });

  app.post("/api/owner-transfer/approve-accounting", async (req, res) => {
    try {
      const id = Number(req.body?.transfer_id);
      await approveAccounting(id);
      res.json({ ok:true });
    } catch (e:any) { res.status(400).json({ ok:false, error: e?.message }); }
  });

  app.post("/api/owner-transfer/authorize", async (req, res) => {
    if (!isAdmin(req)) return res.status(401).json({ ok:false, error:"unauthorized" });
    try {
      const id = Number(req.body?.transfer_id);
      await authorizeTransfer(id);
      res.json({ ok:true });
    } catch (e:any) { res.status(400).json({ ok:false, error: e?.message }); }
  });

  app.post("/api/owner-transfer/execute", async (req, res) => {
    if (!isAdmin(req)) return res.status(401).json({ ok:false, error:"unauthorized" });
    try {
      const id = Number(req.body?.transfer_id);
      const out = await executeTransfer(id);
      res.json({ ok:true, ...out });
    } catch (e:any) { res.status(400).json({ ok:false, error: e?.message }); }
  });

  app.get("/api/owner-transfer/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { data, error } = await sbAdmin.from("owner_transfers").select("*").eq("id", id).single();
    if (error) return res.status(404).json({ ok:false, error:error.message });
    res.json({ ok:true, transfer: data });
  });
}