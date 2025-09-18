export const isFiniteNumber = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);
export const n = (v?: number | null): number | undefined =>
  isFiniteNumber(v) ? v : undefined;
export const cents = (v?: number | null): number | undefined =>
  isFiniteNumber(v) ? v / 100 : undefined;
export const pct = (v?: number | null): number | undefined =>
  isFiniteNumber(v) ? v : undefined;
export const safe = <T,>(v: T | null | undefined, d: T): T => (v ?? d);
