import React from 'react';
// ECC Guardrail compliance
export default function Linked({ activeLease, tenant }:{ activeLease?: any|null; tenant?: any|null }) {
  return (
    <div className="grid gap-3">
      <MiniCard title={activeLease ? `Lease ${activeLease.doorloop_id ?? activeLease.id}` : 'No lease'} href={activeLease?`/card/lease/${activeLease.id}`:undefined}/>
      <MiniCard title={tenant?.display_name ?? 'No tenant'} href={tenant?`/card/tenant/${tenant.id}`:undefined}/>
    </div>
  );
}