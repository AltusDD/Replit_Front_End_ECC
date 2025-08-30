export default function StatCard({ title, value, loading }: { title: string; value?: number|string; loading?: boolean }) {
  return (
    <div className="panel stat">
      <h4>{title}</h4>
      <div className="num">{loading ? '…' : (value ?? '…')}</div>
    </div>
  );
}
