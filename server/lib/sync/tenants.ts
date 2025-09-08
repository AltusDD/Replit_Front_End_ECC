// server/lib/sync/tenants.ts
import { dlPaginate } from '../doorloop';
import { sbAdmin } from '../supabaseAdmin';

type DlTenant = {
  id: number;
  firstName?: string|null;
  lastName?: string|null;
  email?: string|null;
  phone?: string|null;
  updatedAt?: string|null;
};

export async function syncTenants(updated_after?: string) {
  const rows = await dlPaginate<DlTenant>('/tenants', { updated_after });
  if (!rows.length) return { fetched: 0, upserted: 0 };

  const mapped = rows.map(t => ({
    doorloop_tenant_id: t.id,
    first_name: t.firstName ?? null,
    last_name:  t.lastName ?? null,
    email:      t.email ?? null,
    phone:      t.phone ?? null,
  }));

  const { error, count } = await sbAdmin
    .from('tenants')
    .upsert(mapped, { onConflict: 'doorloop_tenant_id' })
    .select('*', { count: 'exact' });

  if (error) throw error;
  return { fetched: rows.length, upserted: count ?? mapped.length };
}