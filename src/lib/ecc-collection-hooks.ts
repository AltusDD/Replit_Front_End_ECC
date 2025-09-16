import { useQuery, useMutation } from '@tanstack/react-query';
import { Entities, Owners } from "./ecc-api";

/* --------- Collection hooks (for portfolio pages) --------- */
export function useAllProperties() {
  return useQuery({ 
    queryKey:["properties-all"], 
    queryFn:()=>Entities.properties({select:'*'})
  });
}
export function useAllUnits() {
  return useQuery({ 
    queryKey:["units-all"], 
    queryFn:()=>Entities.units({select:'*'})
  });
}
export function useAllLeases() {
  return useQuery({ 
    queryKey:["leases-all"], 
    queryFn:()=>Entities.leases({select:'*'})
  });
}
export function useAllTenants() {
  return useQuery({ 
    queryKey:["tenants-all"], 
    queryFn:()=>Entities.tenants({select:'*'})
  });
}
export function useAllOwners() {
  return useQuery({ 
    queryKey:["owners-all"], 
    queryFn:()=>Entities.owners({select:'*'})
  });
}

/* --------- DataHub hooks --------- */
export function useDataHubEntities(entity: "owners" | "tenants" | "leases" | "units" | "properties", params: { order?: string, limit?: number, select?: string }) {
  return useQuery({
    queryKey: ["datahub", entity, params],
    queryFn: () => {
      switch (entity) {
        case "owners":     return Entities.owners(params);
        case "tenants":    return Entities.tenants(params);
        case "leases":     return Entities.leases(params);
        case "units":      return Entities.units(params);
        case "properties": return Entities.properties(params);
      }
    }
  });
}

export function useDataHubOwnersSearch(searchQ: string) {
  return useQuery({
    queryKey: ["datahub", "owners-search", searchQ],
    queryFn: () => Owners.search(searchQ),
    enabled: !!searchQ
  });
}

export function useDataHubOwnerTransferContext(sourceOwnerId: string) {
  return useQuery({
    queryKey: ["datahub", "owner-transfer-context", sourceOwnerId],
    queryFn: () => Owners.transferContext(sourceOwnerId),
    enabled: !!sourceOwnerId
  });
}

export function useDataHubOwnerTransferMutations() {
  const initiateMutation = useMutation({
    mutationFn: () => Owners.initiateTransfer(),
  });

  const approveMutation = useMutation({
    mutationFn: (transferId: string) => Owners.approve(transferId),
  });

  const authorizeMutation = useMutation({
    mutationFn: (transferId: string) => Owners.authorize(transferId),
  });

  const executeMutation = useMutation({
    mutationFn: (transferId: string) => Owners.execute(transferId),
  });

  return {
    initiate: initiateMutation,
    approve: approveMutation,
    authorize: authorizeMutation,
    execute: executeMutation,
  };
}