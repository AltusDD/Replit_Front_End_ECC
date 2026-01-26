import React from "react";

export default function PropertyMiniCard({ row }:{ row:any }){
  return (
    <div className="mini-card p-3 text-sm" data-testid={`card-minicard-${row.id}`}>
      <div className="section">
        <div>
          <div className="text-xs text-zinc-400">Owner</div>
          <div data-testid={`text-owner-${row.id}`}>{row.ownerName || "BLANK"}</div>
        </div>
        <div>
          <div className="text-xs text-zinc-400">Recent Activity</div>
          <div className="text-zinc-300">Cashflow last 90d: (sparkline TBD)</div>
        </div>
      </div>
      <div className="mt-2 section">
        <div>
          <div className="text-xs text-zinc-400">Top Tenant</div>
          <div className="text-zinc-300">Placeholder Tenant (arrears TBD)</div>
        </div>
        <div>
          <div className="text-xs text-zinc-400">Notes</div>
          <div className="text-zinc-300">—</div>
        </div>
      </div>
    </div>
  );
}