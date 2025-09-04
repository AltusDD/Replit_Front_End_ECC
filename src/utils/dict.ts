type Keyer<T, K extends PropertyKey> = keyof T | ((row: T) => K);

function getKey<T, K extends PropertyKey>(row: T, keyer: Keyer<T, K>): K {
  if (typeof keyer === "function") return keyer(row);
  return (row as any)[keyer] as K;
}

/** Make a map {id: row} */
export function indexBy<T, K extends PropertyKey>(
  rows: T[] = [],
  keyer: Keyer<T, K>
): Record<K, T> {
  return rows.reduce((acc: any, row) => {
    const k = getKey(row, keyer);
    acc[k] = row;
    return acc;
  }, {} as Record<K, T>);
}

/** Group into {key: T[]} */
export function groupBy<T, K extends PropertyKey>(
  rows: T[] = [],
  keyer: Keyer<T, K>
): Record<K, T[]> {
  return rows.reduce((acc: any, row) => {
    const k = getKey(row, keyer);
    (acc[k] || (acc[k] = [])).push(row);
    return acc;
  }, {} as Record<K, T[]>);
}
