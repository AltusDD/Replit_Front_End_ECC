export default function StatCard({ label, value, loading }: { label:string; value:number|string; loading?:boolean }) {
  return (
    <div className="stat">
      <div className="label">{label}</div>
      <div className="value">{loading ? '…' : value}</div>
    </div>
  )
}
