# **Empire Command Center (ECC) — Repo Organization & Tracking (LAW)**

Status: Adopted  
Version: 1.1  
Scope: ECC frontend (React + Vite)  
Principles: Feature-first, SSOT for navigation, DB-first UI, production guardrails

## **1) Executive Summary**

The Empire Command Center (ECC) uses a feature-first folder layout with one canonical navigation configuration and one canonical Sidebar component. All imports use TypeScript path aliases to prevent "wrong file" drift. Lint rules, tests, and CI guardrails verify that the app shell, navigation, theme tokens, and build scripts follow this layout. If the repository drifts from this standard, it must be reset to align with this document.

## **2) Directory Structure (Authoritative)**

This structure separates the application **shell** (the frame and core logic) from the **features** (the business-specific modules).

src/  
├── app/                              # App shell, boot process, and global providers.  
│   ├── App.tsx                         # Root component, router, and page frame (Shell).  
│   └── main.tsx                        # Vite entry point.  
│  
├── assets/                           # Static assets.  
│   └── brand/                          # Altus brand logos, marks, and favicons.  
│  
├── components/                       # Globally reusable, "dumb" UI components (non-feature specific).  
│   ├── data/                           # Reusable tables, charts, cards.  
│   └── feedback/                       # Toasters, empty states, loaders, modals.  
│  
├── config/                           # Runtime & build-time config (SSOTs live here).  
│   ├── env.ts                          # VITE_* environment variable validation and exposure.  
│   └── navigation.ts                   # NAV SSOT (the ONLY source of truth for navigation).  
│  
├── features/                         # Feature-first modules. Each contains its own pages, components, hooks, and API logic.  
│   ├── portfolio/                      # Properties, Units, Leases, Tenants, Owners.  
│   │   ├── pages/  
│   │   ├── components/  
│   │   └── hooks/  
│   ├── ops/                            # Day-to-day operations.  
│   │   ├── accounting/  
│   │   ├── maintenance/  
│   │   └── legal/  
│   ├── analytics/                      # Reports and KPI dashboards.  
│   │   └── pages/  
│   └── admin/                          # User management, settings, integrations.  
│       └── pages/  
│  
├── layout/                           # App frame components (Sidebar, Header, etc.).  
│   ├── Sidebar.tsx                     # Canonical Sidebar (must import NAV SSOT from @config/navigation).  
│   ├── GlobalSearch.tsx                # Top search bar + Cmd/Ctrl-K palette.  
│   └── Shell.tsx                       # Main layout frame wrapping page content.  
│  
├── lib/                              # Cross-cutting libraries (API clients, formatting, logging).  
│   └── api/                            # API client wrappers and data transfer object (DTO) types.  
│  
├── state/                            # Global state stores (Zustand). Should be used sparingly.  
│   └── badges.ts                       # Live badge counts for sidebar (e.g., open work orders).  
│  
└── styles/                           # Global CSS and design tokens.  
    ├── app.css                         # Global component styles (sidebar, search, tables).  
    ├── reset.css                       # CSS reset.  
    └── theme-tokens.css                # "Genesis Empire" design tokens (Altus black/gold CSS variables).

**Rules:**

* **One Sidebar:** The only Sidebar.tsx file permitted is at src/layout/Sidebar.tsx.  
* **One Nav Config:** The only navigation source of truth is src/config/navigation.ts.  
* **Feature Encapsulation:** Features must keep their own pages, components, and logic inside their src/features/<feature>/ directory.

## **3) Navigation — Single Source of Truth (SSOT)**

* **File:** src/config/navigation.ts  
* **Consumers:** src/layout/Sidebar.tsx, src/layout/GlobalSearch.tsx  
* **Contract:**  
  // src/config/navigation.ts  
  export type NavItem = {  
    label: string;  
    path?: string;  
    icon: string; // lucide-react icon name  
    badgeKey?: keyof BadgeCounts;  
    children?: NavItem[];  
  };  
  export type NavSection = { label: string; items: NavItem[] };  
  export const NAV_SECTIONS: NavSection[] = [ /* ... all nav items ... */ ];

* **Enforcement:**  
  * Imports **must** use the alias: import { NAV_SECTIONS } from '@/config/navigation'.  
  * ESLint rules and CI guards will fail the build if any other *nav*config* file is detected.

## **4) Naming Conventions**

| Thing | Convention | Example |
| :---- | :---- | :---- |
| React components | PascalCase.tsx | Sidebar.tsx, PropertiesPage.tsx |
| Directories & files | kebab-case | feature-name/api/portfolio.ts |
| Utilities, hooks | camelCase.ts | useBadgeCounts.ts, formatMoney.ts |
| Constants | SCREAMING_SNAKE_CASE | DEFAULT_PAGE_SIZE |
| Routes (URL Paths) | lowercase-with-hyphens | /ops/maintenance/work-orders |
| Env vars (VITE only) | VITE_* | VITE_API_BASE_URL |
| Test files | *.test.ts or *.spec.ts | PropertiesPage.test.tsx |
| Styles | global.css, theme-tokens.css |  |

## **5) Git, Versioning, & Release Strategy**

* **Branching Model:** Trunk-Based Development. All work is done on short-lived feature branches cut from main. Branches should be deleted after merging.  
* **Commit Messages:** Must follow the **Conventional Commits** specification (e.g., feat:, fix:, docs:, refactor:). This is enforced by pre-commit hooks.  
* **Versioning & Changelog:** The project uses Semantic Versioning (SemVer). Versioning and CHANGELOG.md updates are automated via a tool like **Release Please** integrated into the CI/CD pipeline on merges to main.

## **6) Quality Gates & Testing Strategy**

* **Linting & Formatting:** ESLint and Prettier are run automatically on every commit via **Husky** and **lint-staged**.  
* **Type Checking:** The CI pipeline runs tsc --noEmit to ensure type safety.  
* **Unit & Component Testing:** **Vitest** and **React Testing Library** are used for testing hooks, utilities, and components.  
* **E2E & Visual Regression Testing:** **Playwright** is recommended for end-to-end tests that simulate user flows and catch visual regressions.  
* **Component Isolation:** **Storybook** is recommended for developing and documenting reusable UI components in isolation.  
* **Drift Control Guardrails:**  
  * A dedicated test file (src/app/__tests__/import-guards.test.ts) verifies that the App.tsx shell imports the canonical Sidebar and navigation SSOT.  
  * A shell script (scripts/guard.sh) runs in CI to fail the build if any deprecated or duplicate files (e.g., old Sidebar paths) exist in the repository.

## **7) Day-0 Migration Checklist (Run Once)**

1. **Branch:** Create a new branch refactor/feature-first-migration from main.  
2. **Create Structure:** Create the new directory structure defined in §2.  
3. **Configure:** Replace tsconfig.json and vite.config.ts with the new alias configurations.  
4. **Consolidate Sidebar:** Move the one true Sidebar to src/layout/Sidebar.tsx and delete all other duplicates.  
5. **Consolidate Nav:** Move the contents of the one true nav config into src/config/navigation.ts and delete all other duplicates.  
6. **Move Files:** Relocate all other files from src/ into their new homes in the feature-first structure.  
7. **Update Imports:** Run a global find-and-replace to update all relative imports to use the new @/ path aliases.  
8. **Add Guards:** Create the scripts/guard.sh and src/app/__tests__/import-guards.test.ts files.  
9. **Verify:** Run npm ci && npm run lint && npm run typecheck && npm test && bash scripts/guard.sh && npm run build.  
10. **Submit PR:** Submit a Pull Request for review.