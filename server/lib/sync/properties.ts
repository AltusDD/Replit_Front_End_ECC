// server/lib/sync/properties.ts
import { dlPaginate } from '../doorloop';
import { sbAdmin } from '../supabaseAdmin';
import { geocodeAddress } from '../geocode/geocode';
import { recordAudit } from '../audit';

type DlProperty = {
  id: number;
  name?: string|null;
  ownerId?: number|null;
  address1?: string|null;
  address2?: string|null;
  city?: string|null;
  state?: string|null;
  zip?: string|null;
  updatedAt?: string|null;
};

export async function syncProperties(updated_after?: string) {
  const rows = await dlPaginate<DlProperty>('/properties', { updated_after });
  if (!rows.length) return { fetched: 0, upserted: 0 };

  const mapped = rows.map(p => ({
    doorloop_property_id: p.id,
    owner_doorloop_id: p.ownerId ?? null,
    name: p.name ?? null,
    addr_line1: p.address1 ?? null,
    addr_line2: p.address2 ?? null,
    city: p.city ?? null,
    state: p.state ?? null,
    zip: p.zip ?? null,
  }));

  const { data: upserted, error } = await sbAdmin
    .from('properties')
    .upsert(mapped, { onConflict: 'doorloop_property_id' })
    .select('id,addr_line1,addr_line2,city,state,zip,lat,lng');

  if (error) throw error;

  // After upsert, if missing coords but has address, attempt geocode (non-blocking best effort)
  if (upserted) {
    for (const p of upserted) {
      try {
        const needsCoords = !p.lat && !p.lng;
        const hasAddr = !!(p.addr_line1 || p.city || p.zip);
        if (needsCoords && hasAddr) {
          const geo = await geocodeAddress({
            line1: p.addr_line1, line2: p.addr_line2,
            city: p.city, state: p.state, postal_code: p.zip
          });
          if (geo) {
            await sbAdmin.from("properties").update({ lat: geo.lat, lng: geo.lng }).eq("id", p.id);
            await recordAudit({ 
              event_type: "GEOCODE_AUTO_APPLY", 
              label: "GEOCODE_AUTO", 
              ref_table: "properties", 
              ref_id: p.id, 
              payload: geo 
            });
          }
        }
      } catch {}
    }
  }
  
  return { fetched: rows.length, upserted: mapped.length };
}