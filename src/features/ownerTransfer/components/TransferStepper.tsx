import React, { useEffect, useMemo, useState } from 'react';

type OwnerLite = { id:number; label:string; company_name?:string|null; first_name?:string|null; last_name?:string|null };
type PropertyLite = { id:number; name:string; city:string|null; state:string|null; units:number|null };

function useDebounced<T>(val:T, ms=250){ 
  const [v,setV]=useState(val); 
  useEffect(()=>{ 
    const t=setTimeout(()=>setV(val),ms); 
    return ()=>clearTimeout(t);
  },[val,ms]); 
  return v; 
}

export function TransferOwnershipModal({ ownerId, onClose, onNext }:{
  ownerId:number;
  onNext:(p:{ newOwnerId:number; effectiveDate:string; notes?:string; propertyIds:number[] })=>void;
  onClose:()=>void;
}) {
  const [q, setQ] = useState(''); const dq = useDebounced(q, 300);
  const [owners, setOwners] = useState<OwnerLite[]>([]); const [loadingOwners, setLoadingOwners] = useState(false);
  const [newOwnerId, setNewOwnerId] = useState<number|undefined>(undefined);

  const [propsLoading, setPropsLoading] = useState(false);
  const [ownerProps, setOwnerProps] = useState<PropertyLite[]>([]);
  const [selectedProps, setSelectedProps] = useState<Record<number, boolean>>({});
  const [selectAll, setSelectAll] = useState(true);

  const [effectiveDate, setEffectiveDate] = useState<string>(() => new Date().toISOString().slice(0,10));
  const [notes, setNotes] = useState<string>('');

  useEffect(() => { let keep = true; (async () => {
    setLoadingOwners(true);
    try {
      const r = await fetch(`/api/owners/search?q=${encodeURIComponent(dq)}`);
      const j = await r.json(); if (keep) setOwners(j.owners || []);
    } finally { if (keep) setLoadingOwners(false); }
  })(); return () => { keep = false }; }, [dq]);

  useEffect(() => { let keep = true; (async () => {
    setPropsLoading(true);
    try {
      const r = await fetch(`/api/owners/${ownerId}/properties?limit=500`);
      const j = await r.json(); if (!keep) return;
      const props:PropertyLite[] = j.properties || [];
      setOwnerProps(props);
      const sel:Record<number,boolean> = {}; props.forEach(p => { sel[p.id] = true; });
      setSelectedProps(sel); setSelectAll(true);
    } finally { if (keep) setPropsLoading(false); }
  })(); return () => { keep = false }; }, [ownerId]);

  const selectedIds = useMemo(() => Object.entries(selectedProps).filter(([,v])=>v).map(([k])=>Number(k)), [selectedProps]);
  const toggleAll = (flag:boolean) => { const sel:Record<number,boolean>={}; ownerProps.forEach(p=>{sel[p.id]=flag}); setSelectedProps(sel); setSelectAll(flag); };
  const canContinue = Boolean(newOwnerId) && effectiveDate && selectedIds.length > 0;

  return (
    <div className="ecc-modal">
      <div className="p-4">
        <div className="font-semibold mb-2">Select New Owner</div>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search owner (company or person)..." className="ecc-input w-full mb-2" />
        <div className="ecc-select w-full mb-4">
          <select value={newOwnerId ?? ''} onChange={e=>setNewOwnerId(e.target.value ? Number(e.target.value) : undefined)} className="w-full bg-transparent">
            <option value="">{loadingOwners ? 'Loading owners...' : 'Select an owner...'}</option>
            {owners.map(o => (<option key={o.id} value={o.id}>{o.label}</option>))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div><div className="font-semibold mb-1">Effective Date</div>
            <input type="date" value={effectiveDate} onChange={e=>setEffectiveDate(e.target.value)} className="ecc-input w-full" />
          </div>
          <div><div className="font-semibold mb-1">Notes</div>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={2} className="ecc-input w-full" placeholder="Optional notes..." />
          </div>
        </div>

        <div className="font-semibold mb-2">Selected Properties ({selectedIds.length})</div>
        <div className="flex items-center gap-3 mb-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={selectAll} onChange={e=>toggleAll(e.target.checked)} />
            <span>Select all</span>
          </label>
        </div>

        <div className="max-h-[280px] overflow-auto rounded border border-[var(--line)] p-2">
          {propsLoading && <div className="text-[var(--text-dim)] p-2">Loading properties…</div>}
          {!propsLoading && ownerProps.length===0 && <div className="text-[var(--text-dim)] p-2">No properties for this owner.</div>}
          {ownerProps.map(p => (
            <label key={p.id} className="flex items-center gap-2 py-1 px-2 hover:bg-[var(--panel-elev)] rounded cursor-pointer">
              <input type="checkbox" checked={!!selectedProps[p.id]} onChange={e=>setSelectedProps(s=>({...s,[p.id]:e.target.checked}))} />
              <span className="flex-1">{p.name}</span>
              <span className="text-xs text-[var(--text-dim)]">{[p.city,p.state].filter(Boolean).join(', ')}</span>
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button className="ecc-btn" onClick={onClose}>Close</button>
          <button className={`ecc-btn ecc-btn--primary ${!canContinue ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!canContinue}
            onClick={()=>onNext({ newOwnerId:newOwnerId!, effectiveDate, notes, propertyIds:selectedIds })}>Next</button>
        </div>
      </div>
    </div>
  );
}

interface TransferStepperProps {
  isOpen: boolean;
  onClose: () => void;
  propertyIds?: number[];
}

export function TransferStepper({ isOpen, onClose, propertyIds = [] }: TransferStepperProps) {
  const [showModal, setShowModal] = useState(false);
  // Get owner ID from current URL path (/card/owner/:id)
  const ownerId = Number(window.location.pathname.split('/').pop()) || 1;

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [isOpen]);

  const handleNext = async (params: { newOwnerId:number; effectiveDate:string; notes?:string; propertyIds:number[] }) => {
    try {
      const response = await fetch('/api/owner-transfer/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_owner_id: ownerId,
          new_owner_id: params.newOwnerId,
          effective_date: params.effectiveDate,
          notes: params.notes,
          property_ids: params.propertyIds
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Transfer initiated successfully! Transfer ID: ${result.transferId}`);
        onClose();
      } else {
        const error = await response.json();
        alert(`Transfer failed: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      alert(`Transfer failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (!isOpen || !showModal) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'var(--panel-bg)',
        borderRadius: 'var(--radius-lg)',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'hidden',
      }}>
        <TransferOwnershipModal
          ownerId={ownerId}
          onClose={onClose}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}