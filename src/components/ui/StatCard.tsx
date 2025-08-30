import Badge from './Badge';
export default function StatCard({
  title, value, badge, trend
}:{ title:string; value:React.ReactNode; badge?:{tone?:'neutral'|'info'|'success'|'warn'|'danger'; text:string}; trend?:string; }){
  return (
    <div className="card">
      <h6>{title}</h6>
      <div className="n">{value ?? '—'}</div>
      <div style={{display:'flex',gap:8,marginTop:8,alignItems:'center'}}>
        {badge ? <Badge tone={badge.tone||'neutral'}>{badge.text}</Badge> : null}
        {trend ? <span style={{color:'var(--muted)'}}>{trend}</span> : null}
      </div>
    </div>
  );
}