export type BadgeCounts = {
  workOrdersOpen?: number;
  collectionsOpen?: number;
  inventoryLow?: number;
};
const initial: BadgeCounts = { workOrdersOpen: 0, collectionsOpen: 0, inventoryLow: 0 };
export function useBadgeCounts(): BadgeCounts { return initial; }
