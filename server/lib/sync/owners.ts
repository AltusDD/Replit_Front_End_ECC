// server/lib/sync/owners.ts
import { dlPaginate } from '../doorloop';
import { sbAdmin } from '../supabaseAdmin';

type DlOwner = {
  id: number;
  companyName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  updatedAt?: string | null;
};

function displayName(o: DlOwner) {
  const c = (o.companyName || '').trim();
  if (c) return c;
  const p = [o.firstName, o.lastName].filter(Boolean).join(' ').trim();
  return p || null;
}

export async function syncOwners(updated_after?: string) {
  const rows = await dlPaginate<DlOwner>('/owners', { updated_after });
  if (!rows.length) return { fetched: 0, upserted: 0 };

  const mapped = rows.map(o => ({
    doorloop_owner_id: o.id,
    company_name: o.companyName ?? null,
    first_name: o.firstName ?? null,
    last_name: o.lastName ?? null,
    display_name: displayName(o),
  }));

  const { error } = await sbAdmin
    .from('owners')
    .upsert(mapped, { onConflict: 'doorloop_owner_id' });

  if (error) throw error;
  return { fetched: rows.length, upserted: mapped.length };
}