type Props = { status?: string | null; testid?: string };
export default function StatusTag({ status, testid = "status-tag" }: Props) {
  const s = String(status ?? "").toLowerCase();
  const variant =
    s === "active" || s === "current" || s === "occupied" ? "ok" :
    s === "pending" || s === "future" ? "warn" :
    s === "ended" || s === "terminated" || s === "closed" ? "bad" : "info";
  const cls =
    variant === "ok"   ? "bg-emerald-900/40 text-emerald-300 border-emerald-700" :
    variant === "warn" ? "bg-amber-900/40 text-amber-300 border-amber-700" :
    variant === "bad"  ? "bg-rose-900/40 text-rose-300 border-rose-700" :
                         "bg-neutral-800 text-neutral-200 border-neutral-700";
  return (
    <span data-testid={testid} className={`inline-flex items-center px-2 py-0.5 rounded border ${cls}`}>
      {status ?? "—"}
    </span>
  );
}