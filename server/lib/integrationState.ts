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

export async function getState(key: string) {
  const { data, error } = await sbAdmin.from("integration_state").select("key,value").eq("key", key).maybeSingle();
  if (error) return null;
  return data as { key: string; value: any } | null;
}

export async function upsertState(key: string, value: any) {
  await sbAdmin.from("integration_state").upsert({ key, value }).throwOnError();
}