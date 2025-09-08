// server/routes/adminSync.ts
import type { Request, Response, Router } from 'express';
import express from 'express';
import { runSync } from '../lib/sync';

const router: Router = express.Router();

function isAuthorized(req: Request) {
  const token = req.headers['x-admin-token'];
  return token && token === process.env.ADMIN_SYNC_TOKEN;
}

router.post('/run', async (req: Request, res: Response) => {
  try {
    if (!isAuthorized(req)) return res.status(401).json({ error: 'unauthorized' });

    const {
      entities = ['owners','properties','units','leases','tenants'],
      mode = 'incremental',
      sinceDays = 30,
    } = req.body || {};

    const result = await runSync(entities, mode, sinceDays);
    res.json({ ok: true, ...result });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err?.message || String(err) });
  }
});

export default router;