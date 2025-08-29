import { useEffect, useState } from 'react';
import { fetchCollection } from './ecc-api';
export function useCollection<T=any>(collection:string,params:{select?:string;order?:string;limit?:number}={}) {
  const [data,setData]=useState<T[]>([]); const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  useEffect(()=>{const ac=new AbortController(); setLoading(true); setError(null);
    fetchCollection(collection,{order:'updated_at.desc',...params,signal:ac.signal})
      .then(({items})=>!ac.signal.aborted&&setData(items as T[]))
      .catch(e=>{if(e?.name!=='AbortError'&&!ac.signal.aborted)setError(e as Error)})
      .finally(()=>!ac.signal.aborted&&setLoading(false));
    return ()=>ac.abort();
  },[collection,JSON.stringify(params)]);
  return {data,loading,error};
}
