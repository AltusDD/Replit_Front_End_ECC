import { useEffect, useMemo, useState } from 'react'

export const API_BASE = import.meta.env.VITE_API_BASE || '/api'
const COLL_BASE = import.meta.env.VITE_API_COLLECTION_BASE || ''
const KEY = import.meta.env.VITE_API_KEY || ''
const HEADERS: Record<string,string> = { Accept:'application/json' }
if (KEY) HEADERS['x-api-key'] = KEY

export function buildUrl(path: string, params?: Record<string, any>): string {
  let out = path
  if (!/^https?:\/\//i.test(path)) {
    if (!path.startsWith('/')) out = `${API_BASE.replace(/\/$/,'')}/${path}`
  }
  if (params && Object.keys(params).length) {
    const s = new URLSearchParams()
    for (const [k,v] of Object.entries(params)) if (v != null) s.set(k,String(v))
    out += (out.includes('?') ? '&' : '?') + s.toString()
  }
  return out
}

export async function fetchJSON<T=any>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, { ...init, headers: { ...HEADERS, ...(init.headers||{}) } })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

export async function fetchJSONWithHeaders(url: string, init: RequestInit = {}){
  const res = await fetch(url, { ...init, headers: { ...HEADERS, ...(init.headers||{}) } })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  const json = await res.json().catch(()=>null)
  return { json, headers: res.headers }
}

export async function fetchCollection(col: string, qs: string) {
  const base = COLL_BASE ? COLL_BASE.replace(/\/$/,'') : API_BASE.replace(/\/$/,'')
  const attempts = [
    `${base}/portfolio/${col}${qs}`,
    `${base}/${col}${qs}`,
  ]
  for (const u of attempts) {
    try { return await fetchJSON<any>(u) } catch {}
  }
  throw new Error(`Collection not found for "${col}"`)
}

export function useCollection(col: string, params: Record<string, any> = {}) {
  const qs = useMemo(() => {
    const s = new URLSearchParams()
    Object.entries(params).forEach(([k,v]) => v != null && s.set(k,String(v)))
    const q = s.toString()
    return q ? `?${q}` : ''
  }, [JSON.stringify(params)])

  const [data,set] = useState<any[]>([])
  const [loading,setL] = useState(true)
  const [error,setE] = useState<any>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      setL(true); setE(null)
      try {
        const json = await fetchCollection(col, qs)
        if (!alive) return
        const rows =
          Array.isArray(json?.items) ? json.items :
          Array.isArray(json?.data) ? json.data :
          Array.isArray(json) ? json : []
        set(rows)
      } catch (e) { if (alive) { setE(e); set([]) } }
      finally { if (alive) setL(false) }
    })()
    return () => { alive = false }
  }, [col, qs])

  return { data, loading, error }
}

/** Dashboard counts: try RPC -> counts -> headers total -> naive length fallback. */
export function useCounts() {
  const [data,set] = useState<any|null>(null)
  const [loading,setL] = useState(true)
  const [error,setE] = useState<any>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      setL(true); setE(null)
      const cols = ['properties','units','leases','tenants','owners']
      try {
        // 1) RPC
        for (const candidate of [
          `${API_BASE.replace(/\/$/,'')}/rpc/portfolio_counts`,
          `${API_BASE.replace(/\/$/,'')}/portfolio/counts`
        ]) {
          try {
            const rpc = await fetchJSON<any>(candidate)
            if (rpc && typeof rpc === 'object') { set(rpc); setL(false); return }
          } catch {}
        }
        // 2) Per-collection best-effort
        const out: Record<string,number> = {}
        for (const c of cols) {
          // count endpoint?
          try {
            const { json } = await fetchJSONWithHeaders(`${API_BASE.replace(/\/$/,'')}/portfolio/${c}/count`)
            if (json && typeof json.count === 'number') { out[c] = json.count; continue }
          } catch {}

          // headers total?
          try {
            const { json, headers } = await fetchJSONWithHeaders(`${API_BASE.replace(/\/$/,'')}/portfolio/${c}?limit=1`)
            const h = Number(headers.get('x-total-count') || headers.get('x-total') || '')
            const t = Number((json && (json.total || json?.meta?.total)) || '')
            if (!Number.isNaN(h) && h > 0) { out[c] = h; continue }
            if (!Number.isNaN(t) && t > 0) { out[c] = t; continue }
          } catch {}

          // naive fallback (may undercount if server pages)
          try {
            const arr = await fetchJSON<any>(`${API_BASE.replace(/\/$/,'')}/portfolio/${c}`)
            const len = Array.isArray(arr?.items) ? arr.items.length :
                        Array.isArray(arr?.data) ? arr.data.length :
                        Array.isArray(arr) ? arr.length : 0
            out[c] = len
          } catch { out[c] = 0 }
        }
        if (alive) set(out)
      } catch (e) { if (alive) setE(e) }
      finally { if (alive) setL(false) }
    })()
    return () => { alive = false }
  }, [])

  return { data, loading, error }
}
