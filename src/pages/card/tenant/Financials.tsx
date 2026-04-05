function formatCurrency(value: unknown): string {
  return typeof value === "number" && Number.isFinite(value) ? `$${Math.round(value).toLocaleString()}` : "Not available";
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
  const tenant = data?.tenant;
  const lease = data?.lease;

  const rows = [
    { label: "Current Balance", value: formatMoneyFromEntity(tenant, "balance_cents", "balance") },
    { label: "Monthly Rent", value: formatMoneyFromEntity(lease, "rent_cents", "rent") },
    { label: "Security Deposit", value: formatMoneyFromEntity(lease, "security_deposit_cents", "security_deposit") },
    { label: "Lease Status", value: lease?.status || tenant?.status || "Not available" },
    { label: "Move-in Date", value: lease?.start_date || "Not available" },
    { label: "Lease End", value: lease?.end_date || "Not available" },
    { label: "Lease Reference", value: lease?.doorloop_id || lease?.id || "Not available" },
  ];

  return (
    <div className="space-y-3">
      <section className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4">
        <div className="text-sm font-semibold text-[var(--text)]">Tenant Financial Summary</div>
        <div className="mt-1 text-sm text-[var(--text-dim)]">
          Read-only financial posture from the current mounted tenant and lease data. This tab does not invent ledger transactions.
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
