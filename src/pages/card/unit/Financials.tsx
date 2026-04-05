function formatCurrency(value: unknown): string {
  return typeof value === "number" && Number.isFinite(value)
    ? `$${Math.round(value).toLocaleString()}`
    : "Not available";
}

function formatMoneyFromEntity(entity: any, centsKey: string, rawKey: string): string {
  if (typeof entity?.[centsKey] === "number" && Number.isFinite(entity[centsKey])) {
    return formatCurrency(entity[centsKey] / 100);
  }
  if (typeof entity?.[rawKey] === "number" && Number.isFinite(entity[rawKey])) {
    return formatCurrency(entity[rawKey]);
  }
  return "Not available";
}

export default function Financials({ data }: { data?: any }) {
  const unit = data?.unit;
  const lease = data?.lease;
  const property = data?.property;

  const rows = [
    { label: "Market Rent", value: formatMoneyFromEntity(unit, "rent_cents", "rent") },
    { label: "Linked Lease", value: lease?.id || lease?.doorloop_id || "Not available" },
    { label: "Lease Status", value: lease?.status || unit?.status || "Not available" },
    { label: "Unit Status", value: unit?.status || "Not available" },
    { label: "Parent Property", value: property?.name || property?.address_street1 || property?.street1 || "Not available" },
    { label: "Beds / Baths", value: unit?.beds != null || unit?.baths != null ? `${unit?.beds ?? "?"} / ${unit?.baths ?? "?"}` : "Not available" },
    { label: "Square Feet", value: unit?.sq_ft || unit?.sqft || "Not available" },
  ];

  return (
    <div className="space-y-3">
      <section className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4">
        <div className="text-sm font-semibold text-[var(--text)]">Unit Financial Summary</div>
        <div className="mt-1 text-sm text-[var(--text-dim)]">
          Read-only financial posture from the current mounted unit, lease, and property data. This tab does not invent ledger transactions.
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {rows.map((row) => (
            <div key={row.label} className="rounded-lg border border-[var(--line)] bg-[var(--panel-elev)] px-3 py-2">
              <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-dim)]">{row.label}</div>
              <div className="mt-1 text-sm font-medium text-[var(--text)]">{row.value}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
