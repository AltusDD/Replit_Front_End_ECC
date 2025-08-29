import { useEffect, useMemo, useState } from 'react';

export const API_BASE = import.meta.env.VITE_API_BASE || '/api';
const KEY = import.meta.env.VITE_API_KEY || '';
const HEADERS: Record<string,string> = { Accept: 'application/json' };
if (KEY) HEADERS['x-api-key'] = KEY;

export function buildUrl(path: string, params?: Record<string, any>){
  let out = path;
  if (!/^https?:\/\//i.test(path)) if (!path.startsWith('/')) out = `${API_BASE.replace(/\/$/,'')}/${path}`;
  if (params && Object.keys(params).length){
    const q = new URLSearchParams();
    for (const [k,v] of Object.entries(params)) if (v!=null) q.set(k, String(v));
    const s = q.toString(); if (s) out += (out.includes('?')?'&':'?') + s;
  }
  return out;
}

export async function fetchJSON<T=any>(url:string, init:RequestInit={}):Promise<T>{
  const r = await fetch(url, { ...init, headers: { ...HEADERS, ...(init.headers||{}) }});
  if(!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return r.json();
}

/** Exported for pages that need a raw list. Tries reasonable collection shapes. */
export async function fetchCollection(col:string, qs=''){
  const base = API_BASE.replace(/\/$/,'');
  const paths = [
    `${base}/portfolio/${col}${qs}`,
    `${base}/${col}${qs}`,
  ];
  for (const u of paths){ try { return await fetchJSON(u); } catch{} }
  throw new Error(`No collection endpoint worked for "${col}"`);
}

export function useCollection(col:string, params:Record<string,any>={}){
  const qs = useMemo(()=>{
    const q = new URLSearchParams(); Object.entries(params).forEach(([k,v])=>v!=null && q.set(k,String(v)));
    const s = q.toString(); return s ? `?${s}` : '';
  }, [JSON.stringify(params)]);

  const [data,set] = useState<any[]>([]);
  const [loading,setL] = useState(true);
  const [error,setE] = useState<any>(null);

  useEffect(()=>{
    let ok = true; setL(true); setE(null);
    (async()=>{
      try{
        const json = await fetchCollection(col, qs);
        if(!ok) return;
        const rows = Array.isArray(json?.items)?json.items : Array.isArray(json?.data)?json.data : Array.isArray(json)?json : [];
        set(rows);
      }catch(e){ if(ok){ setE(e); set([]);} }
      finally{ if(ok) setL(false); }
    })();
    return ()=>{ ok=false };
  }, [col, qs]);

  return { data, loading, error };
}

export function useCounts(){
  const [data,set] = useState<any|null>(null);
  const [loading,setL] = useState(true);
  const [error,setE] = useState<any>(null);

  useEffect(()=>{
    let ok=true; setL(true); setE(null);
    (async()=>{
      const base = API_BASE.replace(/\/$/,'');
      const candidates = [
        `${base}/rpc/portfolio_counts`,
        `${base}/portfolio/counts`,
        `${base}/counts`,
      ];
      let res:any=null;
      for(const u of candidates){ try{ res = await fetchJSON(u); if(res) break; }catch{} }
      if(!res){ setE(new Error('Counts endpoint not found')); }
      set(res||null);
      if(ok) setL(false);
    })();
    return ()=>{ ok=false }
  }, []);

  return { data, loading, error };
}
