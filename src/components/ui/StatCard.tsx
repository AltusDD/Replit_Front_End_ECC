export default function StatCard({ label, value }:{label:string; value:React.ReactNode}) {
  return (
    <div className="card">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </div>
  );
}
