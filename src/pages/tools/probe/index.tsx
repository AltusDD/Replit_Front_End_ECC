import { useState } from 'react';
import { API_BASE, fetchJSON } from '@lib/useApi';
export default function Probe() {
  const [path, setPath] = useState('/api/health');
  const [resp, setResp] = useState<any>(null);
  const [ok, setOk] = useState<boolean | null>(null);

  const go = async () => {
    try {
      setResp(await fetchJSON(path));
      setOk(true);
    } catch (e: any) {
      setResp({ error: String(e?.message || e) });
      setOk(false);
    }
  };

  return (
    <div>
      <h1>API Probe</h1>
      <div className="panel">
        <div className="row">
          <input
            value={path}
            onChange={(e) => setPath(e.target.value)}
            className="probe-input"
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-panel)',
              color: 'var(--color-text)',
              minWidth: '320px',
            }}
          />
          <button onClick={go} className="btn">
            Probe API
          </button>
        </div>
        <div style={{ marginTop: '16px' }}>
          <span className="badge">{ok === null ? 'Idle' : ok ? 'Success' : 'Failed'}</span>
        </div>
        <pre
          className="panel"
          style={{ marginTop: '12px', overflow: 'auto', whiteSpace: 'pre-wrap' }}
        >
          {JSON.stringify(resp, null, 2)}
        </pre>
        <div className="mt-16">
          Target: <code>{API_BASE}</code>
        </div>
      </div>
    </div>
  );
}
