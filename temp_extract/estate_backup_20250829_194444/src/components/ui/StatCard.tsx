import Badge from './Badge';
export default function StatCard({title,value,badge,hint}:{title:string;value:string|number;badge?:{tone?:'neutral'|'info'|'success'|'warn'|'danger';text:string}|null;hint?:string;}){
  return (
    <div className="card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
        <div className="title">{title}</div>
        {badge && <Badge tone={badge.tone ?? 'neutral'}>{badge.text}</Badge>}
      </div>
      <div className="value">{value}</div>
      {hint && <div style={{color:'var(--muted)',marginTop:6,fontSize:12}}>{hint}</div>}
    </div>
  );
}
