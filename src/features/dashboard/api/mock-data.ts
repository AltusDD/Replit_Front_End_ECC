// src/features/dashboard/api/mock-data.ts
import { z } from 'zod';

export const PropertySchema = z.object({
  id: z.string(),
  address1: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  lat: z.number(),
  lng: z.number(),
  status: z.enum(['occupied', 'vacant', 'delinquent']),
  marketRent: z.number(),
  currentRent: z.number(),
  units: z.number(),
});

export const TenantSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  propertyId: z.string(),
  balanceDue: z.number(),
  isDelinquent: z.boolean(),
});

export const LeaseSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  propertyId: z.string(),
  unitLabel: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  status: z.enum(['active', 'ended']),
});

export const WorkOrderSchema = z.object({
  id: z.string(),
  propertyId: z.string(),
  priority: z.enum(['high', 'normal']),
  createdAt: z.string(),
  summary: z.string(),
  assignedVendor: z.string().optional(),
});

export type Property = z.infer<typeof PropertySchema>;
export type TenantSummary = z.infer<typeof TenantSummarySchema>;
export type Lease = z.infer<typeof LeaseSchema>;
export type WorkOrder = z.infer<typeof WorkOrderSchema>;

// Generate properties across IN/GA/IL cities
export const MOCK_PROPERTIES: Property[] = [
  // Gary, IN properties
  { id: '1', address1: '2384 Wheeler Ave', city: 'Gary', state: 'IN', zip: '46407', lat: 41.5868, lng: -87.3467, status: 'occupied', marketRent: 1500, currentRent: 1500, units: 1 },
  { id: '2', address1: '723 Mississippi St', city: 'Gary', state: 'IN', zip: '46402', lat: 41.5934, lng: -87.3289, status: 'occupied', marketRent: 1400, currentRent: 1400, units: 1 },
  { id: '3', address1: '608 Tennessee St', city: 'Gary', state: 'IN', zip: '46402', lat: 41.5901, lng: -87.3156, status: 'vacant', marketRent: 1600, currentRent: 0, units: 1 },
  { id: '4', address1: '383 Lincoln St', city: 'Gary', state: 'IN', zip: '46407', lat: 41.5823, lng: -87.3401, status: 'delinquent', marketRent: 1600, currentRent: 1600, units: 1 },
  { id: '5', address1: '2670 E 22nd Pl', city: 'Gary', state: 'IN', zip: '46407', lat: 41.5756, lng: -87.3234, status: 'occupied', marketRent: 1600, currentRent: 1600, units: 1 },
  
  // Macon, GA properties  
  { id: '6', address1: '3454 Lawton Rd', city: 'Macon', state: 'GA', zip: '31204', lat: 32.8407, lng: -83.6324, status: 'occupied', marketRent: 940, currentRent: 940, units: 1 },
  { id: '7', address1: '2373 Jefferson St', city: 'Macon', state: 'GA', zip: '31201', lat: 32.8354, lng: -83.6458, status: 'occupied', marketRent: 1200, currentRent: 1200, units: 1 },
  { id: '8', address1: '1847 Adams Ave', city: 'Macon', state: 'GA', zip: '31204', lat: 32.8423, lng: -83.6198, status: 'vacant', marketRent: 1100, currentRent: 0, units: 1 },
  { id: '9', address1: '4521 Northside Dr', city: 'Macon', state: 'GA', zip: '31210', lat: 32.8601, lng: -83.6789, status: 'delinquent', marketRent: 1350, currentRent: 1350, units: 1 },
  { id: '10', address1: '678 Spring St', city: 'Macon', state: 'GA', zip: '31201', lat: 32.8412, lng: -83.6523, status: 'occupied', marketRent: 1050, currentRent: 1050, units: 1 },
  
  // Chicago, IL properties
  { id: '11', address1: '3600 E 9th Ave', city: 'Chicago', state: 'IL', zip: '60609', lat: 41.8781, lng: -87.6298, status: 'occupied', marketRent: 1800, currentRent: 1800, units: 2 },
  { id: '12', address1: '5847 S Cottage Grove', city: 'Chicago', state: 'IL', zip: '60637', lat: 41.7901, lng: -87.6064, status: 'vacant', marketRent: 1900, currentRent: 0, units: 2 },
  { id: '13', address1: '7234 S Stony Island', city: 'Chicago', state: 'IL', zip: '60649', lat: 41.7654, lng: -87.5867, status: 'delinquent', marketRent: 2100, currentRent: 2100, units: 2 },
  { id: '14', address1: '8912 S Commercial', city: 'Chicago', state: 'IL', zip: '60617', lat: 41.7334, lng: -87.5512, status: 'occupied', marketRent: 1750, currentRent: 1750, units: 1 },
  { id: '15', address1: '4567 W 63rd St', city: 'Chicago', state: 'IL', zip: '60629', lat: 41.7789, lng: -87.7345, status: 'occupied', marketRent: 1650, currentRent: 1650, units: 1 },
  
  // Additional properties across cities
  { id: '16', address1: '1234 Main St', city: 'Gary', state: 'IN', zip: '46408', lat: 41.5956, lng: -87.3012, status: 'vacant', marketRent: 1300, currentRent: 0, units: 1 },
  { id: '17', address1: '5678 Oak Ave', city: 'Macon', state: 'GA', zip: '31206', lat: 32.8234, lng: -83.6789, status: 'occupied', marketRent: 1250, currentRent: 1250, units: 1 },
  { id: '18', address1: '9101 Elm St', city: 'Chicago', state: 'IL', zip: '60618', lat: 41.9456, lng: -87.6543, status: 'delinquent', marketRent: 2000, currentRent: 2000, units: 2 },
  { id: '19', address1: '2468 Pine Rd', city: 'Gary', state: 'IN', zip: '46409', lat: 41.5723, lng: -87.2987, status: 'occupied', marketRent: 1400, currentRent: 1400, units: 1 },
  { id: '20', address1: '1357 Cedar Ln', city: 'Macon', state: 'GA', zip: '31211', lat: 32.8567, lng: -83.6234, status: 'vacant', marketRent: 1150, currentRent: 0, units: 1 },

  // Continue generating more properties
  ...Array.from({ length: 30 }, (_, i) => {
    const cities = [
      { city: 'Gary', state: 'IN', zip: '46402', lat: 41.5934, lng: -87.3289 },
      { city: 'Macon', state: 'GA', zip: '31201', lat: 32.8354, lng: -83.6458 },
      { city: 'Chicago', state: 'IL', zip: '60609', lat: 41.8781, lng: -87.6298 },
      { city: 'Hammond', state: 'IN', zip: '46320', lat: 41.5834, lng: -87.5000 },
      { city: 'East Chicago', state: 'IN', zip: '46312', lat: 41.6389, lng: -87.4548 },
      { city: 'Warner Robins', state: 'GA', zip: '31088', lat: 32.6130, lng: -83.6241 }
    ];
    const cityData = cities[i % cities.length];
    const statuses: Property['status'][] = ['occupied', 'vacant', 'delinquent'];
    const status = statuses[i % 3];
    const marketRent = 1000 + (i * 50) % 1500;
    
    return {
      id: `${21 + i}`,
      address1: `${1000 + i * 10} Property St`,
      ...cityData,
      lat: cityData.lat + (Math.random() - 0.5) * 0.01,
      lng: cityData.lng + (Math.random() - 0.5) * 0.01,
      status,
      marketRent,
      currentRent: status === 'vacant' ? 0 : marketRent,
      units: Math.floor(Math.random() * 3) + 1,
    };
  })
];

export const MOCK_TENANTS: TenantSummary[] = [
  { id: '1', name: 'Aaliyah Scott', propertyId: '1', balanceDue: 0, isDelinquent: false },
  { id: '2', name: 'Aaron Hondras', propertyId: '2', balanceDue: 0, isDelinquent: false },
  { id: '3', name: 'John Delinquent', propertyId: '4', balanceDue: 2400, isDelinquent: true },
  { id: '4', name: 'Mary Late', propertyId: '9', balanceDue: 1350, isDelinquent: true },
  { id: '5', name: 'Bob Behind', propertyId: '13', balanceDue: 4200, isDelinquent: true },
  { id: '6', name: 'Alice Overdue', propertyId: '18', balanceDue: 3000, isDelinquent: true },
  { id: '7', name: 'Charlie Current', propertyId: '5', balanceDue: 0, isDelinquent: false },
  { id: '8', name: 'Diana Default', propertyId: '25', balanceDue: 1800, isDelinquent: true },
  { id: '9', name: 'Edward Evicted', propertyId: '30', balanceDue: 5400, isDelinquent: true },
  { id: '10', name: 'Fiona Failed', propertyId: '35', balanceDue: 2700, isDelinquent: true },
  { id: '11', name: 'George Good', propertyId: '6', balanceDue: 0, isDelinquent: false },
  { id: '12', name: 'Helen Happy', propertyId: '7', balanceDue: 0, isDelinquent: false },
  { id: '13', name: 'Ian Issues', propertyId: '40', balanceDue: 1600, isDelinquent: true },
  { id: '14', name: 'Jane Judgment', propertyId: '45', balanceDue: 3200, isDelinquent: true },
  { id: '15', name: 'Kevin Kicked', propertyId: '48', balanceDue: 2900, isDelinquent: true },
];

export const MOCK_LEASES: Lease[] = [
  // Leases expiring in next 45 days
  { id: '1', tenantId: '1', propertyId: '1', unitLabel: 'Unit A', startDate: '2024-01-01', endDate: '2025-02-15', status: 'active' },
  { id: '2', tenantId: '2', propertyId: '2', unitLabel: 'Unit 1', startDate: '2024-03-01', endDate: '2025-02-28', status: 'active' },
  { id: '3', tenantId: '7', propertyId: '5', unitLabel: 'Apt 1', startDate: '2024-02-15', endDate: '2025-03-01', status: 'active' },
  { id: '4', tenantId: '11', propertyId: '6', unitLabel: 'Unit B', startDate: '2024-04-01', endDate: '2025-03-15', status: 'active' },
  { id: '5', tenantId: '12', propertyId: '7', unitLabel: 'Suite 2', startDate: '2024-05-01', endDate: '2025-03-31', status: 'active' },
  
  // Additional expiring leases
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `${6 + i}`,
    tenantId: `${i + 20}`,
    propertyId: `${(i % 20) + 10}`,
    unitLabel: `Unit ${i + 1}`,
    startDate: '2024-06-01',
    endDate: `2025-0${Math.floor(Math.random() * 2) + 2}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    status: 'active' as const,
  })),
  
  // Some ended leases
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `${21 + i}`,
    tenantId: `${i + 40}`,
    propertyId: `${(i % 10) + 20}`,
    unitLabel: `Unit ${i + 10}`,
    startDate: '2023-01-01',
    endDate: '2024-12-31',
    status: 'ended' as const,
  }))
];

export const MOCK_WORK_ORDERS: WorkOrder[] = [
  { id: '1', propertyId: '1', priority: 'high', createdAt: '2025-01-15T10:30:00Z', summary: 'Broken HVAC system - no heat', assignedVendor: undefined },
  { id: '2', propertyId: '4', priority: 'high', createdAt: '2025-01-14T14:15:00Z', summary: 'Plumbing leak in bathroom', assignedVendor: undefined },
  { id: '3', propertyId: '9', priority: 'high', createdAt: '2025-01-13T09:45:00Z', summary: 'Electrical issues - frequent breaker trips', assignedVendor: 'ABC Electric' },
  { id: '4', propertyId: '13', priority: 'high', createdAt: '2025-01-12T16:20:00Z', summary: 'Water damage from roof leak', assignedVendor: undefined },
  { id: '5', propertyId: '18', priority: 'high', createdAt: '2025-01-11T11:10:00Z', summary: 'Furnace not working - emergency repair needed', assignedVendor: undefined },
  { id: '6', propertyId: '25', priority: 'high', createdAt: '2025-01-10T13:30:00Z', summary: 'Gas leak reported by tenant', assignedVendor: 'Gas Pro Services' },
  { id: '7', propertyId: '30', priority: 'high', createdAt: '2025-01-09T08:45:00Z', summary: 'Sewage backup in basement', assignedVendor: undefined },
  { id: '8', propertyId: '35', priority: 'high', createdAt: '2025-01-08T15:20:00Z', summary: 'Broken window needs immediate replacement', assignedVendor: undefined },
  
  // Normal priority work orders
  { id: '9', propertyId: '2', priority: 'normal', createdAt: '2025-01-07T12:00:00Z', summary: 'Kitchen faucet dripping', assignedVendor: 'Handy Helpers' },
  { id: '10', propertyId: '5', priority: 'normal', createdAt: '2025-01-06T10:15:00Z', summary: 'Paint touch-ups needed in living room', assignedVendor: undefined },
  { id: '11', propertyId: '6', priority: 'normal', createdAt: '2025-01-05T14:30:00Z', summary: 'Replace air filter', assignedVendor: 'Maintenance Plus' },
  { id: '12', propertyId: '7', priority: 'normal', createdAt: '2025-01-04T09:20:00Z', summary: 'Caulking around bathtub', assignedVendor: undefined },
];

// Time series data for last 12 months
export const MOCK_TIME_SERIES = {
  months: [
    { label: 'Jan 2024', income: 12450000, expenses: 8200000, occupancyPct: 92 }, // in cents
    { label: 'Feb 2024', income: 12750000, expenses: 7800000, occupancyPct: 94 },
    { label: 'Mar 2024', income: 13100000, expenses: 8400000, occupancyPct: 96 },
    { label: 'Apr 2024', income: 12900000, expenses: 8100000, occupancyPct: 95 },
    { label: 'May 2024', income: 13300000, expenses: 8500000, occupancyPct: 97 },
    { label: 'Jun 2024', income: 13200000, expenses: 8300000, occupancyPct: 96 },
    { label: 'Jul 2024', income: 13500000, expenses: 8600000, occupancyPct: 98 },
    { label: 'Aug 2024', income: 13400000, expenses: 8400000, occupancyPct: 97 },
    { label: 'Sep 2024', income: 13600000, expenses: 8700000, occupancyPct: 98 },
    { label: 'Oct 2024', income: 13300000, expenses: 8500000, occupancyPct: 96 },
    { label: 'Nov 2024', income: 13700000, expenses: 8800000, occupancyPct: 99 },
    { label: 'Dec 2024', income: 13900000, expenses: 9000000, occupancyPct: 98 },
  ],
  quarters: [
    { label: 'Q1 2024', value: 12500000000, debt: 8500000000 }, // in cents
    { label: 'Q2 2024', value: 12800000000, debt: 8300000000 },
    { label: 'Q3 2024', value: 13200000000, debt: 8100000000 },
    { label: 'Q4 2024', value: 13600000000, debt: 7900000000 },
  ]
};

export const MOCK_LEASING_FUNNEL = {
  applications: 45,
  screenings: 32,
  leases: 18,
};

export const MOCK_KPIS = {
  occupancyPct: 96.8,
  avgTurnDays: 18,
  collectionRatePct: 94.2,
  highPriorityWorkOrders: 8,
  noiMTD: 490000, // in cents
};