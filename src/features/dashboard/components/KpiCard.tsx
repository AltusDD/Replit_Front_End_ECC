import React from "react";
const BLANK = "—";
const nf = (n?: number, d = 0) =>
  Number.isFinite(n!) ? n!.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d }) : BLANK;

export function KpiCard({
  label,
  value,
  decimals = 0,
  testId,
}: { label: string; value?: number; decimals?: number; testId: string }) {
  return (
    <div className="ecc-object p-4 rounded-2xl shadow-sm" data-testid={testId}>
      <div className="text-sm opacity-80">{label}</div>
      <div className="text-3xl font-semibold mt-1">{nf(value, decimals)}</div>
    </div>
  );
}