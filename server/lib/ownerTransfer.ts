import { sbAdmin } from "./supabaseAdmin";

type TransferStatus = 'DRAFT'|'PENDING_ACCOUNTING'|'APPROVED_ACCOUNTING'|'READY_EXECUTION'|'COMPLETE'|'FAILED';

export type InitiatePayload = {
  old_owner_id: number;
  new_owner_id: number;
  property_ids: number[];
  effective_date: string; // "YYYY-MM-DD"
  notes?: string;
  initiated_by?: string; // UUID (optional)
};

const nowIso = () => new Date().toISOString();

async function insertAudit(event_type:string, payload:any, ref_table?:string, ref_id?:number, label?:string) {
  try {
    await sbAdmin.from("audit_events").insert({
      event_type, ref_table, ref_id, payload, label, created_at: new Date().toISOString()
    });
  } catch {}
}

async function safeSingle<T=any>(q:any):Promise<T|null> {
  const { data, error } = await q.single();
  if (error?.code === "PGRST116") return null;
  if (error) throw new Error(error.message);
  return data as T;
}

export async function validatePropsBelongToOwner(property_ids:number[], owner_id:number) {
  if (!property_ids.length) throw new Error("No properties selected.");
  const { data, error } = await sbAdmin
    .from("properties")
    .select("id")
    .eq("owner_id", owner_id)
    .in("id", property_ids);
  if (error) throw new Error(error.message);
  const okIds = new Set((data||[]).map((r:any)=>r.id));
  const bad = property_ids.filter(id=>!okIds.has(id));
  if (bad.length) throw new Error(`Some properties are not owned by owner ${owner_id}: [${bad.join(", ")}]`);
}

export async function snapshotForTransfer(transfer_id:number, property_ids:number[]) {
  // Snapshot properties
  const tables = [
    { name: "properties", key: "id", filter: "id" },
    { name: "units", key: "id", filter: "property_id" },
    { name: "leases", key: "id", filter: "property_id" },
    { name: "tenants", key: "id", filter: "property_id" },
  ];
  for (const t of tables) {
    try {
      const { data } = await sbAdmin.from(t.name).select("*").in(t.filter, property_ids);
      for (const row of (data||[])) {
        await sbAdmin.from("owner_transfer_snapshots").insert({
          transfer_id,
          entity_type: t.name === "properties" ? "property"
                     : t.name === "units" ? "unit"
                     : t.name === "leases" ? "lease"
                     : "tenant",
          entity_id: row[t.key],
          raw_jsonb: row,
          captured_at: nowIso(),
        });
      }
    } catch {}
  }
}

export async function initiateTransfer(p:InitiatePayload) {
  if (p.old_owner_id === p.new_owner_id) throw new Error("New owner must be different.");
  await validatePropsBelongToOwner(p.property_ids, p.old_owner_id);

  const today = new Date(); today.setHours(0,0,0,0);
  const eff = new Date(p.effective_date); eff.setHours(0,0,0,0);

  // business rule: always go through Accounting first
  const status: TransferStatus = 'PENDING_ACCOUNTING';

  const { data, error } = await sbAdmin.from("owner_transfers").insert({
    property_ids: p.property_ids,
    old_owner_id: p.old_owner_id,
    new_owner_id: p.new_owner_id,
    effective_date: p.effective_date,
    status,
    notes: p.notes || null,
    initiated_by: p.initiated_by || null,
    created_at: nowIso(),
  }).select("id").single();

  if (error) throw new Error(error.message);
  const transfer_id = data.id as number;

  await snapshotForTransfer(transfer_id, p.property_ids);
  await insertAudit("OWNER_TRANSFER_INITIATED", { ...p, transfer_id, status, timing: eff.getTime() < today.getTime() ? "retro" : "future" }, "owner_transfers", transfer_id, "OWNER_TRANSFER");

  return { transfer_id, status };
}

export async function approveAccounting(transfer_id:number) {
  await sbAdmin.from("owner_transfers").update({ status: 'APPROVED_ACCOUNTING' }).eq("id", transfer_id);
  await insertAudit("OWNER_TRANSFER_APPROVED_ACCOUNTING", { transfer_id }, "owner_transfers", transfer_id, "OWNER_TRANSFER");
  return { ok: true };
}

export async function authorizeTransfer(transfer_id:number) {
  await sbAdmin.from("owner_transfers").update({ status: 'READY_EXECUTION' }).eq("id", transfer_id);
  await insertAudit("OWNER_TRANSFER_READY_EXECUTION", { transfer_id }, "owner_transfers", transfer_id, "OWNER_TRANSFER");
  return { ok: true };
}

export async function executeTransfer(transfer_id:number) {
  const t = await safeSingle<any>(sbAdmin.from("owner_transfers").select("*").eq("id", transfer_id));
  if (!t) throw new Error("Transfer not found.");
  if (t.status !== 'READY_EXECUTION') throw new Error(`Transfer not ready (status=${t.status}).`);

  // Change ownership on selected properties
  const { error } = await sbAdmin.from("properties")
    .update({ owner_id: t.new_owner_id })
    .in("id", t.property_ids || []);
  if (error) throw new Error(error.message);

  await sbAdmin.from("owner_transfers").update({ status: 'COMPLETE', executed_at: nowIso() }).eq("id", transfer_id);
  await insertAudit("OWNER_TRANSFER_EXECUTED", { transfer_id, property_ids: t.property_ids }, "owner_transfers", transfer_id, "OWNER_TRANSFER");
  return { ok: true };
}

/** tiny scheduler tick: execute any READY_EXECUTION with effective_date <= today */
export async function runDueTransfersTick() {
  const today = new Date(); today.setHours(23,59,59,999);
  const { data, error } = await sbAdmin
    .from("owner_transfers")
    .select("id")
    .lte("effective_date", today.toISOString().slice(0,10))
    .eq("status", "READY_EXECUTION")
    .limit(20);
  if (error) return;

  for (const row of (data || [])) {
    try { await executeTransfer(row.id); } catch {}
  }
}