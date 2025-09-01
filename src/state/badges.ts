// src/state/badges.ts
import { useEffect, useState } from "react";

export type BadgeCounts = {
  workOrdersOpen?: number;
  collectionsOpen?: number;
  inventoryLow?: number;
};

// ----- DEV MOCKS (visible immediately in dev) -----
// Set VITE_BADGES_MOCK=0 to disable
const USE_DEV_MOCKS =
  (import.meta as any).env?.DEV &&
  ((import.meta as any).env?.VITE_BADGES_MOCK ?? "1") !== "0";

const DEV_MOCK: BadgeCounts = { workOrdersOpen: 7, collectionsOpen: 3, inventoryLow: 5 };
// --------------------------------------------------

async function safeCount(urls: string[]): Promise<number> {
  for (const u of urls) {
    try {
      const r = await fetch(u, { headers: { Accept: "application/json" } });
      if (!r.ok) continue;
      const j = await r.json();
      const n =
        typeof j === "number"
          ? j
          : typeof j?.count === "number"
          ? j.count
          : typeof j?.data?.count === "number"
          ? j.data.count
          : 0;
      return Number.isFinite(n) ? n : 0;
    } catch {
      // next
    }
  }
  return 0;
}

async function fetchBadgeCounts(): Promise<BadgeCounts> {
  const [wo, col, inv] = await Promise.all([
    safeCount([
      "/api/ops/work/work-orders/count",
      "/api/work-orders/count",
      "/api/work_orders/count",
      "/api/workOrders/count",
    ]),
    safeCount([
      "/api/ops/accounting/collections/open-count",
      "/api/collections/open/count",
      "/api/collections/count?status=open",
    ]),
    safeCount([
      "/api/ops/work/inventory/low-count",
      "/api/inventory/low/count",
      "/api/inventory/count?level=low",
    ]),
  ]);
  return { workOrdersOpen: wo, collectionsOpen: col, inventoryLow: inv };
}

const ZERO: BadgeCounts = { workOrdersOpen: 0, collectionsOpen: 0, inventoryLow: 0 };

export function useBadgeCounts(): BadgeCounts {
  const [counts, setCounts] = useState<BadgeCounts>(USE_DEV_MOCKS ? DEV_MOCK : ZERO);

  useEffect(() => {
    let off = false;
    const load = async () => {
      try {
        const live = await fetchBadgeCounts();
        const sum = (live.workOrdersOpen ?? 0) + (live.collectionsOpen ?? 0) + (live.inventoryLow ?? 0);
        // If API returns all zeros in dev, keep mocks visible
        const next = USE_DEV_MOCKS && sum === 0 ? DEV_MOCK : live;
        if (!off) setCounts(next);
      } catch {
        // keep current (mocks in dev, zeros in prod)
      }
    };
    load();
    const id = setInterval(load, 60_000);
    return () => {
      off = true;
      clearInterval(id);
    };
  }, []);

  return counts;
}
