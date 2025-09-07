# **AI Briefing: Empire Command Center (ECC) Frontend**

## **1\. Project Mission & Core Principles**

**Mission:** To build a "Genesis Grade" internal tool for the Altus real estate firm. The UI must be an intelligent, actionable command center for managing a portfolio of Single Family Residences (SFRs).

**Core Principles:**

* **Actionable Intelligence:** Every UI element must guide the user to a decision or action. No dead-end data.  
* **Genesis Empire Standard:** The UI must be visually polished, professional, and powerful, adhering to the brand's dark theme (Altus Black \#0b0e12 and Altus Gold \#d6b36a).  
* **Data Density & Clarity:** The UI must present complex information in a scannable, intuitive way using charts, indicators, and visual cues.  
* **DB-First:** The frontend is for display and interaction only. All calculations and business logic are handled by the backend API. The UI must work with the data shapes provided.

## **2\. Technology Stack**

* **Framework:** React \+ Vite  
* **Language:** TypeScript  
* **Routing:** wouter  
* **Icons:** lucide-react  
* **Styling:** Global CSS files (app.css, theme.css). No Tailwind CSS yet.  
* **Environment:** Replit (The UI renders inside an \<iframe\>).

## **3\. Current File Structure (Abbreviated)**

The project follows a feature-first architecture.

src/  
├── app/  
│   └── App.tsx              \# Main application shell, routes  
├── components/  
│   └── (Reusable UI components)  
├── config/  
│   └── navigation.ts        \# Single Source of Truth for nav items  
├── features/  
│   ├── dashboard/           \# YOUR WORK WILL GO HERE  
│   └── portfolio/  
├── layout/  
│   └── Sidebar.tsx          \# The canonical, working sidebar  
├── styles/  
│   ├── app.css              \# Component styles  
│   └── theme.css            \# CSS variables for colors, fonts  
└── ...

## **4\. Key Existing Code (ESSENTIAL CONTEXT)**

This is the code for the main application shell and sidebar. You must understand and integrate with this structure.

\<details\>  
\<summary\>\<b\>src/app/App.tsx (Main Shell & Routes)\</b\>\</summary\>  
// This file sets up the main layout with the sidebar and content area.  
// Your new Dashboard page will be the default route.  
import React from 'react';  
import { Route, Switch } from "wouter";  
import Sidebar from '@/layout/Sidebar'; // Using path alias  
import DashboardPage from '@/features/dashboard/pages/DashboardPage';  
// Other page imports...

export default function App() {  
  return (  
    \<div className="app-shell"\>  
      \<Sidebar /\>  
      \<main className="app-content"\>  
        \<Switch\>  
          \<Route path="/dashboard" component={DashboardPage} /\>  
          \<Route path="/" component={DashboardPage} /\>  
          {/\* Other routes for portfolio pages, etc. \*/}  
        \</Switch\>  
      \</main\>  
    \</div\>  
  );  
}

\</details\>

\<details\>  
\<summary\>\<b\>src/layout/Sidebar.tsx (Navigation Structure)\</b\>\</summary\>  
// This file contains the complete navigation data structure.  
// You do not need to modify this file, but you must understand its structure.  
import React, { useEffect, useRef, useState } from "react";  
import { Link, useLocation } from "wouter";  
import { createPortal } from "react-dom";  
import \* as Icons from "lucide-react";

const LOGO\_WIDE \= "/brand/altus-logo.png";  
const LOGO\_SQUARE \= "/brand/altus-mark.png";

// (SafeImg and ECMonogram components are here)

type IconName \= "LayoutDashboard" | "Boxes" | "FileText" | "Shield" | "Scale" | "MessageSquare" | "Hammer" | "BarChart3" | "PieChart" | "Settings" | "Database" | "Users" | "IdCard" | "Package" | "FolderOpen" | "ClipboardList" | "Workflow" | "Receipt" | "Building2" | "Wrench" | "Cpu" | "Link2" | "ChartNoAxesColumn" | "FileSpreadsheet";  
type NavChild \= { title: string; path: string; icon?: IconName };  
type NavParent \= { title:string; icon: IconName; path?: string; children?: NavChild\[\] };

const NAV: NavParent\[\] \= \[  
    { title: "Dashboard", icon: "LayoutDashboard", path: "/dashboard" },  
    {  
        title: "Portfolio V3",  
        icon: "Boxes",  
        children: \[  
            { title: "Properties", path: "/portfolio/properties", icon: "Building2" },  
            { title: "Units", path: "/portfolio/units", icon: "Package" },  
            { title: "Leases", path: "/portfolio/leases", icon: "FileSpreadsheet" },  
            { title: "Tenants", path: "/portfolio/tenants", icon: "Users" },  
            { title: "Owners", path: "/portfolio/owners", icon: "IdCard" },  
        \],  
    },  
    // ... all other navigation items from previous code ...  
\];

// ... rest of the Sidebar component logic ...  
export default function Sidebar() { /\* ... full component code ... \*/ }

\</details\>

\<details\>  
\<summary\>\<b\>src/styles/theme.css (Brand Colors)\</b\>\</summary\>  
/\* This file contains the official brand color variables. Use these in all new CSS. \*/  
:root {  
  \--altus-black: \#0b0e12;  
  \--altus-dark-panel: \#1a1d21;  
  \--altus-border: \#2a2d31;  
  \--altus-gold: \#d6b36a;  
  \--altus-text-primary: \#e2e2e2;  
  \--altus-text-secondary: \#a0a0a0;  
  \--status-green: \#34d399;  
  \--status-red: \#ef4444;  
  \--status-yellow: \#f59e0b;  
  \--status-blue: \#3b82f6;  
}

\</details\>