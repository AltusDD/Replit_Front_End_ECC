// Genesis Dashboard Mock Data - Rich development data with zod validation
import { z } from 'zod';

// Zod schemas for validation
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

export const TenantSchema = z.object({
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
  monthlyRent: z.number(),
});

export const WorkOrderSchema = z.object({
  id: z.string(),
  propertyId: z.string(),
  priority: z.enum(['high', 'normal']),
  createdAt: z.string(),
  summary: z.string(),
  assignedVendor: z.string().optional(),
});

// Type definitions
export type DashboardProperty = z.infer<typeof PropertySchema>;
export type DashboardTenant = z.infer<typeof TenantSchema>;
export type DashboardLease = z.infer<typeof LeaseSchema>;
export type DashboardWorkOrder = z.infer<typeof WorkOrderSchema>;

// Rich mock data - ≥50 properties, ≥100 leases, ≥50 tenants, ≥12 work orders
export const MOCK_PROPERTIES: DashboardProperty[] = [
  // Austin properties
  { id: 'prop-1', address1: '2401 E 6th St', city: 'Austin', state: 'TX', zip: '78702', lat: 30.2568, lng: -97.7231, status: 'occupied', marketRent: 2200, currentRent: 2100, units: 2 },
  { id: 'prop-2', address1: '1500 S Lamar Blvd', city: 'Austin', state: 'TX', zip: '78704', lat: 30.2518, lng: -97.7831, status: 'vacant', marketRent: 1950, currentRent: 0, units: 1 },
  { id: 'prop-3', address1: '800 Guadalupe St', city: 'Austin', state: 'TX', zip: '78701', lat: 30.2747, lng: -97.7492, status: 'occupied', marketRent: 2800, currentRent: 2750, units: 3 },
  { id: 'prop-4', address1: '1200 W 6th St', city: 'Austin', state: 'TX', zip: '78703', lat: 30.2697, lng: -97.7564, status: 'delinquent', marketRent: 3200, currentRent: 3100, units: 2 },
  { id: 'prop-5', address1: '3500 S Congress Ave', city: 'Austin', state: 'TX', zip: '78704', lat: 30.2361, lng: -97.7545, status: 'occupied', marketRent: 1800, currentRent: 1750, units: 1 },

  // Dallas properties  
  { id: 'prop-6', address1: '2600 McKinney Ave', city: 'Dallas', state: 'TX', zip: '75201', lat: 32.7898, lng: -96.8023, status: 'occupied', marketRent: 2400, currentRent: 2350, units: 2 },
  { id: 'prop-7', address1: '1800 Main St', city: 'Dallas', state: 'TX', zip: '75201', lat: 32.7831, lng: -96.7991, status: 'vacant', marketRent: 2100, currentRent: 0, units: 1 },
  { id: 'prop-8', address1: '3200 Cole Ave', city: 'Dallas', state: 'TX', zip: '75204', lat: 32.8098, lng: -96.7831, status: 'occupied', marketRent: 1950, currentRent: 1900, units: 2 },
  { id: 'prop-9', address1: '4500 Live Oak St', city: 'Dallas', state: 'TX', zip: '75204', lat: 32.7998, lng: -96.7698, status: 'delinquent', marketRent: 2600, currentRent: 2500, units: 3 },
  { id: 'prop-10', address1: '1400 Elm St', city: 'Dallas', state: 'TX', zip: '75202', lat: 32.7831, lng: -96.8065, status: 'occupied', marketRent: 3400, currentRent: 3300, units: 4 },

  // Houston properties
  { id: 'prop-11', address1: '1200 McKinney St', city: 'Houston', state: 'TX', zip: '77010', lat: 29.7564, lng: -95.3698, status: 'occupied', marketRent: 2800, currentRent: 2700, units: 3 },
  { id: 'prop-12', address1: '800 Main St', city: 'Houston', state: 'TX', zip: '77002', lat: 29.7631, lng: -95.3698, status: 'vacant', marketRent: 2200, currentRent: 0, units: 2 },
  { id: 'prop-13', address1: '2000 Louisiana St', city: 'Houston', state: 'TX', zip: '77002', lat: 29.7498, lng: -95.3631, status: 'occupied', marketRent: 1900, currentRent: 1850, units: 1 },
  { id: 'prop-14', address1: '1500 Webster St', city: 'Houston', state: 'TX', zip: '77003', lat: 29.7431, lng: -95.3498, status: 'delinquent', marketRent: 2500, currentRent: 2400, units: 2 },
  { id: 'prop-15', address1: '3100 Montrose Blvd', city: 'Houston', state: 'TX', zip: '77006', lat: 29.7398, lng: -95.3898, status: 'occupied', marketRent: 2100, currentRent: 2000, units: 2 },

  // Additional properties for scale...
  { id: 'prop-16', address1: '900 W 5th St', city: 'Austin', state: 'TX', zip: '78703', lat: 30.2697, lng: -97.7531, status: 'occupied', marketRent: 2600, currentRent: 2550, units: 2 },
  { id: 'prop-17', address1: '1700 Barton Springs Rd', city: 'Austin', state: 'TX', zip: '78704', lat: 30.2631, lng: -97.7731, status: 'vacant', marketRent: 2300, currentRent: 0, units: 1 },
  { id: 'prop-18', address1: '2200 E Cesar Chavez', city: 'Austin', state: 'TX', zip: '78702', lat: 30.2498, lng: -97.7298, status: 'occupied', marketRent: 1750, currentRent: 1700, units: 1 },
  { id: 'prop-19', address1: '1600 Rio Grande St', city: 'Austin', state: 'TX', zip: '78701', lat: 30.2764, lng: -97.7498, status: 'delinquent', marketRent: 2900, currentRent: 2800, units: 3 },
  { id: 'prop-20', address1: '3800 S 1st St', city: 'Austin', state: 'TX', zip: '78704', lat: 30.2331, lng: -97.7631, status: 'occupied', marketRent: 1650, currentRent: 1600, units: 1 },

  // Continue pattern for 50+ total properties...
  // Dallas expansion
  { id: 'prop-21', address1: '2800 Routh St', city: 'Dallas', state: 'TX', zip: '75201', lat: 32.7931, lng: -96.8031, status: 'occupied', marketRent: 2700, currentRent: 2650, units: 2 },
  { id: 'prop-22', address1: '1900 Pacific Ave', city: 'Dallas', state: 'TX', zip: '75201', lat: 32.7831, lng: -96.7931, status: 'vacant', marketRent: 2000, currentRent: 0, units: 1 },
  { id: 'prop-23', address1: '3400 Oak Lawn Ave', city: 'Dallas', state: 'TX', zip: '75219', lat: 32.8031, lng: -96.8131, status: 'occupied', marketRent: 1850, currentRent: 1800, units: 1 },
  { id: 'prop-24', address1: '4200 Cedar Springs Rd', city: 'Dallas', state: 'TX', zip: '75219', lat: 32.8131, lng: -96.8031, status: 'delinquent', marketRent: 2450, currentRent: 2350, units: 2 },
  { id: 'prop-25', address1: '1300 Commerce St', city: 'Dallas', state: 'TX', zip: '75202', lat: 32.7764, lng: -96.8098, status: 'occupied', marketRent: 3100, currentRent: 3000, units: 3 },

  // Houston expansion  
  { id: 'prop-26', address1: '1100 Smith St', city: 'Houston', state: 'TX', zip: '77002', lat: 29.7598, lng: -95.3631, status: 'occupied', marketRent: 2600, currentRent: 2500, units: 2 },
  { id: 'prop-27', address1: '900 Dallas St', city: 'Houston', state: 'TX', zip: '77002', lat: 29.7531, lng: -95.3598, status: 'vacant', marketRent: 1950, currentRent: 0, units: 1 },
  { id: 'prop-28', address1: '2200 Brazos St', city: 'Houston', state: 'TX', zip: '77002', lat: 29.7431, lng: -95.3631, status: 'occupied', marketRent: 1800, currentRent: 1750, units: 1 },
  { id: 'prop-29', address1: '1400 Clay St', city: 'Houston', state: 'TX', zip: '77002', lat: 29.7498, lng: -95.3698, status: 'delinquent', marketRent: 2300, currentRent: 2200, units: 2 },
  { id: 'prop-30', address1: '2900 Richmond Ave', city: 'Houston', state: 'TX', zip: '77098', lat: 29.7331, lng: -95.4131, status: 'occupied', marketRent: 1950, currentRent: 1900, units: 2 },

  // San Antonio properties
  { id: 'prop-31', address1: '200 E Grayson St', city: 'San Antonio', state: 'TX', zip: '78215', lat: 29.4431, lng: -98.4831, status: 'occupied', marketRent: 1700, currentRent: 1650, units: 2 },
  { id: 'prop-32', address1: '1100 S Alamo St', city: 'San Antonio', state: 'TX', zip: '78210', lat: 29.4198, lng: -98.4831, status: 'vacant', marketRent: 1400, currentRent: 0, units: 1 },
  { id: 'prop-33', address1: '800 E Houston St', city: 'San Antonio', state: 'TX', zip: '78205', lat: 29.4298, lng: -98.4798, status: 'occupied', marketRent: 1550, currentRent: 1500, units: 1 },
  { id: 'prop-34', address1: '1500 Broadway', city: 'San Antonio', state: 'TX', zip: '78215', lat: 29.4398, lng: -98.4731, status: 'delinquent', marketRent: 1900, currentRent: 1800, units: 2 },
  { id: 'prop-35', address1: '600 Navarro St', city: 'San Antonio', state: 'TX', zip: '78205', lat: 29.4264, lng: -98.4931, status: 'occupied', marketRent: 1650, currentRent: 1600, units: 1 },

  // Continue to reach 50+ properties with varied statuses and locations...
  { id: 'prop-36', address1: '1800 E 7th St', city: 'Austin', state: 'TX', zip: '78702', lat: 30.2598, lng: -97.7264, status: 'occupied', marketRent: 1850, currentRent: 1800, units: 1 },
  { id: 'prop-37', address1: '2500 Webberville Rd', city: 'Austin', state: 'TX', zip: '78702', lat: 30.2531, lng: -97.7131, status: 'vacant', marketRent: 1600, currentRent: 0, units: 1 },
  { id: 'prop-38', address1: '1900 E 11th St', city: 'Austin', state: 'TX', zip: '78702', lat: 30.2631, lng: -97.7231, status: 'occupied', marketRent: 1750, currentRent: 1700, units: 2 },
  { id: 'prop-39', address1: '2800 E Martin Luther King Jr Blvd', city: 'Austin', state: 'TX', zip: '78702', lat: 30.2531, lng: -97.7064, status: 'delinquent', marketRent: 1950, currentRent: 1850, units: 2 },
  { id: 'prop-40', address1: '3200 Manor Rd', city: 'Austin', state: 'TX', zip: '78723', lat: 30.2731, lng: -97.7131, status: 'occupied', marketRent: 1700, currentRent: 1650, units: 1 },

  // More Dallas
  { id: 'prop-41', address1: '3600 Gaston Ave', city: 'Dallas', state: 'TX', zip: '75246', lat: 32.7931, lng: -96.7731, status: 'occupied', marketRent: 1800, currentRent: 1750, units: 2 },
  { id: 'prop-42', address1: '2400 Swiss Ave', city: 'Dallas', state: 'TX', zip: '75204', lat: 32.7898, lng: -96.7831, status: 'vacant', marketRent: 2200, currentRent: 0, units: 2 },
  { id: 'prop-43', address1: '1700 N Henderson Ave', city: 'Dallas', state: 'TX', zip: '75206', lat: 32.8031, lng: -96.7731, status: 'occupied', marketRent: 1950, currentRent: 1900, units: 1 },
  { id: 'prop-44', address1: '2900 Exposition Ave', city: 'Dallas', state: 'TX', zip: '75226', lat: 32.7731, lng: -96.7598, status: 'delinquent', marketRent: 2100, currentRent: 2000, units: 2 },
  { id: 'prop-45', address1: '3800 Junius St', city: 'Dallas', state: 'TX', zip: '75246', lat: 32.7831, lng: -96.7631, status: 'occupied', marketRent: 1750, currentRent: 1700, units: 1 },

  // More Houston
  { id: 'prop-46', address1: '1800 Sul Ross St', city: 'Houston', state: 'TX', zip: '77006', lat: 29.7331, lng: -95.3931, status: 'occupied', marketRent: 2000, currentRent: 1950, units: 2 },
  { id: 'prop-47', address1: '2400 Westheimer Rd', city: 'Houston', state: 'TX', zip: '77098', lat: 29.7398, lng: -95.4098, status: 'vacant', marketRent: 1850, currentRent: 0, units: 1 },
  { id: 'prop-48', address1: '1600 Shepherd Dr', city: 'Houston', state: 'TX', zip: '77007', lat: 29.7698, lng: -95.4031, status: 'occupied', marketRent: 1700, currentRent: 1650, units: 1 },
  { id: 'prop-49', address1: '2800 Alabama St', city: 'Houston', state: 'TX', zip: '77004', lat: 29.7264, lng: -95.3831, status: 'delinquent', marketRent: 1950, currentRent: 1850, units: 2 },
  { id: 'prop-50', address1: '3400 Kirby Dr', city: 'Houston', state: 'TX', zip: '77098', lat: 29.7231, lng: -95.4131, status: 'occupied', marketRent: 2200, currentRent: 2100, units: 2 },
];

// Generate ≥50 tenants
export const MOCK_TENANTS: DashboardTenant[] = [
  { id: 'tenant-1', name: 'Sarah Johnson', propertyId: 'prop-1', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-2', name: 'Michael Chen', propertyId: 'prop-3', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-3', name: 'Emily Rodriguez', propertyId: 'prop-4', balanceDue: 850, isDelinquent: true },
  { id: 'tenant-4', name: 'David Wilson', propertyId: 'prop-5', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-5', name: 'Lisa Thompson', propertyId: 'prop-6', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-6', name: 'James Martinez', propertyId: 'prop-8', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-7', name: 'Ashley Davis', propertyId: 'prop-9', balanceDue: 1200, isDelinquent: true },
  { id: 'tenant-8', name: 'Ryan O\'Connor', propertyId: 'prop-10', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-9', name: 'Jennifer Lee', propertyId: 'prop-11', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-10', name: 'Kevin Brown', propertyId: 'prop-13', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-11', name: 'Amanda Garcia', propertyId: 'prop-14', balanceDue: 950, isDelinquent: true },
  { id: 'tenant-12', name: 'Chris Taylor', propertyId: 'prop-15', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-13', name: 'Nicole White', propertyId: 'prop-16', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-14', name: 'Daniel Kim', propertyId: 'prop-18', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-15', name: 'Rachel Green', propertyId: 'prop-19', balanceDue: 1450, isDelinquent: true },
  // Continue pattern to reach 50+ tenants...
  { id: 'tenant-16', name: 'Mark Anderson', propertyId: 'prop-20', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-17', name: 'Jessica Miller', propertyId: 'prop-21', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-18', name: 'Tyler Jackson', propertyId: 'prop-23', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-19', name: 'Samantha Clark', propertyId: 'prop-24', balanceDue: 750, isDelinquent: true },
  { id: 'tenant-20', name: 'Brandon Lopez', propertyId: 'prop-25', balanceDue: 0, isDelinquent: false },
  // Add more to reach 50+...
  { id: 'tenant-21', name: 'Megan Turner', propertyId: 'prop-26', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-22', name: 'Jordan Scott', propertyId: 'prop-28', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-23', name: 'Allison Wright', propertyId: 'prop-29', balanceDue: 680, isDelinquent: true },
  { id: 'tenant-24', name: 'Nathan Hill', propertyId: 'prop-30', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-25', name: 'Victoria Adams', propertyId: 'prop-31', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-26', name: 'Austin Campbell', propertyId: 'prop-33', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-27', name: 'Stephanie Moore', propertyId: 'prop-34', balanceDue: 920, isDelinquent: true },
  { id: 'tenant-28', name: 'Derek Nelson', propertyId: 'prop-35', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-29', name: 'Brittany Parker', propertyId: 'prop-36', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-30', name: 'Caleb Evans', propertyId: 'prop-38', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-31', name: 'Hannah Roberts', propertyId: 'prop-39', balanceDue: 1100, isDelinquent: true },
  { id: 'tenant-32', name: 'Isaac Torres', propertyId: 'prop-40', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-33', name: 'Morgan Reed', propertyId: 'prop-41', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-34', name: 'Ethan Cooper', propertyId: 'prop-43', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-35', name: 'Chloe Bailey', propertyId: 'prop-44', balanceDue: 540, isDelinquent: true },
  { id: 'tenant-36', name: 'Lucas Rivera', propertyId: 'prop-45', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-37', name: 'Grace Mitchell', propertyId: 'prop-46', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-38', name: 'Alexander Bell', propertyId: 'prop-48', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-39', name: 'Zoe Murphy', propertyId: 'prop-49', balanceDue: 1650, isDelinquent: true },
  { id: 'tenant-40', name: 'Owen Phillips', propertyId: 'prop-50', balanceDue: 0, isDelinquent: false },
  // Add 10 more to reach 50
  { id: 'tenant-41', name: 'Maya Collins', propertyId: 'prop-1', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-42', name: 'Carter Watson', propertyId: 'prop-3', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-43', name: 'Ella Sanders', propertyId: 'prop-6', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-44', name: 'Mason Price', propertyId: 'prop-8', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-45', name: 'Aria Bennett', propertyId: 'prop-11', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-46', name: 'Liam Foster', propertyId: 'prop-13', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-47', name: 'Layla Gray', propertyId: 'prop-16', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-48', name: 'Noah James', propertyId: 'prop-21', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-49', name: 'Sofia Ward', propertyId: 'prop-26', balanceDue: 0, isDelinquent: false },
  { id: 'tenant-50', name: 'Logan Perry', propertyId: 'prop-31', balanceDue: 0, isDelinquent: false },
];

// Generate ≥100 leases
export const MOCK_LEASES: DashboardLease[] = Array.from({ length: 120 }, (_, i) => {
  const now = new Date();
  const startDate = new Date(now.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000);
  const endDate = new Date(startDate.getTime() + (Math.random() * 24 + 6) * 30 * 24 * 60 * 60 * 1000);
  const isActive = endDate > now;
  const propertyIndex = i % MOCK_PROPERTIES.length;
  const property = MOCK_PROPERTIES[propertyIndex];
  
  return {
    id: `lease-${i + 1}`,
    tenantId: i < MOCK_TENANTS.length ? MOCK_TENANTS[i % MOCK_TENANTS.length].id : `tenant-${i + 1}`,
    propertyId: property.id,
    unitLabel: `${property.address1} Unit ${(i % 4) + 1}`,
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    status: isActive ? 'active' : 'ended',
    monthlyRent: property.currentRent,
  };
});

// Generate ≥12 work orders
export const MOCK_WORK_ORDERS: DashboardWorkOrder[] = [
  { id: 'wo-1', propertyId: 'prop-1', priority: 'high', createdAt: '2025-09-01T10:00:00Z', summary: 'Plumbing leak in kitchen', assignedVendor: 'ABC Plumbing' },
  { id: 'wo-2', propertyId: 'prop-3', priority: 'high', createdAt: '2025-09-02T14:30:00Z', summary: 'HVAC system malfunction' },
  { id: 'wo-3', propertyId: 'prop-6', priority: 'normal', createdAt: '2025-09-01T09:15:00Z', summary: 'Replace broken window', assignedVendor: 'Glass Pro' },
  { id: 'wo-4', propertyId: 'prop-8', priority: 'high', createdAt: '2025-09-03T16:45:00Z', summary: 'Electrical outlet not working' },
  { id: 'wo-5', propertyId: 'prop-11', priority: 'normal', createdAt: '2025-08-31T08:20:00Z', summary: 'Paint touch-up needed', assignedVendor: 'Paint Masters' },
  { id: 'wo-6', propertyId: 'prop-14', priority: 'high', createdAt: '2025-09-04T11:10:00Z', summary: 'Refrigerator not cooling' },
  { id: 'wo-7', propertyId: 'prop-16', priority: 'normal', createdAt: '2025-09-01T13:25:00Z', summary: 'Carpet cleaning required', assignedVendor: 'Clean Team' },
  { id: 'wo-8', propertyId: 'prop-21', priority: 'high', createdAt: '2025-09-03T12:40:00Z', summary: 'Water heater replacement' },
  { id: 'wo-9', propertyId: 'prop-25', priority: 'normal', createdAt: '2025-09-02T15:55:00Z', summary: 'Fence repair needed', assignedVendor: 'Fence Fixers' },
  { id: 'wo-10', propertyId: 'prop-28', priority: 'high', createdAt: '2025-09-04T09:30:00Z', summary: 'Smoke detector battery replacement' },
  { id: 'wo-11', propertyId: 'prop-33', priority: 'normal', createdAt: '2025-09-01T17:15:00Z', summary: 'Landscape maintenance', assignedVendor: 'Green Thumb' },
  { id: 'wo-12', propertyId: 'prop-38', priority: 'high', createdAt: '2025-09-04T14:20:00Z', summary: 'Garage door motor replacement' },
  { id: 'wo-13', propertyId: 'prop-42', priority: 'normal', createdAt: '2025-09-02T10:35:00Z', summary: 'Gutter cleaning', assignedVendor: 'Gutter Guys' },
  { id: 'wo-14', propertyId: 'prop-45', priority: 'high', createdAt: '2025-09-03T18:50:00Z', summary: 'Foundation crack inspection' },
  { id: 'wo-15', propertyId: 'prop-48', priority: 'normal', createdAt: '2025-09-01T07:45:00Z', summary: 'Driveway resurfacing', assignedVendor: 'Pave It Right' },
];

// Last 12 months series data
export const MOCK_SERIES = {
  months: [
    { month: '2024-10', income: 485000, expenses: 295000, occupancyPct: 0.92 },
    { month: '2024-11', income: 492000, expenses: 301000, occupancyPct: 0.94 },
    { month: '2024-12', income: 498000, expenses: 285000, occupancyPct: 0.96 },
    { month: '2025-01', income: 502000, expenses: 310000, occupancyPct: 0.95 },
    { month: '2025-02', income: 489000, expenses: 298000, occupancyPct: 0.93 },
    { month: '2025-03', income: 515000, expenses: 305000, occupancyPct: 0.97 },
    { month: '2025-04', income: 521000, expenses: 312000, occupancyPct: 0.98 },
    { month: '2025-05', income: 518000, expenses: 298000, occupancyPct: 0.96 },
    { month: '2025-06', income: 535000, expenses: 318000, occupancyPct: 0.97 },
    { month: '2025-07', income: 542000, expenses: 325000, occupancyPct: 0.98 },
    { month: '2025-08', income: 538000, expenses: 315000, occupancyPct: 0.97 },
    { month: '2025-09', income: 545000, expenses: 320000, occupancyPct: 0.96 },
  ],
  quarters: [
    { quarter: '2024-Q4', value: 12500000, debt: 7800000 },
    { quarter: '2025-Q1', value: 12850000, debt: 7650000 },
    { quarter: '2025-Q2', value: 13200000, debt: 7500000 },
    { quarter: '2025-Q3', value: 13450000, debt: 7350000 },
  ],
};

// Funnel data (last 90 days)
export const MOCK_FUNNEL = {
  applications: 284,
  screenings: 198,
  leases: 142,
};

// Validation function
export function validateDashboardData(data: any) {
  try {
    if (data.properties) {
      data.properties.forEach((p: any, i: number) => {
        const result = PropertySchema.safeParse(p);
        if (!result.success) {
          console.warn(`Property ${i} validation failed:`, result.error.issues);
        }
      });
    }

    if (data.tenants) {
      data.tenants.forEach((t: any, i: number) => {
        const result = TenantSchema.safeParse(t);
        if (!result.success) {
          console.warn(`Tenant ${i} validation failed:`, result.error.issues);
        }
      });
    }

    if (data.leases) {
      data.leases.forEach((l: any, i: number) => {
        const result = LeaseSchema.safeParse(l);
        if (!result.success) {
          console.warn(`Lease ${i} validation failed:`, result.error.issues);
        }
      });
    }

    if (data.workOrders) {
      data.workOrders.forEach((w: any, i: number) => {
        const result = WorkOrderSchema.safeParse(w);
        if (!result.success) {
          console.warn(`Work Order ${i} validation failed:`, result.error.issues);
        }
      });
    }
  } catch (error) {
    console.warn('Dashboard data validation error:', error);
  }
}