// Genesis Grade Dashboard Data Hook - Live API Integration ONLY

import { useState, useEffect } from 'react';
import { fetchJSON, isAbortError } from '../../../utils/net';

// Type definitions for live data
export interface DashboardKPIs {
  occupancyPct: number;
  rentReadyVacant: {
    ready: number;
    vacant: number;
  };
  collectionsRatePct: number;
  openCriticalWO: number;
}

export interface MapProperty {
  id: string;
  lat: number;
  lng: number;
  address: string;
  city: string;
  status: 'occupied' | 'vacant' | 'delinquent' | 'rent-ready';
  currentTenant?: string;
  rentReady?: boolean;
}

export interface ActionFeedItem {
  id: string;
  type: 'delinquent' | 'lease-expiring' | 'maintenance';
  priority: 'critical' | 'high' | 'medium';
  title: string;
  subtitle: string;
  meta: string;
  actions: Array<{
    label: string;
    href: string;
    variant: 'primary' | 'secondary' | 'danger';
  }>;
}

export interface CashFlowData {
  periodLabel: string;
  income: number;
  expenses: number;
  noi: number;
}

export interface LeasingFunnelData {
  leads: number;
  tours: number;
  applications: number;
  approved: number;
  signed: number;
}

export interface DashboardData {
  kpis: DashboardKPIs;
  propertiesForMap: MapProperty[];
  actionFeed: ActionFeedItem[];
  cashflow90: CashFlowData[];
  leasingFunnel30: LeasingFunnelData;
}

export interface KpiData {
  occupancy: number;
  rentReady: { ready: number; vacant: number };
  collections: number;
  criticalWOs: number;
}

export interface MapDataProperty {
  id: string;
  lat: number;
  lng: number;
  status: 'occupied-current' | 'vacant-ready' | 'vacant-down' | 'delinquent';
  address?: string;
}

export interface FeedItem {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
}

export interface FeedData {
  delinquencyAlerts: FeedItem[];
  leaseRenewals: FeedItem[];
  maintenanceHotlist: FeedItem[];
}

// Helper functions for data processing
function safeNum(value: any): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch data from all live endpoints in parallel
        const [properties, units, leases, tenants, workorders, transactions] = await Promise.all([
          fetchJSON<any[]>('/api/portfolio/properties', controller.signal),
          fetchJSON<any[]>('/api/portfolio/units', controller.signal),
          fetchJSON<any[]>('/api/portfolio/leases', controller.signal),
          fetchJSON<any[]>('/api/portfolio/tenants', controller.signal),
          fetchJSON<any[]>('/api/maintenance/workorders', controller.signal).catch(() => []),
          fetchJSON<any[]>('/api/accounting/transactions', controller.signal).catch(() => [])
        ]);
        
        console.log('Live Dashboard Data Fetched:', { 
          properties: properties.length, 
          units: units.length, 
          leases: leases.length, 
          tenants: tenants.length,
          workorders: workorders.length,
          transactions: transactions.length
        });

        // Ensure we have arrays
        const propertiesArray = Array.isArray(properties) ? properties : [];
        const unitsArray = Array.isArray(units) ? units : [];
        const leasesArray = Array.isArray(leases) ? leases : [];
        const tenantsArray = Array.isArray(tenants) ? tenants : [];
        const workordersArray = Array.isArray(workorders) ? workorders : [];
        const transactionsArray = Array.isArray(transactions) ? transactions : [];

        // Calculate occupancy from live data ONLY
        const totalUnits = unitsArray.length;
        const occupiedUnits = unitsArray.filter(u => {
          const status = (u.status ?? u.vacancy_status ?? '').toString().toLowerCase();
          return status === 'occupied' || status.includes('occupied') || status === 'rented';
        }).length;
        const occupancyPct = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;
        
        // Calculate vacant/rent ready from live data ONLY
        const vacantUnits = unitsArray.filter(u => {
          const status = (u.status ?? u.vacancy_status ?? '').toString().toLowerCase();
          return status.includes('vacant') || status.includes('available') || status === 'empty';
        });
        
        const rentReadyUnits = vacantUnits.filter(u => {
          const hasRent = safeNum(u.marketRent ?? u.market_rent ?? u.rent) > 0;
          const condition = (u.condition ?? u.unit_condition ?? '').toString().toLowerCase();
          return hasRent && (!condition || condition === 'good' || condition === 'excellent' || condition === 'ready');
        });

        // Calculate collections from live transactions ONLY
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const mtdTransactions = transactionsArray.filter((t: any) => {
          const date = new Date(t.date || t.posted_at || t.created_at);
          return date >= monthStart && date <= now && !isNaN(date.getTime());
        });
        
        const charges = mtdTransactions
          .filter((t: any) => {
            const type = (t.type || t.kind || t.transaction_type || '').toString().toLowerCase();
            return type.includes('charge') || type.includes('rent') || type.includes('fee');
          })
          .reduce((sum: number, t: any) => sum + safeNum(t.amount_cents ?? t.amount), 0);
          
        const payments = mtdTransactions
          .filter((t: any) => {
            const type = (t.type || t.kind || t.transaction_type || '').toString().toLowerCase();
            return type.includes('payment') || type.includes('receipt');
          })
          .reduce((sum: number, t: any) => sum + safeNum(t.amount_cents ?? t.amount), 0);
          
        const collectionsRatePct = charges > 0 ? (payments / charges) * 100 : 0;

        // Count critical work orders from live data ONLY
        const criticalWOCount = workordersArray.filter((wo: any) => {
          const priority = (wo.priority ?? wo.priority_level ?? '').toString().toLowerCase();
          return priority === 'critical' || priority === 'high' || priority === 'urgent';
        }).length;

        // Create map properties from live data ONLY - only include properties with real coordinates
        const propertiesForMap: MapProperty[] = propertiesArray
          .filter(property => {
            const lat = safeNum(property.latitude ?? property.lat);
            const lng = safeNum(property.longitude ?? property.lng);
            return lat !== 0 && lng !== 0; // Only include properties with real coordinates
          })
          .map(property => {
            // Determine actual status from live data
            const propertyUnits = unitsArray.filter(u => 
              u.property_id === property.id || u.propertyId === property.id
            );
            
            let status: MapProperty['status'] = 'vacant';
            
            if (propertyUnits.length > 0) {
              const occupiedUnits = propertyUnits.filter(u => {
                const unitStatus = (u.status ?? u.vacancy_status ?? '').toString().toLowerCase();
                return unitStatus === 'occupied' || unitStatus.includes('occupied') || unitStatus === 'rented';
              });
              
              if (occupiedUnits.length > 0) {
                // Check for delinquent tenants
                const propertyTenants = tenantsArray.filter(t => {
                  return propertyUnits.some(u => u.id === (t.unit_id ?? t.unitId));
                });
                
                const hasDelinquent = propertyTenants.some(t => {
                  const balance = safeNum(t.balance ?? t.current_balance ?? t.outstanding_balance ?? 0);
                  return balance > 0;
                });
                
                status = hasDelinquent ? 'delinquent' : 'occupied';
              } else {
                // Check if vacant units are rent-ready
                const rentReadyUnits = propertyUnits.filter(u => {
                  const hasRent = safeNum(u.marketRent ?? u.market_rent ?? u.rent) > 0;
                  const condition = (u.condition ?? u.unit_condition ?? '').toString().toLowerCase();
                  return hasRent && (!condition || condition === 'good' || condition === 'excellent' || condition === 'ready');
                });
                
                status = rentReadyUnits.length > 0 ? 'rent-ready' : 'vacant';
              }
            }
            
            return {
              id: property.id,
              lat: safeNum(property.latitude ?? property.lat),
              lng: safeNum(property.longitude ?? property.lng),
              address: property.address || property.street_address || property.full_address || `Property ${property.id}`,
              city: property.city || '',
              status,
              currentTenant: status === 'occupied' ? 'Occupied' : undefined,
              rentReady: status === 'rent-ready'
            };
          });

        // Create action feed from live data ONLY
        const actionFeed: ActionFeedItem[] = [];
        
        // Delinquent tenants from live data
        tenantsArray.forEach(tenant => {
          const balance = safeNum(tenant.balance ?? tenant.current_balance ?? tenant.outstanding_balance ?? 0);
          if (balance > 0) {
            const unit = unitsArray.find(u => u.id === (tenant.unit_id ?? tenant.unitId));
            const property = propertiesArray.find(p => p.id === (unit?.property_id ?? unit?.propertyId));
            
            actionFeed.push({
              id: `delinquent-${tenant.id}`,
              type: 'delinquent',
              priority: balance > 2000 ? 'critical' : 'high',
              title: `${tenant.name ?? tenant.full_name ?? 'Tenant'} - $${balance.toFixed(0)} Past Due`,
              subtitle: property?.address ?? property?.street_address ?? 'Property',
              meta: `$${balance.toFixed(0)} outstanding`,
              actions: [
                { label: 'Send Notice', href: `/tenants/${tenant.id}`, variant: 'primary' },
                { label: 'View Account', href: `/tenants/${tenant.id}/account`, variant: 'secondary' }
              ]
            });
          }
        });
        
        // Expiring leases from live data
        const futureDate = new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000);
        leasesArray.forEach(lease => {
          const endDate = new Date(lease.end_date ?? lease.endDate ?? lease.lease_end ?? lease.expiration_date);
          if (!isNaN(endDate.getTime()) && endDate >= now && endDate <= futureDate) {
            const unit = unitsArray.find(u => u.id === (lease.unit_id ?? lease.unitId));
            const property = propertiesArray.find(p => p.id === (unit?.property_id ?? unit?.propertyId));
            const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
            
            actionFeed.push({
              id: `lease-expiring-${lease.id}`,
              type: 'lease-expiring',
              priority: daysUntilExpiry <= 30 ? 'high' : 'medium',
              title: `Lease Expiring - ${unit?.name ?? unit?.unit_number ?? 'Unit'}`,
              subtitle: property?.address ?? property?.street_address ?? 'Property',
              meta: `Expires ${endDate.toLocaleDateString()}`,
              actions: [
                { label: 'Renew', href: `/leases/${lease.id}`, variant: 'primary' },
                { label: 'Market Unit', href: `/units/${unit?.id}`, variant: 'secondary' }
              ]
            });
          }
        });
        
        // Critical work orders from live data
        workordersArray
          .filter(wo => {
            const priority = (wo.priority ?? wo.priority_level ?? '').toString().toLowerCase();
            return priority === 'critical' || priority === 'high' || priority === 'urgent';
          })
          .forEach(wo => {
            const unit = unitsArray.find(u => u.id === (wo.unit_id ?? wo.unitId));
            const property = propertiesArray.find(p => 
              p.id === (unit?.property_id ?? unit?.propertyId ?? wo.property_id ?? wo.propertyId)
            );
            
            actionFeed.push({
              id: `maintenance-${wo.id}`,
              type: 'maintenance',
              priority: (wo.priority ?? wo.priority_level ?? '').toString().toLowerCase() === 'critical' ? 'critical' : 'high',
              title: wo.title ?? wo.description ?? wo.issue ?? 'Maintenance Required',
              subtitle: `${property?.address ?? 'Property'} - ${unit?.name ?? unit?.unit_number ?? 'Unit'}`,
              meta: `${(wo.priority ?? wo.priority_level ?? 'High').toUpperCase()}`,
              actions: [
                { label: 'Assign', href: `/workorders/${wo.id}`, variant: 'primary' },
                { label: 'Details', href: `/workorders/${wo.id}/details`, variant: 'secondary' }
              ]
            });
          });

        // Create cash flow data from live transactions ONLY
        const cashflow90: CashFlowData[] = [];
        for (let i = 12; i >= 0; i--) { // Last 13 weeks
          const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
          const weekStart = new Date(weekEnd.getTime() - 7 * 24 * 60 * 60 * 1000);
          
          const weekTransactions = transactionsArray.filter((t: any) => {
            const date = new Date(t.date || t.posted_at || t.created_at);
            return !isNaN(date.getTime()) && date >= weekStart && date < weekEnd;
          });
          
          const income = weekTransactions
            .filter((t: any) => {
              const type = (t.type || t.kind || t.transaction_type || '').toString().toLowerCase();
              const amount = safeNum(t.amount_cents ?? t.amount);
              return (type.includes('payment') || type.includes('receipt')) && amount > 0;
            })
            .reduce((sum: number, t: any) => sum + safeNum(t.amount_cents ?? t.amount), 0) / 100;
            
          const expenses = weekTransactions
            .filter((t: any) => {
              const type = (t.type || t.kind || t.transaction_type || '').toString().toLowerCase();
              const amount = safeNum(t.amount_cents ?? t.amount);
              return (type.includes('expense') || type.includes('cost')) && amount > 0;
            })
            .reduce((sum: number, t: any) => sum + safeNum(t.amount_cents ?? t.amount), 0) / 100;
          
          cashflow90.push({
            periodLabel: `${weekStart.getMonth() + 1}/${weekStart.getDate()}`,
            income,
            expenses,
            noi: income - expenses
          });
        }

        // Create leasing funnel from live lease data ONLY
        const activeLeases = leasesArray.filter(l => {
          const status = (l.status ?? '').toString().toLowerCase();
          return status === 'active' || status === 'current' || status === 'signed';
        }).length;
        
        const pendingLeases = leasesArray.filter(l => {
          const status = (l.status ?? '').toString().toLowerCase();
          return status === 'pending' || status === 'draft' || status === 'unsigned';
        }).length;

        setData({
          kpis: {
            occupancyPct,
            rentReadyVacant: {
              ready: rentReadyUnits.length,
              vacant: vacantUnits.length
            },
            collectionsRatePct,
            openCriticalWO: criticalWOCount
          },
          propertiesForMap,
          actionFeed,
          cashflow90,
          leasingFunnel30: {
            leads: 0, // No lead data in current APIs
            tours: 0, // No tour data in current APIs
            applications: pendingLeases,
            approved: pendingLeases,
            signed: activeLeases
          }
        });
        
      } catch (err) {
        if (isAbortError(err)) return;
        setError(err as Error);
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    
    return () => controller.abort();
  }, []);

  // Extract kpiData for the KPI ticker (using live data ONLY)
  const kpiData: KpiData = data ? {
    occupancy: data.kpis.occupancyPct,
    rentReady: data.kpis.rentReadyVacant,
    collections: data.kpis.collectionsRatePct,
    criticalWOs: data.kpis.openCriticalWO
  } : { occupancy: 0, rentReady: { ready: 0, vacant: 0 }, collections: 0, criticalWOs: 0 };

  // Extract mapData for the map component (using live data ONLY)
  const mapData: MapDataProperty[] = data ? data.propertiesForMap.map(p => ({
    id: p.id,
    lat: p.lat,
    lng: p.lng,
    status: p.status === 'occupied' ? 'occupied-current' : 
            p.status === 'rent-ready' ? 'vacant-ready' : 
            p.status === 'delinquent' ? 'delinquent' : 'vacant-down',
    address: p.address
  })) : [];

  // Extract feedData for the action feed (using live data ONLY)
  const feedData: FeedData = {
    delinquencyAlerts: data ? data.actionFeed
      .filter(item => item.type === 'delinquent')
      .map(item => ({ id: item.id, title: item.title, subtitle: item.subtitle, meta: item.meta })) : [],
    leaseRenewals: data ? data.actionFeed
      .filter(item => item.type === 'lease-expiring')
      .map(item => ({ id: item.id, title: item.title, subtitle: item.subtitle, meta: item.meta })) : [],
    maintenanceHotlist: data ? data.actionFeed
      .filter(item => item.type === 'maintenance')
      .map(item => ({ id: item.id, title: item.title, subtitle: item.subtitle, meta: item.meta })) : []
  };

  return { data, loading, error, kpiData, isLoading: loading, mapData, feedData };
}