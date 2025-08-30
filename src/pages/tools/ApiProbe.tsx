import React, { useState } from 'react';
import { API_BASE, fetchJSON, buildUrl } from '@/lib/useApi';

export default function ApiProbe() {
  const [ep, setEp] = useState('/api/health');
  const [resp, setResp] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle');

  async function go() {
    setStatus('idle');
    setResp(null);
    try {
      const data = await fetchJSON(buildUrl(ep));
      setResp(data);
      setStatus('ok');
    } catch (e: any) {
      setResp({ error: String(e?.message || e) });
      setStatus('err');
    }
  }
  return (
    <>
      <div className="header">
        <h1>API Probe</h1>
      </div>
      <div className="panel" style={{ display: 'grid', gap: 12 }}>
        <div>
          <small>Target:</small> {API_BASE}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input style={{ flex: 1 }} value={ep} onChange={(e) => setEp(e.target.value)} />
          <button className="btn" onClick={go}>
            Probe
          </button>
        </div>
        <div>
          <small>Status:</small> {status === 'ok' ? '✅ OK' : status === 'err' ? '❌ Error' : '—'}
        </div>
        <pre className="panel" style={{ overflow: 'auto', maxHeight: 320 }}>
          {JSON.stringify(resp, null, 2)}
        </pre>
      </div>
    </>
  );
}
