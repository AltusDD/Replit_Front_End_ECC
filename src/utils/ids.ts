export const normalizeId = (v: unknown): string => {
  if (v === null || v === undefined) return "";
  return String(v);
};