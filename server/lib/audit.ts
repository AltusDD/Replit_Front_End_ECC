import { supabaseAdmin } from "./supabaseAdmin";

type Json = Record<string, any>;

export async function auditEvent(opts: {
  event_type: string;
  ref_table?: string | null;
  ref_id?: number | null;
  payload?: Json | null;
  actor_id?: string | null;
  tag?: string | null;
}) {
  const { event_type, ref_table = null, ref_id = null, payload = null, actor_id = null, tag = null } = opts;
  
  if (!event_type) throw new Error("auditEvent: event_type required");
  
  const { error } = await supabaseAdmin.from("audit_events").insert({
    event_type,
    ref_table,
    ref_id,
    payload,
    actor_id,
    tag,
  });
  
  if (error) {
    console.error("auditEvent insert failed:", error);
  }
}