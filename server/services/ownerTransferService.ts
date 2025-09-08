import { z } from "zod";
import ExcelJS from "exceljs";
import { supabaseAdmin } from "../lib/supabaseAdmin";
import { auditEvent } from "../lib/audit";
import { uploadBufferToDropbox } from "../lib/dropbox";

const InitiateSchema = z.object({
  propertyIds: z.array(z.number().int()).min(1),
  newOwnerId: z.number().int(),
  effectiveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().optional(),
  initiatedBy: z.string().uuid().optional(),
});

export type InitiateInput = z.infer<typeof InitiateSchema>;

// Helpers — skip missing tables
async function safeSelect<T = any>(table: string, col: string, values: readonly any[]) {
  try {
    const q = supabaseAdmin.from(table).select("*").in(col, values);
    // @ts-ignore
    const { data, error } = await q;
    if (error) {
      if ((error as any)?.code === "42P01") return []; // table missing
      throw error;
    }
    return data ?? [];
  } catch (e: any) {
    if (String(e?.message || "").includes("relation") && String(e?.message || "").includes("does not exist")) return [];
    throw e;
  }
}

export async function initiateTransfer(input: InitiateInput) {
  const parsed = InitiateSchema.parse(input);

  // Create transfer record (sets status = PENDING_ACCOUNTING)
  const { data, error } = await supabaseAdmin
    .from("owner_transfers")
    .insert({
      property_ids: parsed.propertyIds,
      old_owner_id: null,
      new_owner_id: parsed.newOwnerId,
      effective_date: parsed.effectiveDate,
      status: "PENDING_ACCOUNTING",
      notes: parsed.notes ?? null,
      initiated_by: parsed.initiatedBy ?? null,
    })
    .select("id")
    .single();
  if (error) throw error;
  const transferId = data.id as number;

  await auditEvent({ 
    event_type: "OWNER_TRANSFER_INIT", 
    ref_table: "owner_transfers", 
    ref_id: transferId, 
    payload: { input: parsed } 
  });

  // infer old_owner_id from first property
  const first = await supabaseAdmin.from("properties").select("owner_id").eq("id", parsed.propertyIds[0]).single();
  if (!first.error && first.data) {
    await supabaseAdmin.from("owner_transfers").update({ old_owner_id: first.data.owner_id }).eq("id", transferId);
  }

  // Snapshots (skip slices that 404)
  const properties = await safeSelect("properties", "id", parsed.propertyIds);
  const units = await safeSelect("units", "property_id", parsed.propertyIds);
  const leases = await safeSelect("leases", "property_id", parsed.propertyIds);

  const tenantIds = Array.from(new Set(leases.map((l: any) => l.primary_tenant_id).filter(Boolean)));
  const tenants = tenantIds.length ? await safeSelect("tenants", "id", tenantIds) : [];

  const leaseIds = Array.from(new Set(leases.map((l: any) => l.id)));
  const lease_payments = leaseIds.length ? await safeSelect("lease_payments", "lease_id", leaseIds) : [];
  const lease_charges = leaseIds.length ? await safeSelect("lease_charges", "lease_id", leaseIds) : [];
  const lease_credits = leaseIds.length ? await safeSelect("lease_credits", "lease_id", leaseIds) : [];

  const work_orders = await safeSelect("work_orders", "property_id", parsed.propertyIds);
  const communications = await safeSelect("communications", "property_id", parsed.propertyIds);
  const files = await safeSelect("files", "property_id", parsed.propertyIds);
  const notes = await safeSelect("notes", "property_id", parsed.propertyIds);

  const bundle = { 
    properties, units, leases, tenants, lease_payments, lease_charges, lease_credits, 
    work_orders, communications, files, notes 
  };

  const rows: any[] = [];
  const push = (et: string, arr: any[], idKey = "id") => 
    arr.forEach(r => rows.push({ 
      transfer_id: transferId, 
      entity_type: et.replace(/s$/, ''), // singularize
      entity_id: r?.[idKey] ?? 0, 
      raw_jsonb: JSON.stringify(r) 
    }));
  
  Object.entries(bundle).forEach(([k, v]) => push(k, v as any[]));

  // Chunk insert to avoid timeouts
  for (let i = 0; i < rows.length; i += 500) {
    const slice = rows.slice(i, i + 500);
    const { error: e } = await supabaseAdmin.from("owner_transfer_snapshots").insert(slice);
    if (e) throw e;
  }

  await auditEvent({
    event_type: "OWNER_TRANSFER_SNAPSHOT_DONE",
    ref_table: "owner_transfers",
    ref_id: transferId,
    payload: Object.fromEntries(Object.entries(bundle).map(([k, v]) => [k, (v as any[])?.length || 0])),
  });

  // Build report now to unblock accounting
  const rep = await generateAccountingReport(transferId);
  return { transferId, reportUrl: rep.reportUrl ?? null };
}

export async function generateAccountingReport(transferId: number) {
  const t = await supabaseAdmin.from("owner_transfers").select("*").eq("id", transferId).single();
  if (t.error) throw t.error;
  const transfer = t.data;

  const wb = new ExcelJS.Workbook();
  wb.creator = "ECC";
  wb.created = new Date();
  
  const summary = wb.addWorksheet("Summary");
  summary.columns = [
    { header: "Transfer ID", key: "id" },
    { header: "Old Owner ID", key: "old_owner_id" },
    { header: "New Owner ID", key: "new_owner_id" },
    { header: "Effective Date", key: "effective_date" },
    { header: "Status", key: "status" },
  ];
  summary.addRow(transfer);

  // TODO: add Income/Expenses/Pending sheets by querying your accounting tables

  const buffer = Buffer.from(await wb.xlsx.writeBuffer());
  const filename = `owner_transfer_${transferId}.xlsx`;

  let reportUrl: string | undefined;
  if ((process.env.OWNER_TRANSFER_REPORT_DEST || "dropbox") === "dropbox") {
    try {
      const up = await uploadBufferToDropbox({ 
        path: `/reports/owner_transfers/${filename}`, 
        buffer 
      });
      reportUrl = up.url;
    } catch (err) {
      console.error("Dropbox upload failed, continuing without cloud storage:", err);
      // Continue without cloud storage if Dropbox fails
    }
  }

  await auditEvent({ 
    event_type: "OWNER_TRANSFER_REPORT_BUILT", 
    ref_table: "owner_transfers", 
    ref_id: transferId, 
    payload: { reportUrl: reportUrl || null, filename } 
  });
  
  return { buffer, filename, reportUrl };
}

export async function markApprovedByAccounting(transferId: number, actorId?: string) {
  const { error } = await supabaseAdmin
    .from("owner_transfers")
    .update({ status: "APPROVED_ACCOUNTING" })
    .eq("id", transferId);
  if (error) throw error;
  
  await auditEvent({ 
    event_type: "OWNER_TRANSFER_APPROVE_ACCOUNTING", 
    ref_table: "owner_transfers", 
    ref_id: transferId, 
    actor_id: actorId ?? null 
  });
}

export async function authorizeExecution(transferId: number, actorId?: string) {
  const { error } = await supabaseAdmin
    .from("owner_transfers")
    .update({ status: "READY_EXECUTION" })
    .eq("id", transferId);
  if (error) throw error;
  
  await auditEvent({ 
    event_type: "OWNER_TRANSFER_AUTHORIZED", 
    ref_table: "owner_transfers", 
    ref_id: transferId, 
    actor_id: actorId ?? null 
  });
}

export async function executeTransfer(transferId: number, opts?: { dryRun?: boolean }) {
  const dryRun = opts?.dryRun !== false; // default true

  const t = await supabaseAdmin.from("owner_transfers").select("*").eq("id", transferId).single();
  if (t.error) throw t.error;
  const transfer = t.data;

  const props = await supabaseAdmin.from("properties").select("id, owner_id").in("id", transfer.property_ids);
  if (props.error) throw props.error;
  const properties = props.data ?? [];

  const summary: any = { propertiesAffected: properties.length, dryRun, doorloopCalls: 0 };

  // ECC DB updates
  if (!dryRun) {
    const { error } = await supabaseAdmin
      .from("properties")
      .update({ owner_id: transfer.new_owner_id })
      .in("id", transfer.property_ids);
    if (error) throw error;
  }

  // DoorLoop write-back (if configured)
  if (!dryRun && process.env.DOORLOOP_API_KEY && process.env.DOORLOOP_BASE_URL) {
    const headers = {
      "Authorization": `Bearer ${process.env.DOORLOOP_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `transfer-${transferId}-${transfer.effective_date}`,
    };
    
    for (const p of properties) {
      try {
        const url = `${process.env.DOORLOOP_BASE_URL}/properties/${p.id}`;
        const res = await fetch(url, { 
          method: "PUT", 
          headers, 
          body: JSON.stringify({ ownerId: transfer.new_owner_id }) 
        });
        
        await auditEvent({ 
          event_type: "OWNER_TRANSFER_WRITEBACK", 
          ref_table: "properties", 
          ref_id: p.id, 
          payload: { status: res.status } 
        });
        
        summary.doorloopCalls++;
        
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`DoorLoop property update failed: ${res.status} ${text}`);
        }
      } catch (err) {
        console.error(`DoorLoop writeback failed for property ${p.id}:`, err);
        // Continue with other properties even if one fails
      }
    }
  }

  // Mark transfer complete
  if (!dryRun) {
    const { error } = await supabaseAdmin
      .from("owner_transfers")
      .update({ 
        status: "COMPLETE", 
        executed_at: new Date().toISOString() 
      })
      .eq("id", transferId);
    if (error) throw error;
    
    await auditEvent({ 
      event_type: "OWNER_TRANSFER_COMPLETE", 
      ref_table: "owner_transfers", 
      ref_id: transferId, 
      payload: summary 
    });
  }

  return { applied: !dryRun, summary };
}

export async function getTransferDetails(transferId: number) {
  // Get transfer record
  const t = await supabaseAdmin.from("owner_transfers").select("*").eq("id", transferId).single();
  if (t.error) throw t.error;

  // Get audit events for this transfer
  const auditQuery = await supabaseAdmin
    .from("audit_events")
    .select("*")
    .eq("ref_table", "owner_transfers")
    .eq("ref_id", transferId)
    .order("created_at", { ascending: false });

  return {
    transfer: t.data,
    auditEvents: auditQuery.data ?? [],
  };
}