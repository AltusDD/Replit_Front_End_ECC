// server/lib/mapping.ts
export type AddrSrc = {
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  address_city?: string | null;
  address_state?: string | null;
  address_zip?: string | null;
  street_1?: string | null;
  address_street1?: string | null;
};

export function mapAddress(src: AddrSrc) {
  return {
    city: src.city ?? src.address_city ?? null,
    state: src.state ?? src.address_state ?? null,
    zip: src.zip ?? src.address_zip ?? null,
    street1: src.street_1 ?? src.address_street1 ?? null,
  };
}

export function pickId<T extends { id?: any; doorloop_id?: any }>(row: T) {
  return row?.id ?? null;
}

// Build a dual-key predicate for Supabase .or()
export function orByPropIdOrDoorLoop(propertyId?: number | null, doorloopId?: number | string | null) {
  const pid = propertyId != null ? `property_id.eq.${propertyId}` : '';
  const did = doorloopId != null ? `doorloop_property_id.eq.${doorloopId}` : '';
  const parts = [pid, did].filter(Boolean);
  if (!parts.length) return 'id.lt.0'; // impossible, returns empty set
  return parts.join(',');
}

export function normalizeStatus(s?: string | null) {
  if (!s) return null;
  const k = String(s).toLowerCase().trim();
  if (["active","current","occupied"].includes(k)) return "active";
  if (["pending","future"].includes(k)) return "pending";
  if (["ended","terminated","closed","past","inactive","cancelled","canceled"].includes(k)) return "ended";
  return k;
}