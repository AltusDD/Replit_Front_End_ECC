// src/utils/net.ts
export const isAbortError = (e: any): boolean =>
  !!e && (e.name === "AbortError" || e.code === 20 || String(e).includes("AbortError"));

export async function fetchJSON<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit & { signal?: AbortSignal }
): Promise<T> {
  const res = await fetch(input, { credentials:"include", ...init });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} for ${input}`);
  }
  return (await res.json()) as T;
}

/** Guards setState after unmount and silences AbortErrors */
export function guardAsync(
  fn: () => Promise<void>
) {
  let alive = true;
  const stop = () => { alive = false; };
  const run = async () => {
    try {
      await fn();
    } catch (e) {
      if (isAbortError(e)) return; // swallow aborts
      throw e; // let caller handle real errors
    }
  };
  return { run, stop, aliveRef: () => alive };
}