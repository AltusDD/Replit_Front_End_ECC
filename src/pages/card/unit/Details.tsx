import React from 'react';
import { FieldGroup } from "@/components/cardkit/FieldGroup";
// ECC Guardrail compliance
export default function Details({ fields }:{ fields?: {label:string; value:any}[] }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {(fields ?? []).map((field, i) => (
        <FieldGroup key={i} label={field.label} value={field.value} />
      ))}
    </div>
  );
}