import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

const auditDir = path.join(process.cwd(), "public", "__audit");
function ensureDir() {
  try { fs.mkdirSync(auditDir, { recursive: true }); } catch {}
}

router.post("/__audit", express.json({ limit: "1mb" }), async (req, res) => {
  try {
    ensureDir();
    const name = (req.query.name as string) || "ui_audit_live";
    const file = path.join(auditDir, `${name}.json`);
    fs.writeFileSync(file, JSON.stringify(req.body || {}, null, 2));
    return res.json({ ok: true, saved: `/__audit/${name}.json` });
  } catch (e:any) {
    return res.status(500).json({ ok: false, error: String(e.message||e) });
  }
});

export default router;