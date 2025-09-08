// server/lib/integrationState.ts
import { sbAdmin } from './supabaseAdmin';

const KEY = (k:string) => `doorloop_${k}`;

export async function getSinceCursor(name: string): Promise<string|null> {
  const { data } = await sbAdmin
    .from('integration_state')
    .select('value')
    .eq('key', KEY(name))
    .single();
  return (data?.value as any)?.last_cursor ?? null;
}

export async function setSinceCursor(name: string, cursor: string) {
  await sbAdmin.from('integration_state').upsert({
    key: KEY(name),
    value: { last_cursor: cursor },
  });
}