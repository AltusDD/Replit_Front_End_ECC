// server/lib/sync/properties.ts
import { dlPaginate } from '../doorloop';
import { sbAdmin } from '../supabaseAdmin';

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

  const { error, count } = await sbAdmin
    .from('properties')
    .upsert(mapped, { onConflict: 'doorloop_property_id' })
    .select('*', { count: 'exact' });

  if (error) throw error;
  return { fetched: rows.length, upserted: count ?? mapped.length };
}