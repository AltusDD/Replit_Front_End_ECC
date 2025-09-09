// server/lib/sync/units.ts
import { dlPaginate } from '../doorloop';
import { sbAdmin } from '../supabaseAdmin';

type DlUnit = {
  id: number;
  propertyId: number;
  label?: string|null;
  beds?: number|null;
  baths?: number|null;
  sqft?: number|null;
  updatedAt?: string|null;
};

export async function syncUnits(updated_after?: string) {
  const rows = await dlPaginate<DlUnit>('/units', { updated_after });
  if (!rows.length) return { fetched: 0, upserted: 0 };

  const mapped = rows.map(u => ({
    doorloop_unit_id: u.id,
    doorloop_property_id: u.propertyId,
    unit_label: u.label ?? null,
    beds: u.beds ?? null,
    baths: u.baths ?? null,
    sqft: u.sqft ?? null,
  }));

  const { error } = await sbAdmin
    .from('units')
    .upsert(mapped, { onConflict: 'doorloop_unit_id' });

  if (error) throw error;
  return { fetched: rows.length, upserted: mapped.length };
}