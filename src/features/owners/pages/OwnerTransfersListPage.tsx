import React, { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";

type Transfer = { 
  id: number; 
  status: string; 
  effective_date: string; 
  old_owner_id: number; 
  new_owner_id: number; 
  property_ids: number[];
  created_at: string;
  notes?: string;
};

async function apiCall(url: string, options: RequestInit = {}) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export default function OwnerTransfersListPage() {
  const [loc] = useLocation();
  const params = new URLSearchParams(loc.split("?")[1] || "");
  const ownerId = Number(params.get("ownerId") || "0");
  
  const [items, setItems] = useState<Transfer[] | null>(null);
  const [sel, setSel] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  
  const adminToken = typeof window !== "undefined" ? localStorage.getItem("ADMIN_SYNC_TOKEN") : null;
  const headers = adminToken ? 
    { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}` } : 
    { "Content-Type": "application/json" };

  useEffect(() => {
    loadTransfers();
  }, [ownerId]);

  async function loadTransfers() {
    setLoading(true);
    try {
      const j = await apiCall(`/api/owner-transfers?ownerId=${ownerId}`);
      setItems(j.items || []);
    } catch (e: any) {
      console.error("Failed to load transfers:", e.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function bulk(path: string) {
    if (!sel.length) return;
    setLoading(true);
    try {
      const r = await fetch(path, { 
        method: "POST", 
        headers, 
        body: JSON.stringify({ ids: sel }) 
      });
      if (!r.ok) { 
        alert(await r.text()); 
        return; 
      }
      // reload
      await loadTransfers();
      setSel([]);
    } catch (e: any) {
      alert(`Failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  function toggleSelectAll() {
    const allIds = items?.map(x => x.id) || [];
    setSel(sel.length === allIds.length ? [] : allIds);
  }

  function toggleSelect(id: number) {
    setSel(prev => 
      prev.includes(id) 
        ? prev.filter(x => x !== id) 
        : [...prev, id]
    );
  }

  return (
    <div className="p-6 text-neutral-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Owner Transfers {ownerId ? `(Owner #${ownerId})` : ""}
        </h1>
        <Link href="/owner-transfer">
          <a className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Create New Transfer
          </a>
        </Link>
      </div>

      <div className="card bg-neutral-900 border border-neutral-800">
        <div className="card-header px-4 py-3 border-b border-neutral-800">
          <h2 className="text-lg font-semibold">Transfers</h2>
        </div>
        <div className="card-content p-4">
          {loading ? (
            <div>Loading…</div>
          ) : !items ? (
            <div>Loading…</div>
          ) : items.length === 0 ? (
            <div className="text-neutral-400">No transfers</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-neutral-400">
                  <th className="text-left py-2">
                    <input 
                      type="checkbox" 
                      checked={sel.length === items.length && items.length > 0}
                      onChange={toggleSelectAll} 
                    />
                  </th>
                  <th className="text-left py-2">ID</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Effective</th>
                  <th className="text-left">Props</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map(t => (
                  <tr key={t.id} className="border-t border-neutral-800">
                    <td className="py-2">
                      <input 
                        type="checkbox" 
                        checked={sel.includes(t.id)} 
                        onChange={() => toggleSelect(t.id)} 
                      />
                    </td>
                    <td className="py-2">{t.id}</td>
                    <td>{t.status}</td>
                    <td>{t.effective_date}</td>
                    <td>{t.property_ids?.length || 0}</td>
                    <td className="text-right">
                      <Link href={`/owner-transfer/detail?id=${t.id}`}>
                        <a className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                          Open
                        </a>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          {items && items.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button 
                disabled={!sel.length || loading} 
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50" 
                onClick={() => bulk("/api/owner-transfers/bulk-approve")}
              >
                Bulk Approve ({sel.length})
              </button>
              {adminToken && (
                <>
                  <button 
                    disabled={!sel.length || loading} 
                    className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50" 
                    onClick={() => bulk("/api/owner-transfers/bulk-authorize")}
                  >
                    Bulk Authorize ({sel.length})
                  </button>
                  <button 
                    disabled={!sel.length || loading} 
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50" 
                    onClick={() => bulk("/api/owner-transfers/bulk-execute")}
                  >
                    Bulk Execute ({sel.length})
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {!adminToken && (
        <div className="mt-4 p-3 bg-yellow-900 border border-yellow-700 rounded text-yellow-200 text-sm">
          <strong>Note:</strong> Set <code>ADMIN_SYNC_TOKEN</code> in localStorage to enable admin bulk actions (Authorize/Execute).
        </div>
      )}
    </div>
  );
}