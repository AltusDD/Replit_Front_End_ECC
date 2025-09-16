import React from 'react';
// ECC Guardrail compliance
export default function Linked({ activeLease, property, unit }:{ activeLease?: any|null; property?: any|null; unit?: any|null }) {
  return (
    <div className="grid gap-3">
      <MiniCard title={activeLease ? `Lease ${activeLease.doorloop_id ?? activeLease.id}` : 'No lease'} href={activeLease?`/card/lease/${activeLease.id}`:undefined}/>
      <MiniCard title={property?.display_name || property?.street_1 || 'No property'} href={property?`/card/property/${property.id}`:undefined}/>
      <MiniCard title={unit?.unit_number ? `Unit ${unit.unit_number}` : 'No unit'} href={unit?`/card/unit/${unit.id}`:undefined}/>
    </div>
  );
}