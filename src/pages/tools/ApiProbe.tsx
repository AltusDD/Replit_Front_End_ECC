import { useEffect, useState } from 'react';
import Badge from '@/components/ui/Badge';
import { buildUrl } from '@lib/ecc-api';
import { truncate } from '@lib/safe';

type Check = { path: string; status?: number; ok?: boolean; sample?: any; error?: string };

export default function ApiProbe() {
  const [checks, setChecks] = useState<Check[]>([]);
  const run = async () => {
    const list: Check[] = [
      { path: 'health' },
      { path: 'portfolio/properties?limit=1' },
      { path: 'portfolio/units?limit=1' },
      { path: 'portfolio/leases?limit=1' },
      { path: 'portfolio/tenants?limit=1' },
      { path: 'portfolio/owners?limit=1' }
    ];
    const results: Check[] = [];
    for (const c of list) {
      const url = buildUrl(c.path);
      try {
        const res = await fetch(url, { headers: { Accept: 'application/json' } });
        const json = await res.json().catch(() => null);
        results.push({
          ...c,
          status: res.status,
          ok: res.ok,
          sample: Array.isArray(json) ? json[0] : json
        });
      } catch (e: any) {
        results.push({ ...c, ok: false, error: String(e) });
      }
    }
    setChecks(results);
  };

  useEffect(() => { run(); }, []);

  return (
    <div style={{ display:'grid', gap:16 }}>
      <h1>API Probe</h1>
      <div className="panel">
        <button onClick={run}>Run probe</button>
      </div>

      <div className="panel">
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign:'left', padding:8, borderBottom:'1px solid var(--border)' }}>Endpoint</th>
              <th style={{ textAlign:'left', padding:8, borderBottom:'1px solid var(--border)' }}>Status</th>
              <th style={{ textAlign:'left', padding:8, borderBottom:'1px solid var(--border)' }}>First item / body (truncated)</th>
            </tr>
          </thead>
          <tbody>
            {checks.map((c,i)=>(
              <tr key={i} style={{ background: i%2 ? 'rgba(255,255,255,.02)':'transparent' }}>
                <td style={{ padding:8 }}>/api/{c.path}</td>
                <td style={{ padding:8 }}>
                  {c.ok ? <Badge tone="success">✅ {c.status}</Badge> : <Badge tone="danger">❌ {c.status ?? ''}</Badge>}
                </td>
                <td style={{ padding:8, color:'var(--muted)', fontFamily:'ui-monospace,monospace' }}>
                  {truncate(JSON.stringify(c.sample ?? c.error ?? ''), 140)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ color:'var(--muted)' }}>
        Probe uses only V3 endpoints; RPC routes are not required and never block.
      </div>
    </div>
  );
}
