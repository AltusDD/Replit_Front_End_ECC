import { useState } from 'react'
import { API_BASE, fetchJSON } from '@lib/useApi'
export default function Probe(){
  const [path,setPath] = useState('/api/health')
  const [resp,setResp] = useState<any>(null)
  const [ok,setOk] = useState<boolean|null>(null)

  const go = async () => {
    try { setResp(await fetchJSON(path)); setOk(true) }
    catch(e:any){ setResp({ error: String(e?.message||e) }); setOk(false) }
  }

  return (
    <div>
      <h1>API Probe</h1>
      <div className="panel">
        <div className="row">
          <input value={path} onChange={e=>setPath(e.target.value)} style="padding:8px;border-radius:8px;border:1px solid var(--border);background:var(--panel);color:var(--text);min-width:320px" />
          <button onClick={go}>Probe API</button>
        </div>
        <div className="mt-16"><span className="badge">{ok===null?'Idle': ok?'Success':'Failed'}</span></div>
        <pre className="panel" style="margin-top:12px; overflow:auto; white-space:pre-wrap">{JSON.stringify(resp,null,2)}</pre>
        <div className="mt-16">Target: <code>{API_BASE}</code></div>
      </div>
    </div>
  )
}
