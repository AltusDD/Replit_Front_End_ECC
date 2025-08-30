export type NavLeaf = { type:"leaf"; label:string; path:string };
export type NavParent = { type:"parent"; label:string; items:(NavLeaf)[] };
export type NavSection = { label:string; items:(NavParent)[] };
export const NAV: NavSection[] = [
  {
    "label": "Primary",
    "items": [
      {
        "type": "leaf",
        "label": "Dashboard",
        "path": "/dashboard"
      }
    ]
  },
  {
    "label": "Portfolio V3",
    "items": [
      {
        "type": "parent",
        "label": "Portfolio V3",
        "items": [
          {
            "type": "leaf",
            "label": "Properties",
            "path": "/portfolio/properties"
          },
          {
            "type": "leaf",
            "label": "Units",
            "path": "/portfolio/units"
          },
          {
            "type": "leaf",
            "label": "Leases",
            "path": "/portfolio/leases"
          },
          {
            "type": "leaf",
            "label": "Tenants",
            "path": "/portfolio/tenants"
          },
          {
            "type": "leaf",
            "label": "Owners",
            "path": "/portfolio/owners"
          }
        ]
      }
    ]
  },
  {
    "label": "Cards",
    "items": [
      {
        "type": "parent",
        "label": "Cards",
        "items": [
          {
            "type": "leaf",
            "label": "Property Card",
            "path": "/card/property/:id"
          },
          {
            "type": "leaf",
            "label": "Unit Card",
            "path": "/card/unit/:id"
          },
          {
            "type": "leaf",
            "label": "Lease Card",
            "path": "/card/lease/:id"
          },
          {
            "type": "leaf",
            "label": "Tenant Card",
            "path": "/card/tenant/:id"
          },
          {
            "type": "leaf",
            "label": "Owner Card",
            "path": "/card/owner/:id"
          }
        ]
      }
    ]
  },
  {
    "label": "Operations",
    "items": [
      {
        "type": "parent",
        "label": "Accounting",
        "items": [
          {
            "type": "leaf",
            "label": "Overview",
            "path": "/ops/accounting/overview"
          },
          {
            "type": "leaf",
            "label": "Rent Collection",
            "path": "/ops/accounting/rent-collection"
          },
          {
            "type": "leaf",
            "label": "Expenses",
            "path": "/ops/accounting/expenses"
          },
          {
            "type": "leaf",
            "label": "Financial Reports",
            "path": "/ops/accounting/financial-reports"
          },
          {
            "type": "leaf",
            "label": "Tenant Ledgers",
            "path": "/ops/accounting/tenant-ledgers"
          },
          {
            "type": "leaf",
            "label": "Collections Dashboard",
            "path": "/ops/accounting/collections-dashboard"
          },
          {
            "type": "leaf",
            "label": "Collections Log",
            "path": "/ops/accounting/collections-log"
          },
          {
            "type": "leaf",
            "label": "Payment Plans",
            "path": "/ops/accounting/payment-plans"
          },
          {
            "type": "leaf",
            "label": "Deposits",
            "path": "/ops/accounting/deposits"
          },
          {
            "type": "leaf",
            "label": "Transfers",
            "path": "/ops/accounting/transfers"
          },
          {
            "type": "leaf",
            "label": "Subsidized Housing",
            "path": "/ops/accounting/subsidized-housing"
          },
          {
            "type": "leaf",
            "label": "Assistance Programs",
            "path": "/ops/accounting/assistance-programs"
          }
        ]
      },
      {
        "type": "parent",
        "label": "AI Analytics",
        "items": [
          {
            "type": "leaf",
            "label": "Risk Summary",
            "path": "/ops/ai/risk-summary"
          },
          {
            "type": "leaf",
            "label": "Renewal Forecasting",
            "path": "/ops/ai/renewal-forecasting"
          },
          {
            "type": "leaf",
            "label": "Vacancy Analytics",
            "path": "/ops/ai/vacancy-analytics"
          },
          {
            "type": "leaf",
            "label": "ML Leasing Logs",
            "path": "/ops/ai/ml-leasing-logs"
          }
        ]
      },
      {
        "type": "parent",
        "label": "Legal Tracker",
        "items": [
          {
            "type": "leaf",
            "label": "Case Manager",
            "path": "/ops/legal/case-manager"
          },
          {
            "type": "leaf",
            "label": "Advanced Legal Ops",
            "path": "/ops/legal/advanced"
          },
          {
            "type": "leaf",
            "label": "Legal Docs",
            "path": "/ops/legal/docs"
          },
          {
            "type": "leaf",
            "label": "Attorney Reports",
            "path": "/ops/legal/attorney-reports"
          }
        ]
      },
      {
        "type": "parent",
        "label": "Communication",
        "items": [
          {
            "type": "leaf",
            "label": "Queue",
            "path": "/ops/comms/queue"
          },
          {
            "type": "leaf",
            "label": "Templates",
            "path": "/ops/comms/templates"
          },
          {
            "type": "leaf",
            "label": "Logs",
            "path": "/ops/comms/logs"
          }
        ]
      },
      {
        "type": "parent",
        "label": "Work Orders",
        "items": [
          {
            "type": "leaf",
            "label": "Work Orders",
            "path": "/ops/work/work-orders"
          },
          {
            "type": "leaf",
            "label": "Vendors",
            "path": "/ops/work/vendors"
          },
          {
            "type": "leaf",
            "label": "Materials & Inventory",
            "path": "/ops/work/materials-inventory"
          },
          {
            "type": "leaf",
            "label": "Smart Routing",
            "path": "/ops/work/smart-routing"
          },
          {
            "type": "leaf",
            "label": "AI Intelligence",
            "path": "/ops/work/ai-intelligence"
          },
          {
            "type": "leaf",
            "label": "Build/Repair Projects",
            "path": "/ops/work/build-repair-projects"
          },
          {
            "type": "leaf",
            "label": "Capital Projects",
            "path": "/ops/work/capital-projects"
          }
        ]
      },
      {
        "type": "leaf",
        "label": "Reports",
        "path": "/ops/reports"
      }
    ]
  },
  {
    "label": "Growth",
    "items": [
      {
        "type": "leaf",
        "label": "Inventory",
        "path": "/growth/inventory"
      },
      {
        "type": "leaf",
        "label": "Marketing",
        "path": "/growth/marketing"
      }
    ]
  },
  {
    "label": "System",
    "items": [
      {
        "type": "leaf",
        "label": "Automation",
        "path": "/system/automation"
      },
      {
        "type": "leaf",
        "label": "Settings",
        "path": "/system/settings"
      }
    ]
  },
  {
    "label": "Data Management",
    "items": [
      {
        "type": "parent",
        "label": "Data Management",
        "items": [
          {
            "type": "leaf",
            "label": "Sync Audit",
            "path": "/data/sync-audit"
          },
          {
            "type": "leaf",
            "label": "Sync Management",
            "path": "/data/sync-management"
          },
          {
            "type": "leaf",
            "label": "Raw Data",
            "path": "/data/raw"
          },
          {
            "type": "leaf",
            "label": "Sync Logs",
            "path": "/data/sync-logs"
          },
          {
            "type": "leaf",
            "label": "System Settings",
            "path": "/data/system-settings"
          }
        ]
      }
    ]
  },
  {
    "label": "Investor Portal",
    "items": [
      {
        "type": "parent",
        "label": "Investor Portal",
        "items": [
          {
            "type": "leaf",
            "label": "Dashboard",
            "path": "/investor/dashboard"
          },
          {
            "type": "leaf",
            "label": "Portfolio Analytics",
            "path": "/investor/portfolio-analytics"
          },
          {
            "type": "leaf",
            "label": "Financial Reports",
            "path": "/investor/financial-reports"
          }
        ]
      }
    ]
  },
  {
    "label": "Integrations",
    "items": [
      {
        "type": "parent",
        "label": "Integrations",
        "items": [
          {
            "type": "leaf",
            "label": "Dropbox Files",
            "path": "/integrations/dropbox"
          },
          {
            "type": "leaf",
            "label": "CoreLogic / MLS Grid",
            "path": "/integrations/corelogic"
          },
          {
            "type": "leaf",
            "label": "Field App Link",
            "path": "/integrations/field-app"
          },
          {
            "type": "leaf",
            "label": "Deal Room Link",
            "path": "/integrations/deal-room"
          }
        ]
      }
    ]
  }
];
