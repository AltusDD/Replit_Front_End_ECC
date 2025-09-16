import { useQuery } from "@tanstack/react-query";
import { PropertyCard, UnitCard, LeaseCard, TenantCard, OwnerCard } from "@/shared/card-contracts";
import { fetchJSON } from "@/lib/http";

// Fail-fast: parse (not safeParse). Any invalid contract throws and surfaces to UI.
export function usePropertyCard(id: number) {
  return useQuery({
    queryKey: ["card","property", id],
    queryFn: ({ signal }) => fetchJSON(`/api/rpc/get_property_card?id=${id}`, { signal }).then(data => PropertyCard.parse(data)),
  });
}
export function useUnitCard(id: number) {
  return useQuery({
    queryKey: ["card","unit", id],
    queryFn: ({ signal }) => fetchJSON(`/api/rpc/get_unit_card?id=${id}`, { signal }).then(data => UnitCard.parse(data)),
  });
}
export function useLeaseCard(id: number) {
  return useQuery({
    queryKey: ["card","lease", id],
    queryFn: ({ signal }) => fetchJSON(`/api/rpc/get_lease_card?id=${id}`, { signal }).then(data => LeaseCard.parse(data)),
  });
}
export function useTenantCard(id: number) {
  return useQuery({
    queryKey: ["card","tenant", id],
    queryFn: ({ signal }) => fetchJSON(`/api/rpc/get_tenant_card?id=${id}`, { signal }).then(data => TenantCard.parse(data)),
  });
}
export function useOwnerCard(id: number) {
  return useQuery({
    queryKey: ["card","owner", id],
    queryFn: ({ signal }) => fetchJSON(`/api/rpc/get_owner_card?id=${id}`, { signal }).then(data => OwnerCard.parse(data)),
  });
}

/* --------- Collection hooks (for portfolio pages) --------- */
export function useAllProperties() {
  return useQuery({
    queryKey: ["portfolio","properties"],
    queryFn: ({ signal }) => fetchJSON("/api/portfolio/properties", { signal }),
  });
}
export function useAllUnits() {
  return useQuery({
    queryKey: ["portfolio","units"],
    queryFn: ({ signal }) => fetchJSON("/api/portfolio/units", { signal })
  });
}
export function useAllLeases() {
  return useQuery({
    queryKey: ["portfolio","leases"],
    queryFn: ({ signal }) => fetchJSON("/api/portfolio/leases", { signal })
  });
}
export function useAllTenants() {
  return useQuery({
    queryKey: ["portfolio","tenants"],
    queryFn: ({ signal }) => fetchJSON("/api/portfolio/tenants", { signal })
  });
}
export function useAllOwners() {
  return useQuery({
    queryKey: ["portfolio","owners"],
    queryFn: ({ signal }) => fetchJSON("/api/portfolio/owners", { signal })
  });
}