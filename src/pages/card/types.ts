// Shared types for ECC Portfolio Card Pages
export type Id = string;

export interface Kpi {
  label: string;
  value: string | number;
  deltaPct?: number;
}

export interface LinkedSummary {
  units?: number;
  leases?: number;
  tenants?: number;
  owner?: { id: Id; name: string };
}

export interface BaseCardDTO {
  id: Id;
  title: string;
  badges: string[];
  kpis: Kpi[];
  linked?: LinkedSummary;
  insights?: string[];
}

// Entity-specific DTOs
export interface PropertyCardDTO extends BaseCardDTO {
  address: {
    line1: string;
    city: string;
    state: string;
    zip: string;
  };
  status: Array<"Active"|"Vacant"|"Delinquent"|"Renewal30"|"InLegal"|"OnHold">;
}

export interface UnitCardDTO extends BaseCardDTO {
  property: { id: Id; name: string };
  unit_number: string;
  status: "Occupied" | "Turn" | "Vacant";
  beds: number;
  baths: number;
  rent: number;
  lease_end?: string;
}

export interface LeaseCardDTO extends BaseCardDTO {
  property: { id: Id; name: string };
  unit: { id: Id; number: string };
  tenant: { id: Id; name: string };
  monthly_rent: number;
  start_date: string;
  end_date: string;
  balance: number;
  last_payment?: string;
}

export interface TenantCardDTO extends BaseCardDTO {
  email: string;
  phone: string;
  balance: number;
  last_payment?: string;
  current_lease?: { id: Id; property: string; unit: string; ends: string };
  risk_score?: number;
}

export interface OwnerCardDTO extends BaseCardDTO {
  email: string;
  phone: string;
  properties_count: number;
  portfolio_value: number;
  occupancy: number;
  distributions_ytd: number;
}