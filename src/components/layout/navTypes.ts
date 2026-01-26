import type * as Icons from "lucide-react";
export type IconName = keyof typeof Icons;

export type NavBadgeCounts = Record<string, number | undefined>;

export type CanonNavLink = {
  key: string;
  label: string;
  href: string;
  icon?: IconName;
  badgeKey?: string;
};
export type CanonNavSection = {
  key: string;
  label: string;
  icon?: IconName;
  children: CanonNavLink[];
};