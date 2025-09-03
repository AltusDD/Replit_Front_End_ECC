export type AnyObj = Record<string, any>;

export function pick<T extends AnyObj>(
  obj: T | null | undefined,
  map: Record<string, string | string[]>
) {
  if (!obj) return {};
  const out: AnyObj = {};
  for (const [outKey, inKey] of Object.entries(map)) {
    if (Array.isArray(inKey)) {
      const val = inKey.map(k => get(obj, k)).find(v => v !== undefined && v !== null);
      if (val !== undefined) out[outKey] = val;
    } else {
      const val = get(obj, inKey);
      if (val !== undefined) out[outKey] = val;
    }
  }
  return out;
}

function get(obj: AnyObj, path: string) {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj as any);
}
