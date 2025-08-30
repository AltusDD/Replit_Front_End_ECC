import { useEffect, useMemo, useState } from 'react';

export const API_BASE = import.meta.env.VITE_API_BASE || '/api';
const HEADERS: Record<string,string> = { Accept:'application/json' };
const KEY = import.meta.env.VITE_API_KEY || ''; if (KEY) HEADERS['x-api-key'] = KEY;

export function buildUrl(path:string, params?:Record<string,any>) {
  let u = /^https?:\/\//i.test(path) ? path : (path.startsWith('/') ? path : `${API_BASE.replace(/\/$/,'')}/${path}`);
  if (params && Object.keys(params).length) {
    const s = new URLSearchParams();
    Object.entries(params).forEach(([k,v])=> v!=null && s.set(k, String(v)));
    const q = s.toString(); if (q) u += (u.includes('?') ? '&' : '?')+q;
  }
  return u;
}
export async function fetchJSON<T=any>(url:string, init:RequestInit={}) {
  const res = await fetch(url, {...init, headers:{...HEADERS, ...(init.headers||{})}});
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}
export function useCounts(){
  const [data,set] = useState<any|null>(null);
  const [loading,setL] = useState(true);
  const [error,setE] = useState<any>(null);
  useEffect(()=>{(async()=>{
    setL(true); setE(null);
    const tries = [
      buildUrl('/api/portfolio/counts'),
      buildUrl('/api/counts'),
      buildUrl('portfolio/counts'),
      buildUrl('counts'),
      buildUrl('/api/rpc/portfolio_counts')
    ];
    for (const u of tries) {
      try { set(await fetchJSON(u)); setL(false); return; } catch {}
    }
    setE(new Error('Counts endpoint not found')); setL(false);
  })()},[]);
  return {data, loading, error};
}
export function useCollection(col:string, params:Record<string,any>={}){
  const qs = useMemo(()=>{const s=new URLSearchParams();Object.entries(params).forEach(([k,v])=>v!=null&&s.set(k,String(v)));const q=s.toString();return q?`?${q}`:''},[JSON.stringify(params)]);
  const [data,set]=useState<any[]>([]); const [loading,setL]=useState(true); const [error,setE]=useState<any>(null);
  useEffect(()=>{let live=true;(async()=>{
    setL(true); setE(null);
    const tries = [
      buildUrl(`/api/portfolio/${col}${qs}`),
      buildUrl(`/api/${col}${qs}`),
      buildUrl(`portfolio/${col}${qs}`),
      buildUrl(`${col}${qs}`)
    ];
    for (const u of tries) {
      try { const j:any = await fetchJSON(u); if(!live) return;
        const rows = Array.isArray(j?.items)?j.items : Array.isArray(j?.data)?j.data : Array.isArray(j)?j : [];
        set(rows); setL(false); return;
      } catch {}
    }
    if(live){ set([]); setE(new Error('No collection found')); setL(false); }
  })(); return()=>{live=false}},[col,qs]);
  return {data, loading, error};
}