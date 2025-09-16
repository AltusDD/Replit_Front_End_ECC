import { useState } from "react";
import { apiGet, apiPost } from "@/lib/ecc-api";

export function useOwnerTransfer(){
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState<string|null>(null);
  const [last,setLast]=useState<any>(null);
  const call = async <T,>(fn:()=>Promise<T>) => {
    setLoading(true); setError(null);
    try { const r = await fn(); setLast(r); return r; }
    catch(e:any){ setError(e.message||"Request failed"); throw e; }
    finally { setLoading(false); }
  };
  return {
    loading,error,last,
    searchOwners:(q:string)=>apiGet(`/api/owners/search?q=${encodeURIComponent(q)}`),
    getContext:(ownerId:number|string)=>apiGet(`/api/owners/transfercontext?sourceOwnerId=${ownerId}`),
    initiate:(payload:any)=>call(()=>apiPost("/api/owners/initiatetransfer", payload)),
    approve:(payload:any)=>call(()=>apiPost("/api/owners/approvetransfer", payload, {admin:true})),
    authorize:(payload:any)=>call(()=>apiPost("/api/owners/authorizetransfer", payload, {admin:true})),
    executeNow:(payload:any)=>call(()=>apiPost("/api/owners/executetransfer", payload, {admin:true})),
  };
}