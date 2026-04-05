import { useState } from "react";
import { useOwnerTransfer } from "./hooks/useOwnerTransfer";

type Opt = { id:number|string; name?:string };

export default function OwnerTransferPage(){
  const {loading,error,searchOwners,getContext,initiate,approve,authorize,executeNow} = useOwnerTransfer();
  const [source,setSource]=useState<Opt|null>(null);
  const [target,setTarget]=useState<Opt|null>(null);
  const [context,setContext]=useState<any>(null);
  const [tid,setTid]=useState<string>("");
  const [sourceQuery,setSourceQuery]=useState("");
  const [targetQuery,setTargetQuery]=useState("");
  const [lookupMessage,setLookupMessage]=useState<string | null>(null);

  async function pick(term:string, set:(v:Opt|null)=>void, withCtx=false) {
    const cleanTerm = term.trim();
    if (!cleanTerm) {
      setLookupMessage("Enter an owner name or id to search.");
      set(null);
      if (withCtx) setContext(null);
      return;
    }
    const r = await searchOwners(term);
    const first = r?.results?.[0] || r?.[0] || null;
    if (first) {
      set(first);
      setLookupMessage(null);
      if (withCtx) setContext(await getContext(first.id));
      return;
    }
    set(null);
    if (withCtx) setContext(null);
    setLookupMessage(`No owner match found for "${cleanTerm}".`);
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Owner Transfer</h1>

      <Section title="Select Owners">
        <div className="grid md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm">Source Owner</label>
            <div className="flex gap-2">
              <input
                className="border rounded px-3 py-2 w-full"
                placeholder="Search source owner…"
                value={sourceQuery}
                onChange={e=>setSourceQuery(e.target.value)}
                onKeyDown={async e=>{ if(e.key==="Enter"){ await pick(sourceQuery, setSource, true); } }}
              />
              <button
                type="button"
                className="px-3 py-2 rounded border border-neutral-700 bg-neutral-900 text-neutral-100 disabled:opacity-50"
                disabled={loading || !sourceQuery.trim()}
                onClick={()=>pick(sourceQuery, setSource, true)}
              >
                Search
              </button>
            </div>
            <div className="text-sm opacity-80">Selected: {source?.name || source?.id || "—"}</div>
          </div>
          <div className="space-y-2">
            <label className="text-sm">Target Owner</label>
            <div className="flex gap-2">
              <input
                className="border rounded px-3 py-2 w-full"
                placeholder="Search target owner…"
                value={targetQuery}
                onChange={e=>setTargetQuery(e.target.value)}
                onKeyDown={async e=>{ if(e.key==="Enter"){ await pick(targetQuery, setTarget, false); } }}
              />
              <button
                type="button"
                className="px-3 py-2 rounded border border-neutral-700 bg-neutral-900 text-neutral-100 disabled:opacity-50"
                disabled={loading || !targetQuery.trim()}
                onClick={()=>pick(targetQuery, setTarget, false)}
              >
                Search
              </button>
            </div>
            <div className="text-sm opacity-80">Selected: {target?.name || target?.id || "—"}</div>
          </div>
        </div>
        <div className="text-xs opacity-70">Search explicitly with the buttons or press Enter after typing an owner name or id.</div>
        {lookupMessage && <div className="text-sm text-amber-300">{lookupMessage}</div>}
      </Section>

      {context && (
        <Section title="Transfer Context">
          <div className="text-sm font-semibold">{context.owner?.name || context.owner?.full_name || `Owner #${source?.id}`}</div>
          <div className="text-sm opacity-80">
            Properties: {context.properties?.length||0} • Units: {context.units?.length||0} • Leases: {context.leases?.length||0}
          </div>
        </Section>
      )}

      <Section title="Actions">
        <div className="flex flex-wrap gap-2">
          <button disabled={!source||!target||loading}
            className="px-3 py-2 rounded bg-[#d4af37] text-black font-semibold disabled:opacity-50"
            onClick={async ()=>{
              const r = await initiate({ source_owner_id: source!.id, target_owner_id: target!.id, notes: "UI" });
              setTid(String(r.transferId || r.id || ""));
            }}>Initiate</button>

          <button disabled={!tid||loading} className="px-3 py-2 rounded bg-gray-200" onClick={()=>approve({ transferId: tid })}>Approve</button>
          <button disabled={!tid||loading} className="px-3 py-2 rounded bg-gray-200" onClick={()=>authorize({ transferId: tid })}>Authorize</button>
          <button disabled={!tid||loading} className="px-3 py-2 rounded bg-green-600 text-white" onClick={()=>executeNow({ transferId: tid })}>Execute</button>
        </div>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </Section>
    </div>
  );
}
