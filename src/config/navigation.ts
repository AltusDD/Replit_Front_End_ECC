// SSOT: src/config/navigation.ts
export type NavItem = {
  label: string;
  path?: string;
  icon: string;
  badgeKey?: keyof BadgeCounts;
  children?: NavItem[];
};
export type NavSection = { label: string; items: NavItem[] };
export const NAV_SECTIONS: NavSection[] = []; // fill with your current nav
