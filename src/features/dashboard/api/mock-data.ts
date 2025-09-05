// src/features/dashboard/api/mock-data.ts - Data Types and Schemas Only
import { z } from 'zod';

// Type definitions for dashboard data derived from real portfolio API responses
export interface DashboardProperty {
  id: string;
  address1: string;
  city: string;
  state: string;
  zip: string;
  lat?: number;
  lng?: number;
  status: 'occupied' | 'vacant' | 'delinquent';
  marketRent: number;
  currentRent: number;
  units: number;
}

export interface DashboardTenant {
  id: string;
  name: string;
  propertyName?: string;
  unitLabel?: string;
  type: string;
  balance: number;
  isDelinquent: boolean;
}

export interface DashboardLease {
  id: string;
  tenantId?: string;
  propertyId?: string;
  unitLabel?: string;
  startDate?: string;
  endDate?: string;
  status: 'active' | 'ended';
  monthlyRent?: number;
}

export interface DashboardUnit {
  id: string;
  propertyId: string;
  propertyName?: string;
  unitNumber: string;
  marketRent: number;
  currentRent?: number;
  status: 'occupied' | 'vacant' | 'delinquent';
}

export interface DashboardOwner {
  id: string;
  company: string;
  name: string;
  email?: string;
  phone?: string;
  active: boolean;
}

// NO MOCK DATA - all data comes from real API endpoints