// Throws on undefined / null; stops UI from masking with 0 / "—"
export function requireField<T>(value: T | null | undefined, path: string): T {
  if (value === null || value === undefined) {
    throw new Error(`[CONTRACT] Missing required field: ${path}`);
  }
  return value;
}
export function requireArray<T>(value: T[] | null | undefined, path: string): T[] {
  if (!Array.isArray(value)) throw new Error(`[CONTRACT] Expected array at: ${path}`);
  return value;
}