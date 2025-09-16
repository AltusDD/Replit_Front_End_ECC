import {} from '@/lib/ecc-resolvers';
import React from 'react';

export default function Linked({ units }: { units: Array<{ id: number|string; unit_number?: string|null; beds?: number|null; baths?: number|null; }> }) {
  if (!Array.isArray(units) || units.length === 0) {
    return <div className="ecc-object ecc-section opacity-70">No units associated.</div>;
  }
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {units.map(u => (
        <MiniCard
          key={String(u.id)}
          title={u.unit_number ? `Unit ${u.unit_number}` : `Unit #${u.id}`}
          subtitle={[u.beds ? `${u.beds} bd` : '', u.baths ? `${u.baths} ba` : ''].filter(Boolean).join(' • ') || undefined}
          href={`/card/unit/${u.id}`}
        />
      ))}
    </div>
  );
}