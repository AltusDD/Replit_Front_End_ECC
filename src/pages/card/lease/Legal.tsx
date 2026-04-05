export default function Legal({ data }: { data?: any }) {
  const lease = data?.lease;
  const unit = data?.unit;
  const tenant = data?.tenant;

  const rows = [
    { label: "Lease Status", value: lease?.status || "Not available" },
    { label: "Start Date", value: lease?.start_date || "Not available" },
    { label: "End Date", value: lease?.end_date || "Not available" },
    { label: "Lease Reference", value: lease?.doorloop_id || lease?.id || "Not available" },
    { label: "Unit", value: unit?.unit_number || unit?.label || unit?.id || "Not available" },
    { label: "Primary Tenant", value: tenant?.display_name || tenant?.name || tenant?.id || "Not available" },
  ];

  return (
    <div className="space-y-3" data-testid="tab-legal">
      <section className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4">
        <div className="text-sm font-semibold text-[var(--text)]">Lease Compliance Summary</div>
        <div className="mt-1 text-sm text-[var(--text-dim)]">
          Read-only legal and occupancy posture from the current mounted lease card data. This tab does not invent notices, filings, or case records.
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
