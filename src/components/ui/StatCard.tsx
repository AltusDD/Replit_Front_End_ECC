import Badge from './Badge';
export default function StatCard({
  title,
  value,
  badge,
  hint
}: {
  title: string;
  value: string | number;
  badge?: { tone?: 'neutral' | 'info' | 'success' | 'warn' | 'danger'; text: string } | null;
  hint?: string;
}) {
  return (
    <div className="panel" style={{ minWidth: 220 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ color: 'var(--muted)', fontSize: 12, textTransform: 'uppercase' }}>{title}</div>
        {badge && <Badge tone={badge.tone ?? 'neutral'}>{badge.text}</Badge>}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{value}</div>
      {hint && <div style={{ color: 'var(--muted)', marginTop: 6, fontSize: 12 }}>{hint}</div>}
    </div>
  );
}
