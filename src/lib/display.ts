export function textOrDash(v: unknown): string {
  return v === null || v === undefined || v === '' ? '—' : String(v);
}
export function numOrDash(v: unknown): string | number {
  return (typeof v === 'number' && Number.isFinite(v)) ? v : '—';
}
export function moneyOrDashCents(cents: unknown): string {
  if (typeof cents === 'number' && Number.isFinite(cents)) {
    return `$${(cents / 100).toLocaleString()}`;
  }
  return '—';
}
export type Addr = { line1?: string | null; city?: string | null; state?: string | null; zip?: string | null };
export function addressLine(addr?: Addr): string {
  if (!addr) return '—';
  const parts: string[] = [];
  if (addr.line1) parts.push(String(addr.line1));
  const tail = [addr.city, addr.state, addr.zip].filter(Boolean).join(' ');
  if (tail) parts.push(tail);
  return parts.join(', ') || '—';
}