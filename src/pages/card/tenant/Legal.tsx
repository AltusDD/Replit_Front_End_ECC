export default function Legal({ data }: { data?: any }) {
  const tenant = data?.tenant;
  const lease = data?.lease;
  const unit = data?.unit;

  const rows = [
    { label: "Tenant Status", value: tenant?.status || "Not available" },
    { label: "Current Lease", value: lease?.doorloop_id || lease?.id || "No active lease" },
    { label: "Lease Status", value: lease?.status || "Not available" },
    { label: "Move-in Date", value: lease?.start_date || "Not available" },
    { label: "Lease End", value: lease?.end_date || "Not available" },
    { label: "Unit", value: unit?.unit_number || unit?.name || unit?.id || "Not available" },
  ];

  return (
    <div className="space-y-3" data-testid="tab-legal">
      <section className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4">
        <div className="text-sm font-semibold text-[var(--text)]">Tenant Compliance Summary</div>
        <div className="mt-1 text-sm text-[var(--text-dim)]">
          Read-only legal and occupancy posture from the current mounted tenant card data. This tab does not invent notices, filings, or case records.
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
