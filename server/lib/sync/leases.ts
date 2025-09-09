// server/lib/sync/leases.ts
import { dlPaginate } from '../doorloop';
import { sbAdmin } from '../supabaseAdmin';

type DlLease = {
  id: number;
  unitId: number;
  tenantId: number;
  startDate?: string|null;
  endDate?: string|null;
  status?: string|null;
  updatedAt?: string|null;
};

export async function syncLeases(updated_after?: string) {
  const rows = await dlPaginate<DlLease>('/leases', { updated_after });
  if (!rows.length) return { fetched: 0, upserted: 0 };

  const mapped = rows.map(l => ({
    doorloop_lease_id: l.id,
    doorloop_unit_id: l.unitId,
    doorloop_tenant_id: l.tenantId,
    start_date: l.startDate ?? null,
    end_date:   l.endDate ?? null,
    status:     l.status ?? null,
  }));

  const { error } = await sbAdmin
    .from('leases')
    .upsert(mapped, { onConflict: 'doorloop_lease_id' });

  if (error) throw error;
  return { fetched: rows.length, upserted: mapped.length };
}