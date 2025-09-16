// src/lib/http.ts
export function isAbortError(e: unknown) {
  return (
    (e instanceof DOMException && e.name === "AbortError") ||
    /AbortError|aborted/i.test(String((e as any)?.message ?? e))
  );
}

export async function fetchJSON<T>(input: RequestInfo, init?: RequestInit & { signal?: AbortSignal }) {
  try {
    const res = await fetch(input, init);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch (err) {
    if (isAbortError(err) || init?.signal?.aborted) {
      // never reject; prevents error boundaries & log spam during HMR
      return new Promise<T>(() => {});
    }
    throw err;
  }
}

export async function jget<T=any>(u:string):Promise<T|null>{
  try{const r=await fetch(u); if(!r.ok) return null; return await r.json();}catch{return null;}
}
export function fmtMoney(n:number|undefined|null){ if(n==null||isNaN(Number(n))) return "—"; return `$${Number(n).toLocaleString()}`;}