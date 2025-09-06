// Centralized portfolio calculations to avoid zero KPIs

export const OCCUPIED = new Set(["occupied", "OCCUPIED"]);
export const VACANT = new Set(["vacant", "VACANT"]);
export const READY = (u: any) => !!(u.rent_ready || u.turn_status === "ready");

export function occupancy(units: any[]) {
  const total = units.filter(u => !u.model && !u.down).length;
  const occ = units.filter(u => OCCUPIED.has(String(u.status))).length;
  return { occ, total, ratio: total ? occ / total : 0 };
}

export function rentReadyVacant(units: any[]) {
  const vac = units.filter(u => VACANT.has(String(u.status)));
  const ready = vac.filter(READY);
  return { ready: ready.length, vac: vac.length };
}

export function collectionsMTD(tx: any[], today = new Date()) {
  const y = today.getFullYear(), m = today.getMonth();
  const inMonth = (d: string) => {
    const dt = new Date(d);
    return dt.getFullYear() === y && dt.getMonth() === m;
  };
  const billed = tx.filter(t => t.kind === "rent_charge" && inMonth(t.date))
    .reduce((s, t) => s + (t.amount_cents || 0), 0);
  const receipts = tx.filter(t => t.kind === "rent_payment" && inMonth(t.date))
    .reduce((s, t) => s + (t.amount_cents || 0), 0);
  return { billed_cents: billed, receipts_cents: receipts, ratio: billed ? receipts / billed : 0 };
}

export function noiMTD(tx: any[], excludeCapex = true) {
  const isIncome = (t: any) => ["rent_payment", "other_income"].includes(t.kind);
  const isExpense = (t: any) => ["opex", "repair", "utility", "tax", "insurance", "capex"].includes(t.kind);
  const m = new Date().getMonth(), y = new Date().getFullYear();
  const inMonth = (d: string) => {
    const dt = new Date(d);
    return dt.getFullYear() === y && dt.getMonth() === m;
  };
  const inc = tx.filter(t => inMonth(t.date) && isIncome(t))
    .reduce((s, t) => s + (t.amount_cents || 0), 0);
  const exp = tx.filter(t => inMonth(t.date) && isExpense(t) && (!excludeCapex || t.kind !== "capex"))
    .reduce((s, t) => s + (t.amount_cents || 0), 0);
  return { inc_cents: inc, exp_cents: exp, noi_cents: inc - exp };
}