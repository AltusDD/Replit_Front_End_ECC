// server/lib/sync/index.ts
import { getSinceCursor, setSinceCursor } from '../integrationState';
import { syncOwners }     from './owners';
import { syncProperties } from './properties';
import { syncUnits }      from './units';
import { syncLeases }     from './leases';
import { syncTenants }    from './tenants';

type Entity = 'owners' | 'properties' | 'units' | 'leases' | 'tenants';
type Mode = 'incremental' | 'full';

export async function runSync(entities: Entity[], mode: Mode, sinceDays = 30) {
  const now = new Date();
  const fallbackSince = new Date(now.getTime() - sinceDays*24*60*60*1000).toISOString();

  const results: Record<string, any> = {};
  for (const e of entities) {
    const cursor = (mode === 'incremental') ? (await getSinceCursor(e)) || fallbackSince : undefined;
    switch (e) {
      case 'owners':      results.owners      = await syncOwners(cursor); break;
      case 'properties':  results.properties  = await syncProperties(cursor); break;
      case 'units':       results.units       = await syncUnits(cursor); break;
      case 'leases':      results.leases      = await syncLeases(cursor); break;
      case 'tenants':     results.tenants     = await syncTenants(cursor); break;
    }
    // bump cursor after each entity
    if (mode === 'incremental') await setSinceCursor(e, new Date().toISOString());
  }
  return { mode, results };
}