import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';

interface Transfer {
  id: number;
  status: string;
  effective_date: string;
  old_owner_id: number;
  new_owner_id: number;
  property_ids: number[];
  created_at: string;
  notes?: string;
}

interface TransferSummary {
  total: number;
  by_status: Record<string, number>;
  recent: Transfer[];
}

async function apiCall(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export default function AdminTransferManagementPage() {
  const [summary, setSummary] = useState<TransferSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    loadSummary();
  }, []);

  async function loadSummary() {
    setLoading(true);
    try {
      // Get transfer-related audit events to build summary
      const response = await apiCall('/api/audit?event_type=OWNER_TRANSFER_INITIATED&limit=20');
      const events = response.events || [];
      
      // Build summary from audit events
      const statusCounts: Record<string, number> = {};
      const recentTransfers: Transfer[] = [];
      
      events.forEach((event: any) => {
        const payload = event.payload || {};
        if (payload.transfer_id) {
          const status = payload.status || 'UNKNOWN';
          statusCounts[status] = (statusCounts[status] || 0) + 1;
          
          recentTransfers.push({
            id: payload.transfer_id,
            status: status,
            effective_date: payload.effective_date || event.created_at.split('T')[0],
            old_owner_id: payload.old_owner_id || 0,
            new_owner_id: payload.new_owner_id || 0,
            property_ids: payload.property_ids || [],
            created_at: event.created_at,
            notes: payload.notes
          });
        }
      });

      setSummary({
        total: events.length,
        by_status: statusCounts,
        recent: recentTransfers.slice(0, 10)
      });
    } catch (e: any) {
      setMessage(`Failed to load transfers: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'PENDING_ACCOUNTING': return 'text-yellow-400';
      case 'APPROVED_ACCOUNTING': return 'text-blue-400';
      case 'READY_EXECUTION': return 'text-orange-400';
      case 'COMPLETE': return 'text-green-400';
      case 'FAILED': return 'text-red-400';
      default: return 'text-neutral-400';
    }
  }

  return (
    <div className="p-6 text-neutral-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transfer Management</h1>
        <Link href="/owner-transfer">
          <a className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Create New Transfer
          </a>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary Stats */}
        <div className="card bg-neutral-900 border border-neutral-800">
          <div className="card-header px-4 py-3 border-b border-neutral-800">
            <h2 className="text-lg font-semibold">Transfer Summary</h2>
          </div>
          <div className="card-content p-4">
            {summary ? (
              <div className="space-y-3">
                <div className="text-2xl font-bold text-green-400">
                  {summary.total}
                </div>
                <div className="text-sm text-neutral-400">Total Transfers</div>
                
                <div className="space-y-2 pt-3">
                  <div className="text-sm font-medium text-neutral-300">By Status:</div>
                  {Object.entries(summary.by_status).map(([status, count]) => (
                    <div key={status} className="flex justify-between text-xs">
                      <span className={getStatusColor(status)}>{status}</span>
                      <span className="text-neutral-400">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-neutral-400">Loading...</div>
            )}
          </div>
        </div>

        {/* Recent Transfers */}
        <div className="lg:col-span-2 card bg-neutral-900 border border-neutral-800">
          <div className="card-header px-4 py-3 border-b border-neutral-800">
            <h2 className="text-lg font-semibold">Recent Transfers</h2>
          </div>
          <div className="card-content p-4">
            {summary?.recent?.length ? (
              <div className="space-y-3">
                {summary.recent.map((transfer) => (
                  <div 
                    key={transfer.id}
                    className="p-3 bg-neutral-800 border border-neutral-700 rounded hover:bg-neutral-750"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-neutral-200">
                            Transfer #{transfer.id}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(transfer.status)} bg-opacity-20`}>
                            {transfer.status}
                          </span>
                        </div>
                        <div className="text-sm text-neutral-400 mt-1">
                          {transfer.property_ids.length} properties • 
                          Owner {transfer.old_owner_id} → {transfer.new_owner_id} • 
                          Effective: {transfer.effective_date}
                        </div>
                        {transfer.notes && (
                          <div className="text-xs text-neutral-500 mt-1">
                            Notes: {transfer.notes}
                          </div>
                        )}
                      </div>
                      <Link href={`/owner-transfer/detail?id=${transfer.id}`}>
                        <a className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                          View
                        </a>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-neutral-400">No recent transfers found</div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={loadSummary}
          disabled={loading}
          className="px-4 py-2 bg-neutral-700 text-neutral-200 rounded hover:bg-neutral-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh Data'}
        </button>
        
        <Link href="/admin/sync">
          <a className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center">
            Sync Management
          </a>
        </Link>
        
        <Link href="/portfolio/owners">
          <a className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-center">
            View All Owners
          </a>
        </Link>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`mt-4 p-3 rounded ${
          message.includes('Failed') || message.includes('Error') 
            ? 'bg-red-900 border border-red-700 text-red-200' 
            : 'bg-green-900 border border-green-700 text-green-200'
        }`}>
          {message}
        </div>
      )}

      {/* Info */}
      <div className="mt-6 p-4 bg-neutral-800 border border-neutral-700 rounded">
        <h3 className="text-sm font-semibold text-neutral-300 mb-2">Transfer Workflow</h3>
        <div className="text-xs text-neutral-400 space-y-1">
          <p>• <span className="text-yellow-400">PENDING_ACCOUNTING</span> - Awaiting accounting approval</p>
          <p>• <span className="text-blue-400">APPROVED_ACCOUNTING</span> - Approved by accounting, ready for authorization</p>
          <p>• <span className="text-orange-400">READY_EXECUTION</span> - Authorized by admin, will execute on effective date</p>
          <p>• <span className="text-green-400">COMPLETE</span> - Transfer executed successfully</p>
          <p>• Transfers execute automatically at 5-minute intervals when ready</p>
        </div>
      </div>
    </div>
  );
}