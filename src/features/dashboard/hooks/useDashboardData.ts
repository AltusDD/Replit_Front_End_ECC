// Genesis Grade Dashboard Data Hook - Live API Integration ONLY

import { useEffect, useState } from 'react';
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

// Mock API fetch functions (replace with actual implementations)
// These are placeholders and should be replaced with actual API calls
const fetchLeases = async (): Promise<any[]> => { return []; };
const fetchUnits = async (): Promise<any[]> => { return []; };
const fetchProperties = async (): Promise<any[]> => { return []; };
const fetchWorkorders = async (): Promise<any[]> => { return []; };


export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Placeholder for rent ready calculation
  const calculateRentReady = (units: any[]): number => {
    return units.filter(u => {
      const hasRent = safeNum(u.marketRent ?? u.market_rent ?? u.rent) > 0;
      const condition = (u.condition ?? u.unit_condition ?? '').toString().toLowerCase();
      return hasRent && (!condition || condition === 'good' || condition === 'excellent' || condition === 'ready');
    }).length;
  };


  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch data from all live endpoints in parallel
        const [properties, units, leases, workorders] = await Promise.all([
          fetchJSON<any[]>('/api/portfolio/properties', controller.signal),
          fetchJSON<any[]>('/api/portfolio/units', controller.signal),
          fetchJSON<any[]>('/api/portfolio/leases', controller.signal),
          fetchJSON<any[]>('/api/maintenance/workorders', controller.signal).catch(() => []),
        ]);

        console.log('✅ Raw API Data Received:', {
          properties: properties.slice(0, 2), // Show first 2 for debugging
          units: units.slice(0, 2),
          leases: leases.slice(0, 2),
          workorders
        });

        // Ensure we have arrays
        const propertiesArray = Array.isArray(properties) ? properties : [];
        const unitsArray = Array.isArray(units) ? units : [];
        const leasesArray = Array.isArray(leases) ? leases : [];
        const workordersArray = Array.isArray(workorders) ? workorders : [];

        // Calculate occupancy from ACTIVE LEASES (unit.status is null, use lease data instead)
        const totalUnits = unitsArray.length;
        const now = new Date();
        
        // Find occupied units by matching active leases within date range
        const occupiedUnits = unitsArray.filter(unit => {
          return leasesArray.some(lease => {
            const isActive = (lease.status ?? '').toString().toLowerCase() === 'active';
            const startDate = new Date(lease.start ?? lease.start_date ?? '1900-01-01');
            const endDate = new Date(lease.end ?? lease.end_date ?? '2099-12-31');
            const isInDateRange = now >= startDate && now <= endDate;
            
            // Match lease to unit by various possible field combinations
            const unitId = unit.id;
            const leaseUnitId = lease.unit_id ?? lease.unitId;
            const unitLabel = unit.unitLabel ?? unit.unit_name ?? unit.name ?? '';
            const leaseUnitLabel = lease.unitLabel ?? lease.unit_name ?? '';
            
            return isActive && isInDateRange && (
              unitId === leaseUnitId || 
              (unitLabel && leaseUnitLabel && unitLabel === leaseUnitLabel)
            );
          });
        }).length;
        
        const occupancyPct = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

        // Calculate vacant/rent ready from NON-LEASED units (inverse of occupancy logic)
        const vacantUnits = unitsArray.filter(unit => {
          const hasActiveLease = leasesArray.some(lease => {
            const isActive = (lease.status ?? '').toString().toLowerCase() === 'active';
            const startDate = new Date(lease.start ?? lease.start_date ?? '1900-01-01');
            const endDate = new Date(lease.end ?? lease.end_date ?? '2099-12-31');
            const isInDateRange = now >= startDate && now <= endDate;
            
            const unitId = unit.id;
            const leaseUnitId = lease.unit_id ?? lease.unitId;
            const unitLabel = unit.unitLabel ?? unit.unit_name ?? unit.name ?? '';
            const leaseUnitLabel = lease.unitLabel ?? lease.unit_name ?? '';
            
            return isActive && isInDateRange && (
              unitId === leaseUnitId || 
              (unitLabel && leaseUnitLabel && unitLabel === leaseUnitLabel)
            );
          });
          
          return !hasActiveLease; // Vacant = no active lease
        });
        
        const rentReadyUnits = vacantUnits.filter(u => {
          const hasRent = safeNum(u.marketRent ?? u.market_rent ?? u.rent) > 0;
          return hasRent; // Rent ready = vacant + has market rent set
        });


        // Create map properties from live data ONLY - only include properties with real coordinates
        const propertiesForMap: MapProperty[] = propertiesArray
          .filter(property => {
            const lat = safeNum(property.latitude ?? property.lat);
            const lng = safeNum(property.longitude ?? property.lng);
            const hasCoordinates = lat !== 0 && lng !== 0;
            
            // Log warning for properties missing coordinates
            if (!hasCoordinates) {
              console.warn(`Property "${property.name ?? property.id}" is missing coordinates and will not be displayed on the map.`);
            }
            
            return hasCoordinates; // Only include properties with real coordinates
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
                const propertyTenants = []; // Tenants data not fetched in this snippet, assuming it's handled elsewhere or omitted for simplicity
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

        // Maintenance Hotlist (using workorders)
        workordersArray
          .forEach(wo => {
            const property = propertiesArray.find(p =>
              p.id === (wo.property_id ?? wo.propertyId)
            );
            const unit = unitsArray.find(u => u.id === (wo.unit_id ?? wo.unitId));
            const propertyAddress = property?.address ?? property?.street_address ?? property?.full_address ?? 'Unknown Property';
            const unitName = unit?.name ?? unit?.unit_number ?? unit?.unit_name ?? 'Unit';

            actionFeed.push({
              id: `maintenance-${wo.id}`,
              type: 'maintenance',
              priority: (wo.priority ?? wo.priority_level ?? '').toString().toLowerCase() === 'critical' ? 'critical' : 'high',
              title: wo.title ?? wo.description ?? wo.issue ?? wo.summary ?? 'Maintenance Required',
              subtitle: `${propertyAddress} - ${unitName}`,
              meta: `${(wo.priority ?? wo.priority_level ?? 'High').toUpperCase()} - ${wo.status ?? 'Open'}`,
              actions: [
                { label: 'Assign', href: `/workorders/${wo.id}`, variant: 'primary' },
                { label: 'Details', href: `/workorders/${wo.id}/details`, variant: 'secondary' }
              ]
            });
          });

        setData({
          kpis: {
            occupancyPct,
            rentReadyVacant: {
              ready: rentReadyUnitsCount,
              vacant: vacantUnits.length
            },
            collectionsRatePct: 0, // Placeholder as transaction data is not fetched here
            openCriticalWO: workordersArray.filter(wo =>
              (wo.priority ?? wo.priority_level ?? '').toString().toLowerCase() === 'critical'
            ).length
          },
          propertiesForMap,
          actionFeed,
          cashflow90: [], // Placeholder as transaction data is not fetched here
          leasingFunnel30: {
            leads: 0,
            tours: 0,
            applications: 0, // Placeholder as lease data is not fully processed for applications
            approved: 0, // Placeholder
            signed: leasesArray.filter(lease => lease.status === 'active').length // Simplified count
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

  // Extract kpiData for the KPI ticker
  const kpiDataTransformed: KpiData = data ? {
    occupancy: data.kpis.occupancyPct,
    rentReady: data.kpis.rentReadyVacant,
    collections: data.kpis.collectionsRatePct,
    criticalWOs: data.kpis.openCriticalWO
  } : { occupancy: 0, rentReady: { ready: 0, vacant: 0 }, collections: 0, criticalWOs: 0 };

  // Extract mapData for the map component
  const mapDataTransformed: MapDataProperty[] = data ? data.propertiesForMap.map(p => ({
    id: p.id,
    lat: p.lat,
    lng: p.lng,
    status: p.status === 'occupied' ? 'occupied-current' :
            p.status === 'rent-ready' ? 'vacant-ready' :
            p.status === 'delinquent' ? 'delinquent' : 'vacant-down',
    address: p.address
  })) : [];

  // Extract feedData for the action feed
  const feedDataTransformed: FeedData = {
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

  // Debug logging for transformed data
  console.log('➡️ Transformed Data for UI:', {
    kpiData: kpiDataTransformed,
    mapDataCount: mapDataTransformed.length,
    feedData: {
      delinquencies: feedDataTransformed.delinquencyAlerts.length,
      leaseRenewals: feedDataTransformed.leaseRenewals.length,
      maintenance: feedDataTransformed.maintenanceHotlist.length
    }
  });

  return { data, loading, error, kpiData: kpiDataTransformed, isLoading: loading, mapData: mapDataTransformed, feedData: feedDataTransformed };
}