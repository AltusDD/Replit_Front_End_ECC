function formatCurrencyFromCents(value: unknown): string {
  return typeof value === "number" && Number.isFinite(value)
    ? `$${Math.round(value / 100).toLocaleString()}`
    : "Not available";
}

function formatPercent(value: unknown): string {
  return typeof value === "number" && Number.isFinite(value)
    ? `${Math.round(value)}%`
    : "Not available";
}

export default function Financials({ data }: { data?: any }) {
  const property = data?.property;
  const kpis = data?.kpis;

  const rows = [
    { label: "Units", value: typeof kpis?.units === "number" ? kpis.units.toLocaleString() : "Not available" },
    { label: "Active Leases", value: typeof kpis?.activeLeases === "number" ? kpis.activeLeases.toLocaleString() : "Not available" },
    { label: "Occupancy", value: formatPercent(kpis?.occupancyPct) },
    { label: "Average Rent", value: formatCurrencyFromCents(kpis?.avgRentCents) },
    { label: "Property Status", value: property?.status || "Not available" },
    { label: "DoorLoop ID", value: property?.doorloop_id || "Not available" },
  ];

  return (
    <div className="space-y-3">
      <section className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4">
        <div className="text-sm font-semibold text-[var(--text)]">Property Financial Summary</div>
        <div className="mt-1 text-sm text-[var(--text-dim)]">
          Read-only portfolio posture from the current mounted property KPI data. This tab does not invent delinquency aging, ledger rows, or BFF-backed transactions.
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
