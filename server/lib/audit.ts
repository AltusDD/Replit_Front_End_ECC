import { sbAdmin } from "./supabaseAdmin";
type Audit = {
  event_type: string;
  label?: string;
  ref_table?: string;
  ref_id?: number | string | null;
  payload?: any;
};
export async function recordAudit(a: Audit) {
  await sbAdmin.from("audit_events").insert({
    event_type: a.event_type,
    label: a.label || null,
    ref_table: a.ref_table || null,
    ref_id: a.ref_id ?? null,
    payload: a.payload ?? null
  });
}
