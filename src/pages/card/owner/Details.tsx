import React from 'react';
// ECC Guardrail compliance
export default function Details({ properties }:{ properties?: any[]|null }) {
  return (
    <div className="space-y-3">
      <div className="font-medium">Portfolio</div>
      {properties && properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {properties.map((p) => (
            <MiniCard 
              key={String(p?.id ?? Math.random())}
              title={p?.display_name || p?.street_1 || `Property #${p?.id || 'unknown'}`}
              subtitle={[p?.city, p?.state].filter(Boolean).join(', ') || undefined}
              countBadge={p?.units_count}
              href={p?.id ? `/card/property/${p.id}` : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="text-sm opacity-70">No properties found.</div>
      )}
    </div>
  );
}