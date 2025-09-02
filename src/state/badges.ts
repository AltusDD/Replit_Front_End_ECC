import { useEffect, useState } from "react";

export type BadgeCounts = {
  workOrdersOpen?: number;
  collectionsOpen?: number;
  inventoryLow?: number;
  // add more keys as needed
};

const initial: BadgeCounts = {
  workOrdersOpen: 12,
  collectionsOpen: 3,
  inventoryLow: 5,
};

export function useBadgeCounts(): BadgeCounts {
  const [counts, setCounts] = useState<BadgeCounts>(initial);

  // Placeholder polling — replace with real API calls.
  useEffect(() => {
    const id = setInterval(() => {
      setCounts((c) => ({ ...c })); // no-op; hook shows where to refresh
    }, 30000);
    return () => clearInterval(id);
  }, []);

  return counts;
}
