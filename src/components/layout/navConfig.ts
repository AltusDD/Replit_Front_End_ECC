import type { LucideIcon } from "lucide-react";
import {
  Home, LayoutDashboard, FolderTree, Building2, DoorOpen, FileText,
  Users, Crown, LayoutGrid, AlertCircle, HomeOff,
  Calculator, FileSignature, Wrench, Megaphone
} from "lucide-react";

export type NavItem = { label: string; href: string; icon?: LucideIcon };
export type NavSection = { id: string; title: string; icon?: LucideIcon; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: LayoutDashboard,
    items: [{ label: "Home", href: "/dashboard", icon: Home }],
  },
  {
    id: "portfolio",
    title: "Portfolio v3",
    icon: FolderTree,
    items: [
      { label: "Properties", href: "/properties", icon: Building2 },
      { label: "Units", href: "/units", icon: DoorOpen },
      { label: "Leases", href: "/leases", icon: FileText },
      { label: "Tenants", href: "/tenants", icon: Users },
      { label: "Owners", href: "/owners", icon: Crown },
    ],
  },
  {
    id: "cards",
    title: "Cards",
    icon: LayoutGrid,
    items: [
      { label: "Overview", href: "/cards/overview", icon: LayoutGrid },
      { label: "Delinquencies", href: "/cards/delinquencies", icon: AlertCircle },
      { label: "Vacancy", href: "/cards/vacancy", icon: HomeOff },
    ],
  },
  {
    id: "ops",
    title: "Operations",
    icon: FolderTree,
    items: [
      { label: "Accounting", href: "/ops/accounting", icon: Calculator },
      { label: "Leasing", href: "/ops/leasing", icon: FileSignature },
      { label: "Maintenance", href: "/ops/maintenance", icon: Wrench },
      { label: "Marketing", href: "/ops/marketing", icon: Megaphone },
    ],
  },
];