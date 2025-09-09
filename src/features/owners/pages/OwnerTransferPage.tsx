import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";

type OwnerLite = { id:number; display_name:string; meta?:string|null };
type PropertyLite = { id:number; name:string; address1?:string|null; city?:string|null; state?:string|null; zip?:string|null };

async function jget<T=any>(u:string) { const r=await fetch(u); if(!r.ok) throw new Error(await r.text()); return r.json() as Promise<T>; }
async function jpost<T=any>(u:string, b:any) { const r=await fetch(u,{method:"POST",headers:{'Content-Type':'application/json'},body:JSON.stringify(b)}); if(!r.ok) throw new Error(await r.text()); return r.json() as Promise<T>; }

export default function OwnerTransferPage(){
  const [, nav] = useLocation();
  const [ownerId, setOwnerId] = useState<number|undefined>(undefined);
  const [ownerProps, setOwnerProps] = useState<PropertyLite[]>([]);
  const [search, setSearch] = useState("");
  const [candidates, setCandidates] = useState<OwnerLite[]>([]);
  const [newOwnerId, setNewOwnerId] = useState<number|undefined>(undefined);
  const [selected, setSelected] = useState<number[]>([]);
  const [effDate, setEffDate] = useState<string>(() => new Date().toISOString().slice(0,10));
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<1|2|3|4>(1);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>("");

  // ownerId from ?ownerId=
  useEffect(()=> {
    const url = new URL(window.location.href);
    const id = Number(url.searchParams.get("ownerId") || "0");
    if (id) setOwnerId(id);
  },[]);

  // load properties for current owner
  useEffect(()=> {
    if (!ownerId) return;
    jget<{properties:PropertyLite[]}>(`/api/owners/${ownerId}/properties`)
      .then(({properties})=>{
        setOwnerProps(properties||[]);
        setSelected(properties.map(p=>p.id)); // preselect all (can unselect)
      }).catch(()=>{});
  },[ownerId]);

  // debounce search for new owner
  useEffect(()=> {
    const t = setTimeout(()=>{
      if (!search.trim()) { setCandidates([]); return; }
      jget<{owners:OwnerLite[]}>(`/api/owners/search?q=${encodeURIComponent(search.trim())}`)
        .then(({owners})=>setCandidates(owners||[])).catch(()=>{});
    }, 150);
    return ()=>clearTimeout(t);
  },[search]);

  const canNext1 = !!newOwnerId && selected.length>0 && !!ownerId;
  const humanSummary = useMemo(()=> {
    const count = selected.length;
    const timing = (()=> {
      const today = new Date(); today.setHours(0,0,0,0);
      const eff = new Date(effDate); eff.setHours(0,0,0,0);
      if (eff.getTime() < today.getTime()) return "Retro transfer (past date)";
      if (eff.getTime() > today.getTime()) return "Scheduled transfer (future date)";
      return "Effective today";
    })();
    return `${count} property${count===1?"":"ies"} • ${timing}`;
  },[selected, effDate]);

  function toggle(id:number) {
    setSelected(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  }

  async function onCreate(){
    if (!ownerId || !newOwnerId || !selected.length) return;
    setBusy(true); setMsg("");
    try{
      const out = await jpost("/api/owner-transfer/initiate", {
        old_owner_id: ownerId,
        new_owner_id: newOwnerId,
        property_ids: selected,
        effective_date: effDate,
        notes
      });
      setStep(4);
      setMsg(`Transfer #${out.transfer_id} created • Status: ${out.status}`);
    }catch(e:any){
      setMsg(`Error: ${e?.message || "failed"}`);
    }finally{
      setBusy(false);
    }
  }

  const newOwner = candidates.find(c=>c.id===newOwnerId);

  return (
    <div className="bg-background text-foreground min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => nav("/")} className="text-muted-foreground hover:text-foreground">
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold">Owner Transfer</h1>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1,2,3,4].map(n => (
            <div key={n} className={`flex-1 h-2 rounded ${n <= step ? 'bg-primary' : 'bg-muted'}`} />
          ))}
        </div>

        {/* Step 1: Select New Owner */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">1. Select New Owner</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">Search for new owner</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type company name or person..."
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>

            {candidates.length > 0 && (
              <div className="border border-border rounded-md max-h-60 overflow-y-auto">
                {candidates.map(c => (
                  <div
                    key={c.id}
                    onClick={() => setNewOwnerId(c.id)}
                    className={`p-3 cursor-pointer hover:bg-muted ${newOwnerId === c.id ? 'bg-primary/10 border-l-4 border-primary' : ''}`}
                  >
                    <div className="font-medium">{c.display_name}</div>
                    {c.meta && <div className="text-sm text-muted-foreground">{c.meta}</div>}
                  </div>
                ))}
              </div>
            )}

            {newOwner && (
              <div className="bg-muted p-4 rounded-md">
                <div className="font-medium">Selected: {newOwner.display_name}</div>
                {newOwner.meta && <div className="text-sm text-muted-foreground">{newOwner.meta}</div>}
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              disabled={!newOwnerId}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Select Properties
            </button>
          </div>
        )}

        {/* Step 2: Select Properties */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">2. Select Properties to Transfer</h2>
            
            <div className="text-sm text-muted-foreground">
              All properties are pre-selected. Uncheck any you don't want to transfer.
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {ownerProps.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-3 border border-border rounded-md">
                  <input
                    type="checkbox"
                    checked={selected.includes(p.id)}
                    onChange={() => toggle(p.id)}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {[p.address1, p.city, p.state, p.zip].filter(Boolean).join(", ")}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-border rounded-md hover:bg-muted"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={selected.length === 0}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Review & Submit
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">3. Review & Submit</h2>
            
            <div className="bg-muted p-4 rounded-md space-y-3">
              <div><strong>New Owner:</strong> {newOwner?.display_name}</div>
              <div><strong>Properties:</strong> {humanSummary}</div>
              <div><strong>Effective Date:</strong> {effDate}</div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Effective Date</label>
              <input
                type="date"
                value={effDate}
                onChange={(e) => setEffDate(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this transfer..."
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>

            {msg && (
              <div className={`p-3 rounded-md ${msg.includes('Error') ? 'bg-destructive/10 text-destructive' : 'bg-green-100 text-green-800'}`}>
                {msg}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 border border-border rounded-md hover:bg-muted"
              >
                Back
              </button>
              <button
                onClick={onCreate}
                disabled={busy || !canNext1}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {busy ? "Creating..." : "Create Transfer"}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Complete */}
        {step === 4 && (
          <div className="space-y-6 text-center">
            <h2 className="text-xl font-semibold">Transfer Created!</h2>
            
            <div className="bg-green-50 border border-green-200 p-4 rounded-md">
              <div className="text-green-800">{msg}</div>
            </div>

            <div className="text-sm text-muted-foreground">
              The transfer has been submitted and is now pending accounting approval.
              You will be notified when it's ready for execution.
            </div>

            <div className="flex gap-2 justify-center">
              <button
                onClick={() => nav("/")}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              >
                Return to Dashboard
              </button>
              <button
                onClick={() => {
                  setStep(1);
                  setNewOwnerId(undefined);
                  setSelected([]);
                  setNotes("");
                  setMsg("");
                }}
                className="px-4 py-2 border border-border rounded-md hover:bg-muted"
              >
                Create Another Transfer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}