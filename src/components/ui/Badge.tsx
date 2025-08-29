type Tone = 'neutral' | 'info' | 'success' | 'warn' | 'danger';

export default function Badge({
  tone = 'neutral',
  children
}: {
  tone?: Tone;
  children: React.ReactNode;
}) {
  return (
    <span className={`badge ${tone}`}>
      {children}
    </span>
  );
}