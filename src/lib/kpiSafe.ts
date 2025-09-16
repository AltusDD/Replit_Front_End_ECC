export function pct(numerator?: number | null, denominator?: number | null): number | null {
  if (typeof numerator !== "number" || typeof denominator !== "number") return null;
  if (denominator <= 0) return null;
  return Math.round((numerator / denominator) * 100);
}

export function asMoneyCents(cents?: number | null): string | null {
  if (typeof cents !== "number") return null;
  const dollars = cents / 100;
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(dollars);
  } catch {
    return `$${Math.round(dollars)}`;
  }
}

export function asInt(n?: number | null): number | null {
  return typeof n === "number" ? Math.round(n) : null;
}