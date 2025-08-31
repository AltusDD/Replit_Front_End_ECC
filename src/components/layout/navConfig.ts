// src/components/layout/navConfig.ts
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Home,
  Building2,
  Layers,
  FileText,
  Users,
  UserCircle,
  SquareStack,
  LayoutGrid,
  AlertTriangle,
  Calculator,
  Key,
  Wrench,
  Megaphone,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon?: LucideIcon;
};

export type NavSection = {
  id: string;
  title: string;
  icon?: LucideIcon;
  items: NavItem[];
};

/**
 * Canonical sidebar model
 * - Parents: Dashboard, Portfolio V3, Cards, Operations
 * - Children: as requested
 */
export const NAV_SECTIONS: NavSection[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: LayoutDashboard,
    items: [
      { label: "Home", href: "/dashboard", icon: Home },
    ],
  },
  {
    id: "portfolio-v3",
    title: "Portfolio V3",
    icon: Building2,
    items: [
      { label: "Properties", href: "/properties", icon: Building2 },
      { label: "Units", href: "/units", icon: Layers },
      { label: "Leases", href: "/leases", icon: FileText },
      { label: "Tenants", href: "/tenants", icon: Users },
      { label: "Owners", href: "/owners", icon: UserCircle },
    ],
  },
  {
    id: "cards",
    title: "Cards",
    icon: SquareStack,
    items: [
      { label: "Overview", href: "/cards/overview", icon: LayoutGrid },
      { label: "Delinquencies", href: "/cards/delinquencies", icon: AlertTriangle },
      { label: "Vacancy", href: "/cards/vacancy", icon: Home },
    ],
  },
  {
    id: "operations",
    title: "Operations",
    icon: Wrench,
    items: [
      { label: "Accounting", href: "/ops/accounting", icon: Calculator },
      { label: "Leasing", href: "/ops/leasing", icon: Key },
      { label: "Maintenance", href: "/ops/maintenance", icon: Wrench },
      { label: "Marketing", href: "/ops/marketing", icon: Megaphone },
    ],
  },
];