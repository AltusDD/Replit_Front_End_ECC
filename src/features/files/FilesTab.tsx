import React, { useEffect, useMemo, useState } from "react";

type Props = {
  doorloop: boolean;
  dropbox: boolean;
  entity: "properties" | "units" | "leases" | "tenants" | "owners";
  refId: string | number;
};

type ListedFile = { id?:string; name:string; size?:number; modified?:string; url?:string; source:"DL"|"DBX" };

async function getJSON(url:string){
  const r = await fetch(url);
  if (!r.ok) return { ok:false, status:r.status };
  try { return await r.json(); } catch { return { ok:true, items:[] }; }
}

export default function FilesTab({ doorloop, dropbox, entity, refId }: Props){
  const [tab, setTab] = useState<"dl"|"dbx">(doorloop ? "dl" : "dbx");
  const [query, setQuery] = useState("");
  const [dl, setDL] = useState<ListedFile[]>([]);
  const [dbx, setDBX] = useState<ListedFile[]>([]);
  const [loading, setLoading] = useState(false);

  // fetch lists
  useEffect(()=>{ (async()=>{
    setLoading(true);
    try{
      if (doorloop){
        const j:any = await getJSON(`/api/files/doorloop/list?table=${entity}&ref_id=${refId}`);
        const items = (j?.items||[]).map((f:any)=>({ name:f.name||f.path||"File", size:f.size, modified:f.modified, url:f.url, source:"DL" as const }));
        setDL(items);
      } else setDL([]);
      if (dropbox){
        const j:any = await getJSON(`/api/files/dropbox/list?table=${entity}&ref_id=${refId}`);
        const items = (j?.items||[]).map((f:any)=>({ name:f.name||f.path||"File", size:f.size, modified:f.client_modified||f.modified, url:f.url, source:"DBX" as const }));
        setDBX(items);
      } else setDBX([]);
    } finally { setLoading(false); }
  })(); }, [doorloop, dropbox, entity, refId]);

  const current = useMemo(()=> (tab==="dl" ? dl : dbx).filter(f => !query || f.name.toLowerCase().includes(query.toLowerCase())), [tab, dl, dbx, query]);

  return (
    <div className="card">
      <div className="card-head">
        <div className="ecc-section-title">Files</div>
        <div className="flex items-center gap-2">
          <div className="ecc-tabs">
            <button className="ecc-tab" aria-selected={tab==="dl"} aria-disabled={!doorloop} onClick={()=> doorloop && setTab("dl")}>DoorLoop</button>
            <button className="ecc-tab" aria-selected={tab==="dbx"} aria-disabled={!dropbox} onClick={()=> dropbox && setTab("dbx")}>Dropbox</button>
          </div>
        </div>
      </div>

      <div className="filter">
        <input className="input" placeholder="Search all files…" value={query} onChange={e=>setQuery(e.target.value)} />
      </div>

      <div style={{padding:"10px 14px"}} className="list">
        {!doorloop && !dropbox ? (
          <div className="text-sm text-neutral-400">No file sources connected. Connect Dropbox or DoorLoop to manage files.</div>
        ) : loading ? (
          <div className="text-sm text-neutral-400">Loading files…</div>
        ) : current.length === 0 ? (
          <div className="text-sm text-neutral-400">No files.</div>
        ) : current.map((f, i) => (
          <div key={i} className="ecc-file-row">
            <div className="truncate">
              <div className="font-medium text-[13px] truncate">{f.name}</div>
              <small>{f.source}{f.modified ? ` • ${new Date(f.modified).toLocaleDateString()}` : ""}</small>
            </div>
            {f.url ? <a className="text-[12px] underline" href={f.url} target="_blank">Open</a> : <span className="text-[12px] text-neutral-500">No link</span>}
          </div>
        ))}
      </div>
    </div>
  );
}