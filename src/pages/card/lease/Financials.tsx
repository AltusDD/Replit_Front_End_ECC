function formatCurrency(value: unknown): string {
  return typeof value === "number" && Number.isFinite(value) ? `$${Math.round(value).toLocaleString()}` : "Not available";
}

function formatMoneyFromLease(lease: any, centsKey: string, rawKey: string): string {
  if (typeof lease?.[centsKey] === "number" && Number.isFinite(lease[centsKey])) {
    return formatCurrency(lease[centsKey] / 100);
  }
  if (typeof lease?.[rawKey] === "number" && Number.isFinite(lease[rawKey])) {
    return formatCurrency(lease[rawKey]);
  }
  return "Not available";
}

export default function Financials({ data }: { data?: any }) {
  const lease = data?.lease ?? data;

  const rows = [
    { label: "Monthly Rent", value: formatMoneyFromLease(lease, "rent_cents", "rent") },
    { label: "Current Balance", value: formatMoneyFromLease(lease, "balance_cents", "balance") },
    { label: "Security Deposit", value: formatMoneyFromLease(lease, "security_deposit_cents", "security_deposit") },
    { label: "Lease Status", value: lease?.status || "Not available" },
    { label: "Term", value: lease?.term || lease?.expiration || "Not available" },
    { label: "Start Date", value: lease?.start_date || "Not available" },
    { label: "End Date", value: lease?.end_date || "Not available" },
  ];

  return (
    <div className="space-y-3">
      <section className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4">
        <div className="text-sm font-semibold text-[var(--text)]">Lease Financial Summary</div>
        <div className="mt-1 text-sm text-[var(--text-dim)]">
          Read-only lease financial posture from the current mounted card data. This tab does not invent ledger transactions.
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
