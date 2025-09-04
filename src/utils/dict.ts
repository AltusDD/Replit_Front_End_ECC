type Keyer<T, K extends PropertyKey> = keyof T | ((row: T) => K);

function getKey<T, K extends PropertyKey>(row: T, keyer: Keyer<T, K>): K {
  if (typeof keyer === "function") return keyer(row);
  return (row as any)[keyer] as K;
}

/** Make a map {id: row} */
export function indexBy<T, K extends PropertyKey>(
  rows: T[] = [],
  keyer: Keyer<T, K>
): Map<K, T> {
  return rows.reduce((acc, row) => {
    const k = getKey(row, keyer);
    acc.set(k, row);
    return acc;
  }, new Map<K, T>());
}

/** Group into {key: T[]} */
export function groupBy<T, K extends PropertyKey>(
  rows: T[] = [],
  keyer: Keyer<T, K>
): Map<K, T[]> {
  return rows.reduce((acc, row) => {
    const k = getKey(row, keyer);
    const existing = acc.get(k) || [];
    existing.push(row);
    acc.set(k, existing);
    return acc;
  }, new Map<K, T[]>());
}
