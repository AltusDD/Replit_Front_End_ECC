type Tone = 'neutral'|'info'|'success'|'warn'|'danger';
export default function Badge({children, tone='neutral'}:{children:React.ReactNode, tone?:Tone}) {
  const style:Record<Tone,React.CSSProperties>={
    neutral:{ borderColor:'var(--border)', color:'var(--muted)' },
    info:{ borderColor:'color-mix(in srgb, var(--link) 40%, var(--border))', color:'var(--link)' },
    success:{ borderColor:'color-mix(in srgb, var(--success) 40%, var(--border))', color:'var(--success)' },
    warn:{ borderColor:'color-mix(in srgb, var(--warn) 40%, var(--border))', color:'var(--warn)' },
    danger:{ borderColor:'color-mix(in srgb, var(--danger) 40%, var(--border))', color:'var(--danger)' },
  };
  return <span className="badge" style={style[tone]}>{children}</span>;
}