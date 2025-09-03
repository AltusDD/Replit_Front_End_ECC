export const PROPERTY_COLUMNS = [
  { key: "name",        header: "Property" },
  { key: "type",        header: "Type" },
  { key: "class",       header: "Class" },
  { key: "state",       header: "State" },
  { key: "city",        header: "City" },
  { key: "unit_count",  header: "Units" },
  { key: "occupancy",   header: "Occ%" },
  { key: "active",      header: "Active" },
];

export const UNIT_COLUMNS = [
  { key: "property",    header: "Property" },
  { key: "unit_number", header: "Unit" },
  { key: "beds",        header: "Bd" },
  { key: "baths",       header: "Ba" },
  { key: "sq_ft",       header: "SqFt" },
  { key: "status",      header: "Status" },
  { key: "market_rent", header: "Market Rent" },
];

export const LEASE_COLUMNS = [
  { key: "tenant_names", header: "Tenant(s)" },
  { key: "property",     header: "Property" },
  { key: "rent",         header: "Rent" },
  { key: "start",        header: "Start" },
  { key: "end",          header: "End" },
  { key: "status",       header: "Status" },
];

export const TENANT_COLUMNS = [
  { key: "name",     header: "Name" },
  { key: "property", header: "Property" },
  { key: "unit",     header: "Unit" },
  { key: "email",    header: "Email" },
  { key: "phone",    header: "Phone" },
  { key: "status",   header: "Status" },
  { key: "balance",  header: "Balance" },
];

export const OWNER_COLUMNS = [
  { key: "name",           header: "Owner" },
  { key: "email",          header: "Email" },
  { key: "phone",          header: "Phone" },
  { key: "property_count", header: "Props" },
  { key: "active",         header: "Active" },
];

// keep signatures the pages expect
export const mapProperty = (r: any) => r;
export const mapUnit      = (r: any) => r;
export const mapLease     = (r: any) => r;
export const mapTenant    = (r: any) => r;
export const mapOwner     = (r: any) => r;