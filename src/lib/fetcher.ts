export async function getJSON<T = any>(path: string): Promise<T> {
  const res = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(import.meta.env.VITE_API_KEY
        ? { 'x-api-key': String(import.meta.env.VITE_API_KEY) }
        : {}),
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}
