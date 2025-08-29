type Tone = 'neutral' | 'info' | 'success' | 'warn' | 'danger';
const colors: Record<Tone, string> = {
  neutral: 'background:var(--panel);color:var(--text);border:1px solid var(--border)',
  info: 'background:rgba(59,130,246,.15);color:#93c5fd;border:1px solid rgba(59,130,246,.35)',
  success: 'background:rgba(22,163,74,.15);color:#86efac;border:1px solid rgba(22,163,74,.35)',
  warn: 'background:rgba(245,158,11,.15);color:#fcd34d;border:1px solid rgba(245,158,11,.35)',
  danger: 'background:rgba(239,68,68,.15);color:#fca5a5;border:1px solid rgba(239,68,68,.35)'
};
export default function Badge({
  tone = 'neutral',
  children
}: {
  tone?: Tone;
  children: React.ReactNode;
}) {
  return (
    <span
      style={{
        borderRadius: 999,
        padding: '4px 10px',
        fontSize: 12,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        ...(Object.fromEntries(
          colors[tone].split(';').filter(Boolean).map((kv) => {
            const [k, v] = kv.split(':');
            return [k.trim() as any, v.trim()];
          })
        ) as any)
      }}
    >
      {children}
    </span>
  );
}
