import React from 'react';
// ECC Guardrail compliance
export default function Linked({ property, unit, tenant }:{ property?: any|null; unit?: any|null; tenant?: any|null }) {
  return (
    <div className="grid gap-3">
      <MiniCard title={property?.display_name || property?.street_1 || 'No property'} href={property?`/card/property/${property.id}`:undefined}/>
      <MiniCard title={unit?.unit_number ? `Unit ${unit.unit_number}` : 'No unit'} href={unit?`/card/unit/${unit.id}`:undefined}/>
      <MiniCard title={tenant?.display_name ?? 'No tenant'} href={tenant?`/card/tenant/${tenant.id}`:undefined}/>
    </div>
  );
}