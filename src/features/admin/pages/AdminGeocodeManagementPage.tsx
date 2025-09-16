import React, { useState, useEffect } from 'react';

interface GeocodeStats {
  ts: string;
  processed: number;
  updated: number;
  batch_size: number;
}

async function apiCall(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export default function AdminGeocodeManagementPage() {
  const [stats, setStats] = useState<GeocodeStats | null>(null);
  const [batchSize, setBatchSize] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      // Get current state from integration_state table
      const response = await apiCall('/api/audit?event_type=GEOCODE_AUTO&limit=1');
      if (response.events?.length > 0) {
        // Parse latest geocode stats from audit events
        const latestEvent = response.events[0];
        if (latestEvent.payload) {
          setStats({
            ts: latestEvent.created_at,
            processed: latestEvent.payload.processed || 0,
            updated: latestEvent.payload.updated || 0,
            batch_size: latestEvent.payload.batch_size || 10
          });
        }
      }
    } catch (e: any) {
      setMessage(`Failed to load stats: ${e.message}`);
    }
  }

  async function updateBatchSize() {
    setLoading(true);
    setMessage('');
    try {
      // Note: In a full implementation, we'd need an admin API to update integration_state
      // For now, this is a placeholder that shows the intended functionality
      setMessage(`Batch size would be updated to ${batchSize} (admin API needed)`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    } catch (e: any) {
      setMessage(`Failed to update batch size: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function triggerManualRun() {
    setLoading(true);
    setMessage('');
    try {
      // Note: In a full implementation, we'd need an admin API to trigger manual geocode runs
      setMessage('Manual geocode run would be triggered (admin API needed)');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      await loadStats();
    } catch (e: any) {
      setMessage(`Failed to trigger manual run: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 text-neutral-200">
      <h1 className="text-2xl font-bold mb-6">Geocode Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stats Card */}
        <div className="card bg-neutral-900 border border-neutral-800">
          <div className="card-header px-4 py-3 border-b border-neutral-800">
            <h2 className="text-lg font-semibold">Latest Run Statistics</h2>
          </div>
          <div className="card-content p-4">
            {stats ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-neutral-400">Last Run:</span>
                    <div className="text-neutral-200">
                      {new Date(stats.ts).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-neutral-400">Batch Size:</span>
                    <div className="text-neutral-200">{stats.batch_size}</div>
                  </div>
                  <div>
                    <span className="text-neutral-400">Processed:</span>
                    <div className="text-neutral-200">{stats.processed}</div>
                  </div>
                  <div>
                    <span className="text-neutral-400">Updated:</span>
                    <div className="text-green-400">{stats.updated}</div>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="text-xs text-neutral-500">
                    Success Rate: {stats.processed > 0 ? Math.round((stats.updated / stats.processed) * 100) : 0}%
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-neutral-400">No statistics available</div>
            )}
          </div>
        </div>

        {/* Controls Card */}
        <div className="card bg-neutral-900 border border-neutral-800">
          <div className="card-header px-4 py-3 border-b border-neutral-800">
            <h2 className="text-lg font-semibold">Geocode Controls</h2>
          </div>
          <div className="card-content p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Batch Size (properties per tick)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={batchSize}
                  onChange={(e) => setBatchSize(Number(e.target.value))}
                  min={1}
                  max={100}
                  className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-neutral-200"
                />
                <button
                  onClick={updateBatchSize}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Update
                </button>
              </div>
            </div>

            <div>
              <button
                onClick={triggerManualRun}
                disabled={loading}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Trigger Manual Geocode Run'}
              </button>
            </div>

            <div>
              <button
                onClick={loadStats}
                disabled={loading}
                className="w-full px-4 py-2 bg-neutral-700 text-neutral-200 rounded hover:bg-neutral-600 disabled:opacity-50"
              >
                Refresh Statistics
              </button>
            </div>
          </div>
        </div>
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
        <h3 className="text-sm font-semibold text-neutral-300 mb-2">Geocoding Information</h3>
        <div className="text-xs text-neutral-400 space-y-1">
          <p>• Auto-geocoding runs every 60 seconds</p>
          <p>• Processes properties missing latitude/longitude coordinates</p>
          <p>• Uses Google Maps API with rate limiting (2 requests/second)</p>
          <p>• Results are cached to avoid duplicate API calls</p>
          <p>• All operations are logged to the audit trail</p>
        </div>
      </div>
    </div>
  );
}