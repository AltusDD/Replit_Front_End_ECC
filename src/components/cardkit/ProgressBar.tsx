export default function ProgressBar({
  percent,
  value,
  max = 100,
  testid = "progress",
  ariaLabel,
}: {
  percent?: number | null;
  value?: number | null;
  max?: number;
  testid?: string;
  ariaLabel?: string;
}) {
  let p = typeof percent === "number" ? percent : (Number(value ?? 0) / Number(max || 100)) * 100;
  if (!Number.isFinite(p)) p = 0;
  p = Math.max(0, Math.min(100, Math.round(p)));
  const gold = "var(--altus-gold, #C8A948)";
  return (
    <div className="w-full h-2 rounded bg-neutral-800 overflow-hidden" data-testid={testid} aria-label={ariaLabel || "progress"}>
      <div className="h-full" style={{ width: `${p}%`, backgroundColor: gold }} />
    </div>
  );
}