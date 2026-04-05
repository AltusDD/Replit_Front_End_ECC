export default function Legal({ data }: { data?: any }) {
  const owner = data?.owner;
  const properties = Array.isArray(data?.properties) ? data.properties : [];

  const rows = [
    { label: "Owner Status", value: owner?.status || "Not available" },
    { label: "Properties Linked", value: properties.length || owner?.properties_count || "Not available" },
    { label: "Portfolio Units", value: owner?.portfolio_units ?? owner?.total_units ?? "Not available" },
    { label: "Primary Email", value: owner?.email || owner?.primary_email || "Not available" },
    { label: "Primary Phone", value: owner?.phone || owner?.primary_phone || "Not available" },
    {
      label: "Mailing Address",
      value:
        [owner?.street_1, owner?.city, owner?.state].filter(Boolean).join(", ") || "Not available",
    },
  ];

  return (
    <div className="space-y-3" data-testid="tab-legal">
      <section className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4">
        <div className="text-sm font-semibold text-[var(--text)]">Owner Compliance Summary</div>
        <div className="mt-1 text-sm text-[var(--text-dim)]">
          Read-only legal and ownership posture from the current mounted owner card data. This tab does not invent notices, filings, or case records.
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
