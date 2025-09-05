// src/features/dashboard/hooks/useDashboardData.ts
import { useState, useEffect, useRef } from 'react';
import {
  MOCK_PROPERTIES,
  MOCK_TENANTS, 
  MOCK_LEASES,
  MOCK_WORK_ORDERS,
  MOCK_TIME_SERIES,
  MOCK_LEASING_FUNNEL,
  MOCK_KPIS,
  PropertySchema,
  TenantSummarySchema,
  LeaseSchema,
  WorkOrderSchema,
  type Property,
  type TenantSummary,
  type Lease,
  type WorkOrder,
} from '../api/mock-data';

export type TimeRange = '30d' | '90d' | '6m' | '12m';

export interface DashboardData {
  properties: Property[];
  tenants: TenantSummary[];
  leases: Lease[];
  workOrders: WorkOrder[];
  series: {
    months: Array<{ label: string; income: number; expenses: number; occupancyPct: number }>;
    quarters: Array<{ label: string; value: number; debt: number }>;
  };
  funnel: { applications: number; screenings: number; leases: number };
  kpis: {
    occupancyPct: number;
    avgTurnDays: number;
    collectionRatePct: number;
    highPriorityWorkOrders: number;
    noiMTD: number; // in cents
  };
}

export interface UseDashboardDataResult {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

function validateData(): DashboardData {
  try {
    // Validate data shapes at runtime (dev only)
    const properties = MOCK_PROPERTIES.map(p => {
      try {
        return PropertySchema.parse(p);
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Invalid property data:', p, e);
        }
        return null;
      }
    }).filter(Boolean) as Property[];

    const tenants = MOCK_TENANTS.map(t => {
      try {
        return TenantSummarySchema.parse(t);
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Invalid tenant data:', t, e);
        }
        return null;
      }
    }).filter(Boolean) as TenantSummary[];

    const leases = MOCK_LEASES.map(l => {
      try {
        return LeaseSchema.parse(l);
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Invalid lease data:', l, e);
        }
        return null;
      }
    }).filter(Boolean) as Lease[];

    const workOrders = MOCK_WORK_ORDERS.map(w => {
      try {
        return WorkOrderSchema.parse(w);
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Invalid work order data:', w, e);
        }
        return null;
      }
    }).filter(Boolean) as WorkOrder[];

    return {
      properties,
      tenants,
      leases,
      workOrders,
      series: MOCK_TIME_SERIES,
      funnel: MOCK_LEASING_FUNNEL,
      kpis: MOCK_KPIS,
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Data validation failed:', error);
    }
    // Return safe defaults
    return {
      properties: [],
      tenants: [],
      leases: [],
      workOrders: [],
      series: { months: [], quarters: [] },
      funnel: { applications: 0, screenings: 0, leases: 0 },
      kpis: { occupancyPct: 0, avgTurnDays: 0, collectionRatePct: 0, highPriorityWorkOrders: 0, noiMTD: 0 },
    };
  }
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

    // Simulate API latency
    const latency = 300 + Math.random() * 300; // 300-600ms

    const timeoutId = setTimeout(() => {
      if (controller.signal.aborted) return;

      try {
        const validatedData = validateData();
        
        // Filter data based on range if needed
        // For now, returning all data regardless of range
        setData(validatedData);
        setError(null);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
          setData(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, latency);

    // Cleanup
    return () => {
      controller.abort();
      clearTimeout(timeoutId);
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