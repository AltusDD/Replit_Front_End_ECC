import { useEffect, useState } from "react";
export type BadgeCounts = { workOrdersOpen?: number; collectionsOpen?: number; inventoryLow?: number; };
const boot: BadgeCounts = { workOrdersOpen: 7, collectionsOpen: 3, inventoryLow: 5 };

export function useBadgeCounts(): BadgeCounts {
  const [counts, setCounts] = useState<BadgeCounts>(boot);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [wo, col, inv] = await Promise.all([
          fetch("/api/ops/work/work-orders/count").then(r => r.ok ? r.json() : 0).catch(() => 0),
          fetch("/api/ops/accounting/collections/open-count").then(r => r.ok ? r.json() : 0).catch(() => 0),
          fetch("/api/ops/work/inventory/low-count").then(r => r.ok ? r.json() : 0).catch(() => 0),
        ]);
        if (!cancelled) setCounts({ workOrdersOpen: wo ?? 0, collectionsOpen: col ?? 0, inventoryLow: inv ?? 0 });
      } catch {}
    }
    load();
    const id = setInterval(load, 60_000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);
  return counts;
}
