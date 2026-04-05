function formatCurrency(value: unknown): string {
  return typeof value === "number" && Number.isFinite(value)
    ? `$${Math.round(value).toLocaleString()}`
    : "Not available";
}

function formatAverageRent(owner: any): string {
  if (typeof owner?.avg_rent_cents === "number" && Number.isFinite(owner.avg_rent_cents)) {
    return formatCurrency(owner.avg_rent_cents / 100);
  }
  if (typeof owner?.avgRent_cents === "number" && Number.isFinite(owner.avgRent_cents)) {
    return formatCurrency(owner.avgRent_cents / 100);
  }
  if (typeof owner?.avgRent === "number" && Number.isFinite(owner.avgRent)) {
    return formatCurrency(owner.avgRent);
  }
  return "Not available";
}

function formatPercent(value: unknown): string {
  return typeof value === "number" && Number.isFinite(value)
    ? `${value.toFixed(1)}%`
    : "Not available";
}

export default function Financials({ data }: { data?: any }) {
  const owner = data?.owner;
  const properties = Array.isArray(data?.properties) ? data.properties : [];

  const rows = [
    { label: "Portfolio Units", value: owner?.portfolio_units ?? owner?.unitCount ?? owner?.total_units ?? "Not available" },
    { label: "Active Leases", value: owner?.active_leases ?? owner?.activeLeases ?? "Not available" },
    { label: "Occupancy", value: formatPercent(owner?.occupancy_pct ?? owner?.occupancyPct) },
    { label: "Average Rent", value: formatAverageRent(owner) },
    { label: "Properties Linked", value: properties.length || owner?.properties_count || "Not available" },
    { label: "Owner Status", value: owner?.status || "Not available" },
  ];

  return (
    <div className="space-y-3">
      <section className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4">
        <div className="text-sm font-semibold text-[var(--text)]">Owner Financial Summary</div>
        <div className="mt-1 text-sm text-[var(--text-dim)]">
          Read-only portfolio financial posture from the current mounted owner data. This tab does not invent statements, payouts, or ledger activity.
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
