
import type { FC } from "react";

export type Leaf = { label: string; to: string; icon?: string };
export type Group = { label: string; icon?: string; children: Leaf[] };
export type Item = Leaf | Group;
export type Section = { title?: string; items: Item[] };

export const sections: Section[] = [
{ title: "Dashboard", items: [{ label: "Home", to: "/dashboard", icon: "Home" }] },
{
title: "Portfolio V3",
items: [
{ label: "Properties", to: "/portfolio/properties", icon: "Building2" },
{ label: "Units", to: "/portfolio/units", icon: "Layers" },
{ label: "Leases", to: "/portfolio/leases", icon: "FileText" },
{ label: "Tenants", to: "/portfolio/tenants", icon: "Users" },
{ label: "Owners", to: "/portfolio/owners", icon: "UserRoundCog" },
],
},
{ title: "Cards", items: [
{ label: "Overview", to: "/cards/overview", icon: "LayoutGrid" },
{ label: "Delinquencies", to: "/cards/delinquencies", icon: "CircleAlert" },
{ label: "Vacancy", to: "/cards/vacancy", icon: "House" },
]},
{ title: "Operations", items: [
{ label: "Accounting", to: "/operations/accounting", icon: "Calculator" },
{ label: "Leasing", to: "/operations/leasing", icon: "KeyRound" },
{ label: "Maintenance", to: "/operations/maintenance", icon: "Wrench" },
{ label: "Marketing", to: "/operations/marketing", icon: "Megaphone" },
]},
];

export default sections;
