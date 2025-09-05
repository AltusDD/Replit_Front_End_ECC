// useDashboardData.ts - Genesis specification data hook with mock support
import { useState, useEffect, useRef } from 'react';
import {
  type DashboardProperty,
  type DashboardTenant,
  type DashboardLease,
  type DashboardWorkOrder,
  MOCK_PROPERTIES,
  MOCK_TENANTS,
  MOCK_LEASES,
  MOCK_WORK_ORDERS,
  MOCK_SERIES,
  MOCK_FUNNEL,
  validateDashboardData,
} from '../api/mock-data';

export type TimeRange = '30d' | '90d' | '6m' | '12m';

export interface DashboardData {
  properties: DashboardProperty[];
  tenants: DashboardTenant[];
  leases: DashboardLease[];
  workOrders: DashboardWorkOrder[];
  kpis: {
    occupancyPct: number;
    avgTurnDays: number;
    collectionRatePct: number;
    highPriorityWorkOrders: number;
    noiMTD: number;
    trends: {
      occupancyPct: number;
      avgTurnDays: number;
      collectionRatePct: number;
      highPriorityWorkOrders: number;
      noiMTD: number;
    };
  };
  series: {
    months: Array<{ month: string; income: number; expenses: number; occupancyPct: number }>;
    quarters: Array<{ quarter: string; value: number; debt: number }>;
  };
  funnel: { applications: number; screenings: number; leases: number };
}

export interface UseDashboardDataResult {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

async function fetchDashboardData(signal?: AbortSignal): Promise<DashboardData> {
  // Genesis specification: Check for mock mode or live API mode
  const useLiveData = import.meta.env.VITE_USE_LIVE === '1';
  
  if (!useLiveData) {
    // Mock data with abortable simulated latency (300-600ms)
    const latency = 300 + Math.random() * 300;
    
    await new Promise((resolve, reject) => {
      const timer = setTimeout(resolve, latency);
      
      if (signal) {
        signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new Error('Request aborted'));
        });
      }
    });
    
    // Validate mock data
    const mockData = {
      properties: MOCK_PROPERTIES,
      tenants: MOCK_TENANTS,
      leases: MOCK_LEASES,
      workOrders: MOCK_WORK_ORDERS,
    };
    
    validateDashboardData(mockData);
    
    return generateDashboardData(mockData);
  }

  // Live API mode (adapter function signature ready for future)
  const baseUrl = '';
  const [propertiesRes, tenantsRes, leasesRes, unitsRes, ownersRes] = await Promise.all([
    fetch(`${baseUrl}/api/portfolio/properties`, { signal }),
    fetch(`${baseUrl}/api/portfolio/tenants`, { signal }),
    fetch(`${baseUrl}/api/portfolio/leases`, { signal }),
    fetch(`${baseUrl}/api/portfolio/units`, { signal }),
    fetch(`${baseUrl}/api/portfolio/owners`, { signal }),
  ]);

  if (!propertiesRes.ok || !tenantsRes.ok || !leasesRes.ok || !unitsRes.ok || !ownersRes.ok) {
    throw new Error('Failed to fetch portfolio data');
  }

  const [propertiesData, tenantsData, leasesData, unitsData, ownersData] = await Promise.all([
    propertiesRes.json(),
    tenantsRes.json(), 
    leasesRes.json(),
    unitsRes.json(),
    ownersRes.json(),
  ]);

  // Ensure all data is arrays
  const safePropertiesData = Array.isArray(propertiesData) ? propertiesData : [];
  const safeTenantsData = Array.isArray(tenantsData) ? tenantsData : [];
  const safeLeasesData = Array.isArray(leasesData) ? leasesData : [];
  const safeUnitsData = Array.isArray(unitsData) ? unitsData : [];
  const safeOwnersData = Array.isArray(ownersData) ? ownersData : [];

  // Transform real API data to dashboard format
  const properties: DashboardProperty[] = safePropertiesData.map((p: any) => ({
    id: String(p.id),
    address1: p.address || p.name || 'Unknown Address',
    city: p.city || 'Unknown City',
    state: p.state || 'Unknown State', 
    zip: p.zip || '00000',
    lat: p.latitude || p.lat,
    lng: p.longitude || p.lng,
    status: p.occupancyStatus === 'occupied' ? 'occupied' : 
            p.occupancyStatus === 'vacant' ? 'vacant' : 
            p.delinquent === true ? 'delinquent' : 'occupied',
    marketRent: parseFloat(p.marketRent || p.rent || '0'),
    currentRent: parseFloat(p.currentRent || p.rent || '0'),
    units: parseInt(p.units || p.unitCount || '1'),
  }));

  const tenants: DashboardTenant[] = safeTenantsData.map((t: any) => ({
    id: String(t.id),
    name: t.name || 'Unknown Tenant',
    propertyName: t.propertyName,
    unitLabel: t.unitLabel,
    type: t.type || 'tenant',
    balance: parseFloat(t.balance || '0'),
    isDelinquent: t.type === 'PROSPECT_TENANT' ? false : parseFloat(t.balance || '0') > 0,
  }));

  const leases: DashboardLease[] = safeLeasesData.map((l: any) => ({
    id: String(l.id),
    tenantId: String(l.tenantId || ''),
    propertyId: String(l.propertyId || ''),
    unitLabel: l.unitLabel,
    startDate: l.startDate,
    endDate: l.endDate,
    status: l.status === 'ended' ? 'ended' : 'active',
    monthlyRent: parseFloat(l.monthlyRent || l.rent || '0'),
  }));

  const units: DashboardUnit[] = safeUnitsData.map((u: any) => ({
    id: String(u.id),
    propertyId: String(u.propertyId || ''),
    propertyName: u.propertyName,
    unitNumber: u.unitNumber || 'Unit',
    marketRent: parseFloat(u.marketRent || u.rent || '0'),
    currentRent: parseFloat(u.currentRent || u.rent || '0'),
    status: u.occupancyStatus === 'occupied' ? 'occupied' :
            u.occupancyStatus === 'vacant' ? 'vacant' : 'occupied',
  }));

  const owners: DashboardOwner[] = safeOwnersData.map((o: any) => ({
    id: String(o.id),
    company: o.company || 'Unknown Company',
    name: o.name || o.company || 'Unknown Owner',
    email: o.email,
    phone: o.phone,
    active: Boolean(o.active),
  }));

  // Calculate real KPIs from actual data
  const totalUnits = units.length;
  const occupiedUnits = units.filter(u => u.status === 'occupied').length;
  const occupancyPct = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

  const delinquentTenants = tenants.filter(t => t.isDelinquent);
  const collectionRatePct = tenants.length > 0 ? 
    ((tenants.length - delinquentTenants.length) / tenants.length) * 100 : 100;

  // Generate time series based on actual rent data
  const totalMonthlyIncome = units.reduce((sum, u) => sum + (u.currentRent || 0), 0) * 100; // to cents
  const estimatedExpenses = totalMonthlyIncome * 0.65; // 65% expense ratio

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    const variance = 0.9 + Math.random() * 0.2; // ±10% variance
    
    return {
      label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      income: Math.round(totalMonthlyIncome * variance),
      expenses: Math.round(estimatedExpenses * variance),
      occupancyPct: Math.round(occupancyPct * (0.95 + Math.random() * 0.1)), // ±5% variance
    };
  });

  const quarters = Array.from({ length: 4 }, (_, i) => {
    const totalValue = properties.reduce((sum, p) => sum + (p.marketRent * 200), 0) * 100; // Rough 200x multiple, to cents
    const totalDebt = totalValue * 0.6; // 60% LTV
    
    return {
      label: `Q${i + 1} 2024`,
      value: Math.round(totalValue * (1 + i * 0.02)), // 2% quarterly appreciation
      debt: Math.round(totalDebt * (0.98 - i * 0.01)), // Debt paydown
    };
  });

  return adaptFromLive({ properties, tenants, leases, units, owners });
}

// Adapter function for future live API integration
function adaptFromLive(liveData: any): DashboardData {
  const { properties, tenants, leases, units, owners } = liveData;
  
  // Calculate KPIs from live data
  const totalUnits = units?.length || 0;
  const occupiedUnits = units?.filter((u: any) => u.status === 'occupied')?.length || 0;
  const occupancyPct = totalUnits > 0 ? (occupiedUnits / totalUnits) : 0;
  
  const delinquentTenants = tenants?.filter((t: any) => t.isDelinquent) || [];
  const collectionRatePct = tenants?.length > 0 ? 
    ((tenants.length - delinquentTenants.length) / tenants.length) : 1;
  
  const totalMonthlyIncome = units?.reduce((sum: number, u: any) => sum + (u.currentRent || 0), 0) || 0;
  const estimatedExpenses = totalMonthlyIncome * 0.65;
  
  return generateDashboardData({
    properties: properties || [],
    tenants: tenants || [],
    leases: leases || [],
    workOrders: [], // No work orders API yet
    customKpis: {
      occupancyPct,
      collectionRatePct,
      noiMTD: totalMonthlyIncome - estimatedExpenses,
    }
  });
}

// Core data generation function
function generateDashboardData(input: {
  properties: DashboardProperty[];
  tenants: DashboardTenant[];
  leases: DashboardLease[];
  workOrders: DashboardWorkOrder[];
  customKpis?: any;
}): DashboardData {
  const { properties, tenants, leases, workOrders, customKpis } = input;
  
  // Calculate DB-first KPIs
  const totalProperties = properties.length;
  const occupiedProperties = properties.filter(p => p.status === 'occupied').length;
  const occupancyPct = customKpis?.occupancyPct ?? (totalProperties > 0 ? occupiedProperties / totalProperties : 0);
  
  const delinquentTenants = tenants.filter(t => t.isDelinquent);
  const collectionRatePct = customKpis?.collectionRatePct ?? 
    (tenants.length > 0 ? (tenants.length - delinquentTenants.length) / tenants.length : 1);
  
  const highPriorityWO = workOrders.filter(w => w.priority === 'high').length;
  
  const totalMonthlyRent = properties.reduce((sum, p) => sum + p.currentRent, 0);
  const noiMTD = customKpis?.noiMTD ?? (totalMonthlyRent * 0.35); // 35% NOI margin
  
  // Trend deltas vs prior period (mock ±% changes)
  const trends = {
    occupancyPct: (Math.random() - 0.5) * 10, // ±5%
    avgTurnDays: (Math.random() - 0.5) * 8, // ±4 days
    collectionRatePct: (Math.random() - 0.5) * 6, // ±3%
    highPriorityWorkOrders: Math.round((Math.random() - 0.5) * 6), // ±3 orders
    noiMTD: (Math.random() - 0.5) * 20, // ±10%
  };
  
  return {
    properties,
    tenants,
    leases,
    workOrders,
    kpis: {
      occupancyPct,
      avgTurnDays: 12,
      collectionRatePct,
      highPriorityWorkOrders: highPriorityWO,
      noiMTD,
      trends,
    },
    series: MOCK_SERIES,
    funnel: MOCK_FUNNEL,
  };
}

export function useDashboardData(range: TimeRange = '12m'): UseDashboardDataResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Abort previous request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    fetchDashboardData(controller.signal)
      .then(dashboardData => {
        if (!controller.signal.aborted) {
          setData(dashboardData);
          setError(null);
        }
      })
      .catch(err => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
          setData(null);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    // Cleanup
    return () => {
      controller.abort();
    };
  }, [range]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, []);

  return { data, loading, error };
}