import { useState } from "react";
import { buildUrl } from "@lib/useApi";

export default function ApiProbe(){
  const [path, setPath] = useState("/api/health");
  const [out, setOut] = useState<any>(null);
  const [ok, setOk] = useState<boolean|null>(null);

  async function run(){
    setOk(null);
    try{
      const res = await fetch(buildUrl(path));
      const j = await res.json();
      setOut(j); setOk(res.ok);
    }catch(e:any){ setOut({error:String(e)}); setOk(false); }
  }

  return (
    <>
      <h1 className="pageTitle">API Probe</h1>
      <div className="panel" style={{padding:12, marginBottom:16}}>
        <div style={{display:"flex", gap:8}}>
          <input value={path} onChange={e=>setPath(e.target.value)} style={{flex:1,border:"1px solid var(--border)",background:"transparent",color:"var(--text)",padding:"8px",borderRadius:"8px"}} />
          <button className="btn" onClick={run}>Probe</button>
        </div>
        <div style={{marginTop:10}} className="kv">
          <div className="kvp">ok: {String(ok)}</div>
          <div className="kvp">target: {buildUrl(path)}</div>
        </div>
      </div>
      <div className="panel" style={{padding:12}}><pre style={{whiteSpace:"pre-wrap"}}>{JSON.stringify(out, null, 2)}</pre></div>
    </>
  );
}
