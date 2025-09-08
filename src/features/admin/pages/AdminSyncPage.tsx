// src/features/admin/pages/AdminSyncPage.tsx
import { useState } from 'react';

const ALL = ['owners','properties','units','leases','tenants'] as const;
type Entity = typeof ALL[number];

export default function AdminSyncPage() {
  const [mode, setMode] = useState<'incremental'|'full'>('incremental');
  const [sinceDays, setSinceDays] = useState(30);
  const [selected, setSelected] = useState<Record<Entity, boolean>>(
    { owners:true, properties:true, units:true, leases:true, tenants:true }
  );
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string| null>(null);
  const [token, setToken] = useState('');

  const toggle = (k:Entity) => setSelected(s => ({...s, [k]: !s[k]}));

  async function run() {
    setBusy(true); setError(null); setResult(null);
    try {
      const entities = ALL.filter(k => selected[k]);
      const res = await fetch('/api/admin/sync/run', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'X-Admin-Token': token },
        body: JSON.stringify({ entities, mode, sinceDays }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Request failed');
      setResult(json);
    } catch (e:any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto text-[var(--text)]">
      <h1 className="text-2xl mb-4">Admin Sync</h1>
      <div className="mb-4">
        <label className="block text-sm mb-1">Admin Token</label>
        <input
          className="w-full rounded px-3 py-2 bg-[var(--panel-bg)] border border-[var(--line)]"
          value={token}
          onChange={e=>setToken(e.target.value)}
          type="password"
          placeholder="Enter ADMIN_SYNC_TOKEN"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">Mode</label>
        <select
          className="rounded px-3 py-2 bg-[var(--panel-bg)] border border-[var(--line)]"
          value={mode}
          onChange={e=>setMode(e.target.value as any)}
        >
          <option value="incremental">Incremental (since last sync)</option>
          <option value="full">Full (all data)</option>
        </select>
      </div>

      {mode === 'incremental' && (
        <div className="mb-4">
          <label className="block text-sm mb-1">Fallback Window (days)</label>
          <input
            type="number"
            className="rounded px-3 py-2 bg-[var(--panel-bg)] border border-[var(--line)]"
            value={sinceDays}
            onChange={e=>setSinceDays(Number(e.target.value))}
            min={1}
            max={365}
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm mb-2">Entities to sync</label>
        <div className="space-y-2">
          {ALL.map(k => (
            <label key={k} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selected[k]}
                onChange={()=>toggle(k)}
                className="rounded"
              />
              <span className="capitalize">{k}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={run}
        disabled={busy || !token}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {busy ? 'Running...' : 'Run Sync'}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded text-green-700">
          <strong>Success!</strong> Mode: {result.mode}
          <pre className="mt-2 text-xs overflow-auto">
            {JSON.stringify(result.results, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}