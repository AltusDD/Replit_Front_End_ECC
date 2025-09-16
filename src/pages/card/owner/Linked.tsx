import React from 'react';
// ECC Guardrail compliance
export default function Linked({ properties }:{ properties?: any[]|null }) {
  return (
    <div className="grid gap-3">
      {properties && properties.length > 0 ? (
        properties.slice(0, 5).map((p) => (
          <MiniCard 
            key={String(p?.id ?? Math.random())}
            title={p?.display_name || p?.street_1 || `Property #${p?.id || 'unknown'}`}
            href={p?.id ? `/card/property/${p.id}` : undefined}
          />
        ))
      ) : (
        <div className="text-sm opacity-70">No linked properties.</div>
      )}
    </div>
  );
}