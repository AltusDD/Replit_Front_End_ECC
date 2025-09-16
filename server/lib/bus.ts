import crypto from "crypto";
import fetch from "node-fetch";

const WEBHOOK = process.env.INTERNAL_WEBHOOK_URL || "";
const SECRET  = process.env.INTERNAL_WEBHOOK_SECRET || "";

function sign(body: string) {
  return crypto.createHmac("sha256", SECRET).update(body).digest("hex");
}

export async function emitBus(event: string, payload: any) {
  if (!WEBHOOK || !SECRET) return; // soft no-op if not configured
  const body = JSON.stringify({ event, payload, ts: new Date().toISOString() });
  const sig = sign(body);
  try {
    await fetch(WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-empire-signature": sig, "x-empire-event": event },
      body
    });
  } catch {}
}