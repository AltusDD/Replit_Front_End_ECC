export default function Legal({ data }: { data?: any }) {
  const unit = data?.unit;
  const lease = data?.lease;
  const property = data?.property;

  const rows = [
    { label: "Unit Status", value: unit?.status || "Not available" },
    { label: "Linked Lease", value: lease?.id || lease?.doorloop_id || "None linked" },
    { label: "Lease Status", value: lease?.status || "No active lease" },
    { label: "Parent Property", value: property?.name || property?.address_street1 || property?.street1 || "Not available" },
  ];

  return (
    <div className="space-y-3" data-testid="tab-legal">
      <section className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4">
        <div className="text-sm font-semibold text-[var(--text)]">Unit Compliance Summary</div>
        <div className="mt-1 text-sm text-[var(--text-dim)]">
          Read-only legal and compliance posture from the current mounted unit card data. This tab does not invent violations, notices, or case records.
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
