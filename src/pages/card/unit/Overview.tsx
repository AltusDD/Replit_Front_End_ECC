import React from 'react';
import { FieldGroup } from "@/components/cardkit/FieldGroup";
// ECC Guardrail compliance
export default function Overview({ unit, property }:{ unit?: any|null; property?: any|null }) {
  const propName = property?.name || property?.address_street1 || property?.street1 || "Unlinked property";
  const rows = [
    { label:'Property', value: propName, href: property?`/card/property/${property.id}`:undefined },
    { label:'Unit Number', value: unit?.unit_number || 'Not specified' },
    { label:'Beds', value: unit?.beds || 'Not specified' },
    { label:'Baths', value: unit?.baths || 'Not specified' },
    { label:'Sqft', value: unit?.sqft || 'Not specified' },
    { label:'Market Rent', value: unit?.rent_cents!=null? `$${Math.round(unit.rent_cents/100)}`:'Not set' },
    { label:'Status', value: unit?.status || 'Unknown' },
  ];
  return (
    <div className="grid grid-cols-2 gap-4">
      {rows.map((row, i) => (
        <FieldGroup key={i} label={row.label} value={row.value} />
      ))}
    </div>
  );
}