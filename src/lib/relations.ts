import { jget } from "./http";
import { fetchEntity } from "./api";

export async function fetchProperty(id:number){
  try {
    const one = await fetchEntity("properties", String(id));
    return one?.item || one?.data || one;
  } catch (error) {
    return null;
  }
}
export async function fetchUnitsByProperty(id:number){
  const list = await jget<any>(`/api/portfolio/units?property_id=${id}`) || {};
  return list.items || list.data || [];
}
export async function fetchLeasesByProperty(id:number){
  const list = await jget<any>(`/api/portfolio/leases?property_id=${id}`) || {};
  return list.items || list.data || [];
}
export async function fetchOwner(ownerId:number){
  try {
    const one = await fetchEntity("owners", String(ownerId));
    return one?.item || one?.data || one;
  } catch (error) {
    return null;
  }
}
export async function fetchUnit(id:number){
  try {
    const one = await fetchEntity("units", String(id));
    return one?.item || one?.data || one;
  } catch (error) {
    return null;
  }
}
export async function fetchLease(id:number){
  try {
    const one = await fetchEntity("leases", String(id));
    return one?.item || one?.data || one;
  } catch (error) {
    return null;
  }
}
export async function fetchTenantsByLease(leaseId:number){
  const list = await jget<any>(`/api/portfolio/tenants?lease_id=${leaseId}`) || {};
  return list.items || list.data || [];
}
export async function fetchLeasesByTenant(id:number){
  const list = await jget<any>(`/api/portfolio/leases?tenant_id=${id}`) || {};
  return list.items || list.data || [];
}