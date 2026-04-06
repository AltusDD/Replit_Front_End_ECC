export default function Legal({ data }: { data?: any }) {
  const property = data?.property;
  const owner = data?.owner;
  const kpis = data?.kpis;

  const rows = [
    { label: "Assessor Parcel", value: property?.apn || property?.parcel_id || "Not available" },
    { label: "Property Class", value: property?.property_class || property?.type || "Not available" },
    { label: "Portfolio Occupancy", value: typeof kpis?.occupancyPct === "number" ? `${Math.round(kpis.occupancyPct)}%` : "Not available" },
    { label: "Registered Owner", value: owner?.display_name || owner?.name || owner?.id || "Not available" },
    { label: "Created", value: property?.created_at || "Not available" },
    { label: "Updated", value: property?.updated_at || "Not available" },
  ];

  return (
    <div className="space-y-3" data-testid="tab-legal">
      <section className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4">
        <div className="text-sm font-semibold text-[var(--text)]">Property Compliance Summary</div>
        <div className="mt-1 text-sm text-[var(--text-dim)]">
          Read-only assessor and ownership posture from the current mounted property card data. This tab does not invent GIS links, notices, filings, or case records.
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
