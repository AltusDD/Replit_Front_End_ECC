export type Leaf = { label:string; path:string };
export type Group = { label:string; children:Leaf[] };
export type Section = { label:string; items:(Leaf|Group)[] };

export const NAV: Section[] = [
  { label: "Primary", items: [ {label:"Dashboard", path:"/dashboard"} ] },
  { label: "Portfolio V3", items: [
      {label:"Properties", path:"/portfolio/properties"},
      {label:"Units",      path:"/portfolio/units"},
      {label:"Leases",     path:"/portfolio/leases"},
      {label:"Tenants",    path:"/portfolio/tenants"},
      {label:"Owners",     path:"/portfolio/owners"},
  ]},
  { label: "Cards", items: [
      {label:"Inbox", path:"/cards/inbox"},
      {label:"Tasks", path:"/cards/tasks"},
      {label:"Opportunities", path:"/cards/opportunities"},
      {label:"Anomalies", path:"/cards/anomalies"},
      {label:"Next Best Action", path:"/cards/next-best-action"},
  ]},
  { label: "Operations", items: [
      {label:"Accounting", children:[
        {label:"AR", path:"/ops/accounting/ar"},
        {label:"AP", path:"/ops/accounting/ap"},
        {label:"GL", path:"/ops/accounting/gl"},
        {label:"Banking", path:"/ops/accounting/banking"},
        {label:"Close", path:"/ops/accounting/close"},
        {label:"Reporting", path:"/ops/accounting/reporting"},
        {label:"Budgets", path:"/ops/accounting/budgets"},
        {label:"Taxes", path:"/ops/accounting/taxes"},
        {label:"Vendors", path:"/ops/accounting/vendors"},
        {label:"Receipts", path:"/ops/accounting/receipts"},
        {label:"Allocations", path:"/ops/accounting/allocations"},
        {label:"Audit Trail", path:"/ops/accounting/audit"}
      ]},
      {label:"Leasing", children:[
        {label:"Applications", path:"/ops/leasing/apps"},
        {label:"Screening", path:"/ops/leasing/screening"},
        {label:"Renewals", path:"/ops/leasing/renewals"},
        {label:"Move-in/Move-out", path:"/ops/leasing/mimo"},
        {label:"Delinquencies", path:"/ops/leasing/delinquencies"}
      ]},
      {label:"Maintenance", children:[
        {label:"Work Orders", path:"/ops/maint/work-orders"},
        {label:"Turns", path:"/ops/maint/turns"},
        {label:"CapEx", path:"/ops/maint/capex"},
        {label:"Vendors", path:"/ops/maint/vendors"}
      ]},
      {label:"Compliance", children:[
        {label:"Docs", path:"/ops/compliance/docs"},
        {label:"Inspections", path:"/ops/compliance/inspections"},
        {label:"Insurance", path:"/ops/compliance/insurance"},
        {label:"Licenses", path:"/ops/compliance/licenses"}
      ]},
      {label:"Vendors", children:[
        {label:"Directory", path:"/ops/vendors/directory"},
        {label:"Onboarding", path:"/ops/vendors/onboarding"},
        {label:"Scorecards", path:"/ops/vendors/scorecards"}
      ]},
  ]},
  { label: "Growth", items: [
      {label:"Acquisitions", path:"/growth/acquisitions"},
      {label:"Marketing", path:"/growth/marketing"},
  ]},
  { label: "System", items: [
      {label:"Settings", path:"/system/settings"},
      {label:"Users & Roles", path:"/system/users"},
  ]},
  { label: "Data Management", items: [
      {label:"Imports", path:"/data/imports"},
      {label:"Exports", path:"/data/exports"},
      {label:"Dedupe", path:"/data/dedupe"},
      {label:"Archives", path:"/data/archives"},
      {label:"Audit Logs", path:"/data/audit"},
  ]},
  { label: "Investor Portal", items: [
      {label:"Overview", path:"/investor/overview"},
      {label:"Distributions", path:"/investor/distributions"},
      {label:"Statements", path:"/investor/statements"},
  ]},
  { label: "Integrations", items: [
      {label:"DoorLoop", path:"/integrations/doorloop"},
      {label:"QuickBooks", path:"/integrations/quickbooks"},
      {label:"Azure", path:"/integrations/azure"},
      {label:"Webhooks", path:"/integrations/webhooks"},
  ]},
  { label: "Tools", items: [ {label:"API Probe", path:"/tools/probe"} ] }
];

export function flattenLeaves() {
  const leaves: Leaf[] = [];
  for (const sec of NAV) for (const it of sec.items) {
    if ("path" in it) leaves.push(it as Leaf);
    else (it as Group).children.forEach(c => leaves.push(c));
  }
  return leaves;
}