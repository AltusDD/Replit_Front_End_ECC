import React from "react";
import "../properties.css";

type Owner = { id:string; displayName:string };

export default function AddPropertyWizard({ onClose, onCreated }:{ onClose:()=>void; onCreated:()=>void }) {
  const [step, setStep] = React.useState<1|2|3|4>(1);

  // step 1: property details
  const [name, setName] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [avgRent, setAvgRent] = React.useState<string>("");

  // step 2: owner link/create
  const [owners, setOwners] = React.useState<Owner[]>([]);
  const [ownerId, setOwnerId] = React.useState<string>("");
  const [newOwner, setNewOwner] = React.useState<string>("");

  // step 3: units
  const [unitCount, setUnitCount] = React.useState<number>(0);

  // step 4: optional lease+tenant (checkbox)
  const [createLease, setCreateLease] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/owners").then(r=>r.json()).then(setOwners).catch(()=>setOwners([]));
  }, []);

  async function submit() {
    // create owner if needed
    let finalOwnerId = ownerId;
    if (!finalOwnerId && newOwner.trim()) {
      const res = await fetch("/api/owners", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ displayName: newOwner }) });
      const o = await res.json();
      finalOwnerId = o.id;
    }

    // create property
    const res = await fetch("/api/portfolio/properties", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ 
        name, 
        city, 
        state, 
        avgRentCents: Math.round(Number(avgRent||0) * 100), 
        ownerId: finalOwnerId, 
        units: unitCount 
      })
    });
    const p = await res.json();

    // create units (placeholder)
    if (unitCount > 0) {
      await fetch(`/api/portfolio/properties/${p.id}/units`, {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ units: Array.from({length: unitCount}).map((_,i)=>({ number: i+1 })) })
      });
    }

    // optional lease + tenant
    if (createLease) {
      await fetch(`/api/portfolio/properties/${p.id}/lease-with-tenant`, { method:"POST" });
    }

    onCreated();
  }

  const canNext1 = name.trim().length > 1;
  const canNext2 = !!ownerId || newOwner.trim().length > 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" role="dialog" aria-modal="true" data-testid="wizard-add-property">
      <div className="w-[680px] max-w-[95vw] rounded-xl border border-white/10 bg-zinc-900 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-semibold">Add Property</div>
          <button onClick={onClose} className="px-2 py-1 rounded-md border border-white/10 hover:bg-white/10" aria-label="Close">✕</button>
        </div>

        {/* steps */}
        {step === 1 && (
          <div>
            <div className="text-sm text-zinc-400 mb-2">1/4 — Property details</div>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">Name
                <input className="properties-input" value={name} onChange={e=>setName(e.target.value)} data-testid="ap-name" />
              </label>
              <label className="text-sm">Avg Monthly Rent ($)
                <input className="properties-number" type="number" inputMode="decimal" value={avgRent} onChange={e=>setAvgRent(e.target.value)} data-testid="ap-avgRent" />
              </label>
              <label className="text-sm">City
                <input className="properties-input" value={city} onChange={e=>setCity(e.target.value)} data-testid="ap-city" />
              </label>
              <label className="text-sm">State
                <input className="properties-input" value={state} onChange={e=>setState(e.target.value)} data-testid="ap-state" />
              </label>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="px-3 py-1 rounded-md border border-white/10" onClick={onClose}>Cancel</button>
              <button className="px-3 py-1 rounded-md border border-emerald-600 text-emerald-400 disabled:opacity-40"
                onClick={()=>setStep(2)} disabled={!canNext1} data-testid="ap-next-1">Next</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-sm text-zinc-400 mb-2">2/4 — Link or create owner</div>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm col-span-2">Select existing owner
                <select className="properties-input" value={ownerId} onChange={e=>setOwnerId(e.target.value)} data-testid="ap-owner-select">
                  <option value="">—</option>
                  {owners.map(o=> <option key={o.id} value={o.id}>{o.displayName}</option>)}
                </select>
              </label>
              <div className="text-zinc-400 text-xs col-span-2">or create new</div>
              <label className="text-sm col-span-2">New owner name
                <input className="properties-input" value={newOwner} onChange={e=>setNewOwner(e.target.value)} data-testid="ap-owner-new" />
              </label>
            </div>
            <div className="mt-4 flex justify-between">
              <button className="px-3 py-1 rounded-md border border-white/10" onClick={()=>setStep(1)}>Back</button>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-md border border-white/10" onClick={onClose}>Cancel</button>
                <button className="px-3 py-1 rounded-md border border-emerald-600 text-emerald-400 disabled:opacity-40"
                  onClick={()=>setStep(3)} disabled={!canNext2} data-testid="ap-next-2">Next</button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-sm text-zinc-400 mb-2">3/4 — Units</div>
            <label className="text-sm">How many units?
              <input className="properties-number" type="number" inputMode="numeric" min={0} value={unitCount} onChange={e=>setUnitCount(Number(e.target.value||0))} data-testid="ap-units" />
            </label>
            <div className="mt-4 flex justify-between">
              <button className="px-3 py-1 rounded-md border border-white/10" onClick={()=>setStep(2)}>Back</button>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-md border border-white/10" onClick={onClose}>Cancel</button>
                <button className="px-3 py-1 rounded-md border border-emerald-600 text-emerald-400" onClick={()=>setStep(4)} data-testid="ap-next-3">Next</button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="text-sm text-zinc-400 mb-2">4/4 — Optional: create first lease + tenant</div>
            <label className="text-sm inline-flex items-center gap-2">
              <input type="checkbox" checked={createLease} onChange={e=>setCreateLease(e.target.checked)} data-testid="ap-create-lease" />
              Create initial lease + tenant placeholder
            </label>
            <div className="mt-4 flex justify-between">
              <button className="px-3 py-1 rounded-md border border-white/10" onClick={()=>setStep(3)}>Back</button>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-md border border-white/10" onClick={onClose}>Cancel</button>
                <button className="px-3 py-1 rounded-md border border-emerald-600 text-emerald-400"
                  onClick={submit} data-testid="ap-finish">Finish</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}