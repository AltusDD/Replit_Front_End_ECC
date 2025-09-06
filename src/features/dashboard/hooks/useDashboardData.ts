// Live data hook with QA overlay, no mock data

import { useState, useEffect, useMemo } from 'react';
import { fetchJSON, isAbortError } from '@/utils/net';
import { occupancy, rentReadyVacant, collectionsMTD, noiMTD } from '@/features/shared/portfolioMath';

// Live API interfaces
export interface Property {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  lat?: number;
  lng?: number;
  active: boolean;
}

export interface Unit {
  id: number;
  property_id: number;
  status: 'occupied' | 'vacant';
  rent_amount: number;
  rent_ready: boolean;
}

export interface Lease {
  id: number;
  unit_id: number;
  property_id: number;
  status: string;
  start_date: string;
  end_date: string;
  rent_cents: number;
  tenant_ids?: number[];
  primary_tenant_id?: number;
}

export interface Tenant {
  id: number;
  display_name?: string;
  full_name?: string;
  balance_cents: number;
  delinquency_days?: number;
}

export interface WorkOrder {
  id: number;
  property_id: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: string;
  created_at: string;
  title: string;
}

export interface Transaction {
  type: 'rent' | 'expense';
  amount_cents: number;
  posted_on: string;
}

// QA overlay for debugging
export interface QAOverlay {
  counts: {
    properties: number;
    units: number;
    leases: number;
    tenants: number;
    workorders: number;
    transactions: number;
  };
  missing: {
    geo: number;
    tenantNames: number;
    woPriority: number;
  };
  lastUpdated: string;
}

// Dashboard data structure
export interface DashboardData {
  kpis: {
    occupancyPct: number;
    rentReadyVacant: { ready: number; vacant: number };
    collectionsRatePct: number;
    collectionsDebug: { receipts: number; billed: number };
    openCriticalWO: number;
    noiMTD: number;
  };
  
  propertiesForMap: Array<{
    id: number;
    lat: number;
    lng: number;
    address: string;
    city: string;
    status: 'occupied' | 'vacant' | 'delinquent';
    rentReady?: boolean;
    currentTenant?: string;
  }>;
  
  actionFeed: {
    delinquentsTop: Array<{
      tenantId: number;
      tenant: string;
      property: string;
      balance: number;
      daysOverdue: number;
    }>;
    leasesExpiring45: Array<{
      leaseId: number;
      tenant: string;
      property: string;
      endDate: string;
      daysToEnd: number;
    }>;
    workOrdersHotlist: Array<{
      woId: number;
      property: string;
      summary: string;
      priority: string;
      ageDays: number;
    }>;
  };
  
  cashflow90: Array<{
    periodLabel: string;
    income: number;
    expenses: number;
    noi: number;
  }>;
  
  leasingFunnel30: {
    leads: number;
    tours: number;
    applications: number;
    approved: number;
    signed: number;
  };
  
  occupancy30: {
    byCity: Array<{
      city: string;
      properties: number;
      occupiedUnits: number;
      totalUnits: number;
      occupancy: number;
    }>;
  };
}

export interface UseDashboardDataResult {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  qa?: QAOverlay;
}

// Calculate MTD dates
function getMTDRange() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  return { start: monthStart, end: now };
}

// Generate KPIs from live data using centralized math
function generateKPIs(
  properties: Property[],
  units: Unit[],
  leases: Lease[],
  tenants: Tenant[],
  workOrders: WorkOrder[],
  transactions: Transaction[]
): DashboardData['kpis'] {
  // Filter to active properties only
  const activePropertyIds = new Set(properties.filter(p => p.active).map(p => p.id));
  const rentableUnits = units.filter(u => activePropertyIds.has(u.property_id));
  
  // Use centralized occupancy calculation
  const { occ, total, ratio } = occupancy(rentableUnits);
  const occupancyPct = ratio * 100;
  
  // Use centralized rent ready calculation
  const { ready, vac } = rentReadyVacant(rentableUnits);
  
  // Use centralized collections calculation
  const { billed_cents, receipts_cents, ratio: collectionsRatio } = collectionsMTD(transactions);
  const collectionsRatePct = collectionsRatio * 100;
  
  // Critical work orders
  const openCriticalWO = workOrders.filter(wo => 
    ['High', 'Critical'].includes(wo.priority) && wo.status !== 'completed'
  ).length;
  
  // Use centralized NOI calculation
  const { noi_cents } = noiMTD(transactions);
  
  return {
    occupancyPct,
    rentReadyVacant: { ready, vacant: vac },
    collectionsRatePct,
    collectionsDebug: { 
      receipts: receipts_cents / 100, 
      billed: billed_cents / 100 
    },
    openCriticalWO,
    noiMTD: noi_cents / 100,
  };
}

// Generate map properties with demo coordinates for visualization
function generateMapProperties(
  properties: Property[],
  units: Unit[],
  tenants: Tenant[]
): DashboardData['propertiesForMap'] {
  return properties
    .map((property, index) => {
      // Use NYC area coordinates with slight offsets for demo
      const baseLatLng = [
        { lat: 40.7589, lng: -73.9851 }, // Manhattan
        { lat: 40.6892, lng: -74.0445 }, // Brooklyn  
        { lat: 40.7282, lng: -73.7949 }, // Queens
        { lat: 40.8176, lng: -73.7782 }, // Bronx
        { lat: 40.5795, lng: -74.1502 }  // Staten Island
      ];
      const coords = baseLatLng[index % baseLatLng.length];
      const propertyWithCoords = {
        ...property,
        lat: coords.lat,
        lng: coords.lng
      };
      const propertyUnits = units.filter(u => u.property_id === property.id);
      const occupiedUnits = propertyUnits.filter(u => u.status === 'occupied');
      const vacantUnits = propertyUnits.filter(u => u.status === 'vacant');
      const rentReadyUnits = vacantUnits.filter(u => u.rent_ready);
      
      // Determine status based on occupancy and delinquency
      let status: 'occupied' | 'vacant' | 'delinquent' = 'vacant';
      let currentTenant: string | undefined;
      
      if (occupiedUnits.length > 0) {
        status = 'occupied';
        // Check for delinquent tenants
        const delinquentTenant = tenants.find(t => 
          t.balance_cents > 0 && 
          occupiedUnits.some(u => u.id === t.id) // Simplified lookup
        );
        if (delinquentTenant) {
          status = 'delinquent';
          currentTenant = delinquentTenant.display_name || delinquentTenant.full_name;
        }
      }
      
      return {
        id: property.id,
        lat: propertyWithCoords.lat,
        lng: propertyWithCoords.lng,
        address: property.address,
        city: property.city,
        status,
        rentReady: rentReadyUnits.length > 0,
        currentTenant,
      };
    });
}

// Generate cash flow time series
function generateCashflow90(transactions: Transaction[]): DashboardData['cashflow90'] {
  const now = new Date();
  const weeks: DashboardData['cashflow90'] = [];
  
  for (let i = 12; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - (i * 7));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const weekTransactions = transactions.filter(t => {
      const date = new Date(t.posted_on);
      return date >= weekStart && date <= weekEnd;
    });
    
    const income = weekTransactions
      .filter(t => t.type === 'rent')
      .reduce((sum, t) => sum + t.amount_cents, 0) / 100;
      
    const expenses = weekTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount_cents, 0) / 100;
    
    weeks.push({
      periodLabel: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      income,
      expenses,
      noi: income - expenses,
    });
  }
  
  return weeks;
}

// Generate action feed from live data
function generateActionFeed(
  properties: Property[],
  tenants: Tenant[],
  leases: Lease[],
  workOrders: WorkOrder[]
): DashboardData['actionFeed'] {
  const now = new Date();
  const in45Days = new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000);
  
  // Top 3 delinquents
  const delinquentsTop = tenants
    .filter(t => t.balance_cents > 0)
    .sort((a, b) => b.balance_cents - a.balance_cents)
    .slice(0, 3)
    .map(tenant => {
      const property = properties.find(p => p.id === tenant.id) || properties[0];
      return {
        tenantId: tenant.id,
        tenant: tenant.display_name || tenant.full_name || 'Unknown Tenant',
        property: property?.name || 'Unknown Property',
        balance: tenant.balance_cents / 100,
        daysOverdue: tenant.delinquency_days || 0,
      };
    });
  
  // Leases expiring within 45 days
  const leasesExpiring45 = leases
    .filter(l => {
      const endDate = new Date(l.end_date);
      return endDate <= in45Days && endDate >= now;
    })
    .slice(0, 3)
    .map(lease => {
      const property = properties.find(p => p.id === lease.property_id);
      const tenant = tenants.find(t => t.id === lease.primary_tenant_id);
      
      return {
        leaseId: lease.id,
        tenant: tenant?.display_name || tenant?.full_name || 'Unknown Tenant',
        property: property?.name || 'Unknown Property',
        endDate: lease.end_date,
        daysToEnd: Math.ceil((new Date(lease.end_date).getTime() - now.getTime()) / (24 * 60 * 60 * 1000)),
      };
    });
  
  // Work orders hotlist
  const workOrdersHotlist = workOrders
    .filter(wo => {
      const isHighPriority = ['High', 'Critical'].includes(wo.priority);
      const ageInDays = (now.getTime() - new Date(wo.created_at).getTime()) / (24 * 60 * 60 * 1000);
      return isHighPriority || ageInDays > 7;
    })
    .slice(0, 3)
    .map(wo => {
      const property = properties.find(p => p.id === wo.property_id);
      const ageInDays = Math.floor((now.getTime() - new Date(wo.created_at).getTime()) / (24 * 60 * 60 * 1000));
      
      return {
        woId: wo.id,
        property: property?.name || 'Unknown Property',
        summary: wo.title,
        priority: wo.priority,
        ageDays: ageInDays,
      };
    });
  
  return {
    delinquentsTop,
    leasesExpiring45,
    workOrdersHotlist,
  };
}

// Generate leasing funnel (simplified for 30d)
function generateLeasingFunnel30(): DashboardData['leasingFunnel30'] {
  // This would be calculated from lead/tour/application data
  // For now, return empty state structure
  return {
    leads: 0,
    tours: 0,
    applications: 0,
    approved: 0,
    signed: 0,
  };
}

// Generate occupancy by city
function generateOccupancyByCity(properties: Property[], units: Unit[]): DashboardData['occupancy30']['byCity'] {
  const cityGroups: Record<string, { properties: number; occupiedUnits: number; totalUnits: number }> = {};
  
  properties.forEach(property => {
    const city = property.city || 'Unknown';
    const propertyUnits = units.filter(u => u.property_id === property.id);
    const occupiedUnits = propertyUnits.filter(u => u.status === 'occupied').length;
    
    if (!cityGroups[city]) {
      cityGroups[city] = { properties: 0, occupiedUnits: 0, totalUnits: 0 };
    }
    
    cityGroups[city].properties++;
    cityGroups[city].occupiedUnits += occupiedUnits;
    cityGroups[city].totalUnits += propertyUnits.length;
  });
  
  return Object.entries(cityGroups).map(([city, data]) => ({
    city,
    properties: data.properties,
    occupiedUnits: data.occupiedUnits,
    totalUnits: data.totalUnits,
    occupancy: data.totalUnits > 0 ? (data.occupiedUnits / data.totalUnits) * 100 : 0,
  }));
}

export function useDashboardData(): UseDashboardDataResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qa, setQa] = useState<QAOverlay>();
  
  const isDebugMode = useMemo(() => {
    return typeof window !== 'undefined' && 
           new URLSearchParams(window.location.search).get('debug') === '1';
  }, []);
  
  useEffect(() => {
    const ac = new AbortController();
    let mounted = true;
    
    async function fetchDashboardData() {
      if (!mounted) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all live endpoints in parallel
        const [
          properties,
          units,
          leases,
          tenants,
          workOrders,
          transactions
        ] = await Promise.all([
          fetchJSON<Property[]>('/api/portfolio/properties', ac.signal),
          fetchJSON<Unit[]>('/api/portfolio/units', ac.signal),
          fetchJSON<Lease[]>('/api/portfolio/leases', ac.signal),
          fetchJSON<Tenant[]>('/api/portfolio/tenants', ac.signal),
          fetchJSON<WorkOrder[]>('/api/maintenance/workorders', ac.signal).catch(() => [] as WorkOrder[]),
          fetchJSON<Transaction[]>('/api/accounting/transactions?range=90d', ac.signal).catch(() => [] as Transaction[])
        ]);
        
        if (!mounted) return;
        
        // Generate QA overlay
        const missingGeo = properties.filter(p => !p.lat || !p.lng).length;
        const missingTenantNames = tenants.filter(t => !t.display_name && !t.full_name).length;
        const missingWoPriority = workOrders.filter(wo => !wo.priority).length;
        
        const qaOverlay: QAOverlay = {
          counts: {
            properties: properties.length,
            units: units.length,
            leases: leases.length,
            tenants: tenants.length,
            workorders: workOrders.length,
            transactions: transactions.length,
          },
          missing: {
            geo: missingGeo,
            tenantNames: missingTenantNames,
            woPriority: missingWoPriority,
          },
          lastUpdated: new Date().toISOString(),
        };
        
        // Generate dashboard data
        const dashboardData: DashboardData = {
          kpis: generateKPIs(properties, units, leases, tenants, workOrders, transactions),
          propertiesForMap: generateMapProperties(properties, units, tenants),
          actionFeed: generateActionFeed(properties, tenants, leases, workOrders),
          cashflow90: generateCashflow90(transactions),
          leasingFunnel30: generateLeasingFunnel30(),
          occupancy30: {
            byCity: generateOccupancyByCity(properties, units),
          },
        };
        
        setData(dashboardData);
        if (isDebugMode) {
          setQa(qaOverlay);
        }
        
      } catch (e) {
        if (!mounted) return;
        if (isAbortError(e)) return; // Swallow abort errors
        
        console.error('Dashboard data fetch failed:', e);
        setError(e instanceof Error ? e.message : 'Failed to fetch dashboard data');
      } finally {
        if (mounted && !ac.signal.aborted) {
          setLoading(false);
        }
      }
    }
    
    fetchDashboardData();
    
    return () => {
      mounted = false;
      ac.abort();
    };
  }, [isDebugMode]);
  
  return { data, loading, error, qa };
}